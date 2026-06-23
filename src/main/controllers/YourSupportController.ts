import { Response } from 'express';

import { Form } from '../components/form/form';
import { CaseStateCheck } from '../decorators/CaseStateCheck';
import { AppRequest } from '../definitions/appRequest';
import { CaseFlags, YesOrNo } from '../definitions/case';
import { AuthUrls, PageUrls, TranslationKeys } from '../definitions/constants';
import { CaseState } from '../definitions/definition';
import { FormContent, FormFields } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';
import { getLogger } from '../logger';

import {
  type CUIClient,
  type CUIFlagDetails,
  type CUIJourneyData,
  type CUIStartJourneyAuth,
  type CUIStartJourneyRequest,
  type CUIStartJourneyResponse,
  getCuiService,
} from './../services/CuiService';
import type { IS2SService } from './../services/S2SService';
import { getServiceUrl } from './../utils/getServiceUrl';
import { handleUpdateDraftCase, setUserCase } from './helpers/CaseHelpers';
import { getPageContent } from './helpers/FormHelpers';
import { setUrlLanguage } from './helpers/LanguageHelper';
import { getLanguageCode, returnValidUrl } from './helpers/RouterHelpers';

const logger = getLogger('YourSupportController');
const CUI_MASTER_FLAG_CODE = 'RA0001';
const CUI_SUBMIT_ACTION = 'submit';
const YOUR_SUPPORT_TEMPLATE = 'your-support';
const YOUR_SUPPORT_FIELD = 'reasonableAdjustments';
const YOUR_SUPPORT_REDIRECT_ERROR = 'yourSupportRedirect';

export default class YourSupportController {
  private s2sService?: IS2SService;
  private readonly form: Form;

  private readonly yourSupportContent: FormContent = {
    fields: {
      reasonableAdjustments: {
        id: YOUR_SUPPORT_FIELD,
        type: 'text',
        hidden: true,
        label: (l: AnyRecord): string => l.legend,
        labelHidden: true,
      },
    },
  };

  constructor(s2sService?: IS2SService) {
    this.s2sService = s2sService;
    this.form = new Form(<FormFields>this.yourSupportContent.fields);
  }

  @CaseStateCheck()
  public get = async (req: AppRequest, res: Response): Promise<void> => {
    const content = getPageContent(req, this.yourSupportContent, [
      TranslationKeys.COMMON,
      TranslationKeys.YOUR_SUPPORT,
    ]);
    const cancelLink = this.getExitUrl(req);
    const sessionErrors = req.session?.errors || [];
    req.session.errors = [];

    res.render(YOUR_SUPPORT_TEMPLATE, {
      ...content,
      cancelLink,
      sessionErrors,
      supportNo: YesOrNo.NO,
      supportYes: YesOrNo.YES,
    });
  };

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    setUserCase(req, this.form);

    switch (req.session.userCase?.reasonableAdjustments) {
      case YesOrNo.YES:
        return this.redirectToCuiJourney(req, res);
      case YesOrNo.NO:
        return this.redirectNoSupport(req, res);
      default:
        return this.redirectWithRequiredError(req, res);
    }
  };

  public redirectToCuiJourney = async (req: AppRequest, res: Response): Promise<void> => {
    req.session.errors = [];

    try {
      const results = await this.startCuiJourney(req);

      if (!results || !results.url) {
        logger.error('No URL returned from CUI service');
        res.redirect(PageUrls.HOME);
        return;
      }

      res.redirect(results.url);
    } catch (error) {
      req.session.errors.push({ propertyName: YOUR_SUPPORT_REDIRECT_ERROR, errorType: 'required' });
      logger.error('Error starting CUI journey', error);
      res.redirect(setUrlLanguage(req, PageUrls.YOUR_SUPPORT));
    }
  };

  public callback = async (req: AppRequest, res: Response): Promise<void> => {
    try {
      const result = await this.getCuiJourneyData(req);
      this.validateJourneyCorrelationId(req, result);

      if (!this.isSubmittedJourney(result)) {
        logger.info(
          `CUI journey completed with action "${result.action}", redirecting back to case page without updating flags`
        );
        res.redirect(this.getExitUrl(req, true));
        return;
      }

      await this.saveSubmittedJourney(req, result);
      res.redirect(this.getCuiCompletionUrl(req));
    } catch (error) {
      logger.error('Error retrieving CUI journey data', error);
      res.redirect(PageUrls.HOME);
    }
  };

  public confirmation = async (req: AppRequest, res: Response): Promise<void> => {
    const link = this.getExitUrl(req);

    const translations: AnyRecord = {
      ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
      ...req.t(TranslationKeys.YOUR_SUPPORT_CONFIRMATION, { returnObjects: true }),
    };
    const sessionErrors = req.session?.errors || [];
    req.session.errors = [];

    res.render('your-support-confirmation', {
      ...translations,
      sessionErrors,
      link,
    });
  };

  private async redirectNoSupport(req: AppRequest, res: Response): Promise<void> {
    req.session.errors = [];
    await this.updateDraftCaseIfNeeded(req);
    res.redirect(this.getExitUrl(req, true));
  }

  private redirectWithRequiredError(req: AppRequest, res: Response): void {
    req.session.errors = [{ propertyName: YOUR_SUPPORT_FIELD, errorType: 'required' }];
    res.redirect(setUrlLanguage(req, PageUrls.YOUR_SUPPORT));
  }

  private async updateDraftCaseIfNeeded(req: AppRequest): Promise<void> {
    if (req.session.userCase?.state === CaseState.AWAITING_SUBMISSION_TO_HMCTS) {
      await handleUpdateDraftCase(req, logger);
    }
  }

  private async startCuiJourney(req: AppRequest): Promise<CUIStartJourneyResponse> {
    return this.getCuiClient(req).startJourney(this.getStartJourneyRequest(req), await this.getStartJourneyAuth(req));
  }

  private getStartJourneyRequest(req: AppRequest): CUIStartJourneyRequest {
    return {
      callbackUrl: getServiceUrl(req, PageUrls.YOUR_SUPPORT_CALLBACK),
      correlationId: this.getCaseId(req),
      existingFlags: this.getExistingFlags(req),
      language: getLanguageCode(req.url),
      masterFlagCode: CUI_MASTER_FLAG_CODE,
    };
  }

  private async getStartJourneyAuth(req: AppRequest): Promise<CUIStartJourneyAuth> {
    return {
      serviceToken: await this.getS2SService().getToken(),
      idamToken: req.session.user?.accessToken ?? '',
    };
  }

  private getExistingFlags(req: AppRequest): CUIFlagDetails {
    const userCase = req.session?.userCase;
    const claimantExternalFlags = userCase?.claimantExternalFlags;

    return {
      ...claimantExternalFlags,
      partyName: claimantExternalFlags?.partyName || userCase?.claimantName || '',
      roleOnCase: claimantExternalFlags?.roleOnCase || this.getRoleOnCase(req),
      details: claimantExternalFlags?.details ?? [],
    } as unknown as CUIFlagDetails;
  }

  private getRoleOnCase(req: AppRequest): string {
    return req.session?.userCase?.claimantRepresentativeOrganisationPolicy ? 'Representative' : 'Claimant';
  }

  private async getCuiJourneyData(req: AppRequest): Promise<CUIJourneyData> {
    return this.getCuiClient(req).getJourneyData(this.getJourneyId(req), {
      serviceToken: await this.getS2SService().getToken(),
    });
  }

  private getJourneyId(req: AppRequest): string {
    const id = req.params.id;
    return String(Array.isArray(id) ? id[0] : id ?? '');
  }

  private validateJourneyCorrelationId(req: AppRequest, result: CUIJourneyData): void {
    if (result.correlationId !== this.getCaseId(req)) {
      throw new Error('Correlation ID does not match case ID');
    }
  }

  private isSubmittedJourney(result: CUIJourneyData): boolean {
    return result.action === CUI_SUBMIT_ACTION;
  }

  private async saveSubmittedJourney(req: AppRequest, result: CUIJourneyData): Promise<void> {
    if (!result.replacementFlags) {
      throw new Error('CUI journey completed without replacement flags');
    }

    this.setReplacementFlags(req, result.replacementFlags);
    await handleUpdateDraftCase(req, logger);

    if (req.session.userCase?.updateDraftCaseError) {
      throw new Error('Failed to save CUI replacement flags');
    }
  }

  private setReplacementFlags(req: AppRequest, replacementFlags: CUIFlagDetails): void {
    const claimantExternalFlags = {
      ...req.session.userCase?.claimantExternalFlags,
      ...replacementFlags,
      details: replacementFlags.details ?? [],
    } as unknown as CaseFlags;

    req.session.userCase = {
      ...req.session.userCase,
      claimantExternalFlags,
    };
  }

  private getCuiClient(req: AppRequest): CUIClient {
    return getCuiService(getServiceUrl(req, AuthUrls.LOGOUT));
  }

  private getCaseId(req: AppRequest): string {
    return String(req.session?.userCase?.id ?? '');
  }

  private getExitUrl(req: AppRequest, consumeReturnUrl = false): string {
    if (req.session?.returnUrl) {
      const returnUrl = req.session.returnUrl;
      if (consumeReturnUrl) {
        req.session.returnUrl = undefined;
      }
      return returnValidUrl(returnUrl);
    }

    const userCase = req.session?.userCase;

    if (userCase?.state === CaseState.AWAITING_SUBMISSION_TO_HMCTS) {
      return setUrlLanguage(req, PageUrls.PERSONAL_DETAILS_CHECK);
    }

    if (userCase?.id) {
      return setUrlLanguage(req, PageUrls.CITIZEN_HUB.replace(':caseId', userCase.id));
    }

    return setUrlLanguage(req, PageUrls.CLAIMANT_APPLICATIONS);
  }

  private getCuiCompletionUrl(req: AppRequest): string {
    if (req.session?.userCase?.state === CaseState.AWAITING_SUBMISSION_TO_HMCTS) {
      return this.getExitUrl(req, true);
    }

    return setUrlLanguage(req, PageUrls.YOUR_SUPPORT_CONFIRMATION);
  }

  private getS2SService(): IS2SService {
    if (!this.s2sService) {
      const { getS2SService } = require('./../services/S2SService') as typeof import('./../services/S2SService');
      this.s2sService = getS2SService();
    }

    return this.s2sService;
  }
}
