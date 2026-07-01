import { Response } from 'express';

import { Form } from '../components/form/form';
import { AppRequest } from '../definitions/appRequest';
import { YesOrNo } from '../definitions/case';
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
import { handleUpdateDraftCase, handleUpdateSubmittedCaseFlags, setUserCase } from './helpers/CaseHelpers';
import { buildCuiFlagDetails, mergeClaimantExternalFlags } from './helpers/CuiFlagHelper';
import { getPageContent } from './helpers/FormHelpers';
import { setUrlLanguage } from './helpers/LanguageHelper';
import { getLanguageCode, returnValidUrl } from './helpers/RouterHelpers';

const logger = getLogger('YourSupportController');
const CUI_MASTER_FLAG_CODE = 'RA0001';
const CUI_SUBMIT_ACTION = 'submit';
const YOUR_SUPPORT_TEMPLATE = 'your-support';
const YOUR_SUPPORT_CONFIRMATION_TEMPLATE = 'your-support-confirmation';
const YOUR_SUPPORT_SUBMITTED_CONFIRMATION_TEMPLATE = 'your-support-submitted-confirmation';
const YOUR_SUPPORT_FIELD = 'reasonableAdjustments';
const YOUR_SUPPORT_REDIRECT_ERROR = 'yourSupportRedirect';

const formatError = (error: unknown): string => {
  if (error instanceof Error) {
    return error.stack || error.message;
  }

  try {
    return JSON.stringify(error);
  } catch {
    return String(error);
  }
};

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

  public get = async (req: AppRequest, res: Response): Promise<void> => {
    if (!this.canAccessYourSupport(req)) {
      res.redirect(this.getFallbackUrl(req));
      return;
    }

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
      showNoSupport: this.isDraftCase(req),
      supportNo: YesOrNo.NO,
      supportYes: YesOrNo.YES,
    });
  };

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    if (!this.canAccessYourSupport(req)) {
      res.redirect(this.getFallbackUrl(req));
      return;
    }

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
      logger.error(`Error starting CUI journey: ${formatError(error)}`);
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
    this.renderConfirmation(
      req,
      res,
      TranslationKeys.YOUR_SUPPORT_CONFIRMATION,
      YOUR_SUPPORT_CONFIRMATION_TEMPLATE,
      link
    );
  };

  public submittedConfirmation = async (req: AppRequest, res: Response): Promise<void> => {
    this.renderConfirmation(
      req,
      res,
      TranslationKeys.YOUR_SUPPORT_SUBMITTED_CONFIRMATION,
      YOUR_SUPPORT_SUBMITTED_CONFIRMATION_TEMPLATE,
      this.getExitUrl(req)
    );
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
    if (this.isDraftCase(req)) {
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
    return buildCuiFlagDetails(userCase?.claimantExternalFlags, this.getPartyName(req), this.getRoleOnCase(req));
  }

  private getPartyName(req: AppRequest): string {
    const userCase = req.session?.userCase;
    return (
      this.getName(req.session?.user?.givenName, req.session?.user?.familyName) ||
      userCase?.claimantName ||
      this.getName(userCase?.firstName, userCase?.lastName) ||
      this.getName(req.session?.claimantFirstName, req.session?.claimantLastName) ||
      userCase?.claimantExternalFlags?.partyName ||
      ''
    );
  }

  private getName(firstName?: string, lastName?: string): string {
    return [firstName, lastName].filter(Boolean).join(' ');
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
    if (result.replacementFlags === undefined || result.replacementFlags === null) {
      throw new Error('CUI journey completed without replacement flags');
    }

    this.setReplacementFlags(req, result.replacementFlags);
    if (this.isDraftCase(req)) {
      await handleUpdateDraftCase(req, logger);
    } else {
      await handleUpdateSubmittedCaseFlags(req, logger);
    }

    if (this.isDraftCase(req) && req.session.userCase?.updateDraftCaseError) {
      throw new Error('Failed to save CUI replacement flags');
    }
  }

  private setReplacementFlags(req: AppRequest, replacementFlags: CUIFlagDetails): void {
    req.session.userCase = {
      ...req.session.userCase,
      claimantExternalFlags: mergeClaimantExternalFlags(
        req.session.userCase?.claimantExternalFlags,
        replacementFlags,
        this.getPartyName(req),
        this.getRoleOnCase(req)
      ),
    };
  }

  private getCuiClient(req: AppRequest): CUIClient {
    return getCuiService(getServiceUrl(req, AuthUrls.LOGOUT));
  }

  private getCaseId(req: AppRequest): string {
    return String(req.session?.userCase?.id ?? '');
  }

  private canAccessYourSupport(req: AppRequest): boolean {
    return this.isDraftCase(req) || !!req.session?.userCase?.id;
  }

  private isDraftCase(req: AppRequest): boolean {
    return req.session?.userCase?.state === CaseState.AWAITING_SUBMISSION_TO_HMCTS;
  }

  private getFallbackUrl(req: AppRequest): string {
    const userCase = req.session?.userCase;
    if (userCase?.id) {
      return setUrlLanguage(req, PageUrls.CITIZEN_HUB.replace(':caseId', userCase.id));
    }

    return setUrlLanguage(req, PageUrls.CLAIMANT_APPLICATIONS);
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
    const confirmationUrl = this.isDraftCase(req)
      ? PageUrls.YOUR_SUPPORT_CONFIRMATION
      : PageUrls.YOUR_SUPPORT_SUBMITTED_CONFIRMATION;

    return setUrlLanguage(req, confirmationUrl);
  }

  private renderConfirmation(
    req: AppRequest,
    res: Response,
    translationKey: string,
    template: string,
    link: string
  ): void {
    const translations: AnyRecord = {
      ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
      ...req.t(translationKey, { returnObjects: true }),
    };
    const sessionErrors = req.session?.errors || [];
    req.session.errors = [];

    res.render(template, {
      ...translations,
      sessionErrors,
      link,
    });
  }

  private getS2SService(): IS2SService {
    if (!this.s2sService) {
      const { getS2SService } = require('./../services/S2SService') as typeof import('./../services/S2SService');
      this.s2sService = getS2SService();
    }

    return this.s2sService;
  }
}
