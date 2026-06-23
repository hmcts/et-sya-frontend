import { Response } from 'express';

import { Form } from '../components/form/form';
import { CaseStateCheck } from '../decorators/CaseStateCheck';
import { AppRequest } from '../definitions/appRequest';
import { CaseFlags, YesOrNo } from '../definitions/case';
import { AuthUrls, PageUrls, TranslationKeys } from '../definitions/constants';
import { CaseState } from '../definitions/definition';
import { FormContent, FormFields } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';
import { fromApiFormat } from '../helper/ApiFormatter';
import { getLogger } from '../logger';

import { getCaseApi } from './../services/CaseService';
import {
  type CUIClientAuth,
  type CUIStartJourneyAuth,
  type CUIStartJourneyRequest,
  getCuiService,
} from './../services/CuiService';
import type { IS2SService } from './../services/S2SService';
import { getServiceUrl } from './../utils/getServiceUrl';
import { handleUpdateDraftCase, setUserCase } from './helpers/CaseHelpers';
import { getPageContent } from './helpers/FormHelpers';
import { setUrlLanguage } from './helpers/LanguageHelper';
import { getLanguageCode, returnValidUrl } from './helpers/RouterHelpers';

const logger = getLogger('YourSupportController');

export default class YourSupportController {
  private s2sService?: IS2SService;
  private readonly form: Form;

  private readonly yourSupportContent: FormContent = {
    fields: {
      reasonableAdjustments: {
        id: 'reasonableAdjustments',
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

    res.render('your-support', {
      ...content,
      cancelLink,
      sessionErrors,
      supportNo: YesOrNo.NO,
      supportYes: YesOrNo.YES,
    });
  };

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    setUserCase(req, this.form);

    if (req.session.userCase?.reasonableAdjustments === YesOrNo.YES) {
      return this.redirectToCuiJourney(req, res);
    }

    if (req.session.userCase?.reasonableAdjustments === YesOrNo.NO) {
      req.session.errors = [];

      if (req.session.userCase?.state === CaseState.AWAITING_SUBMISSION_TO_HMCTS) {
        await handleUpdateDraftCase(req, logger);
      }

      return res.redirect(this.getExitUrl(req, true));
    }

    req.session.errors = [{ propertyName: 'reasonableAdjustments', errorType: 'required' }];
    return res.redirect(setUrlLanguage(req, PageUrls.YOUR_SUPPORT));
  };

  public redirectToCuiJourney = async (req: AppRequest, res: Response): Promise<void> => {
    const userCase = req.session?.userCase;
    const caseId = String(userCase?.id ?? '');
    const logoutUrl = getServiceUrl(req, AuthUrls.LOGOUT);
    const cuiService = getCuiService(logoutUrl);
    req.session.errors = [];
    const claimantExternalFlags = userCase?.claimantExternalFlags;
    const existingFlags = {
      ...claimantExternalFlags,
      partyName: claimantExternalFlags?.partyName || userCase?.claimantName || '',
      roleOnCase:
        claimantExternalFlags?.roleOnCase ||
        (userCase?.claimantRepresentativeOrganisationPolicy ? 'Representative' : 'Claimant'),
      details: claimantExternalFlags?.details ?? [],
    } as unknown as CUIStartJourneyRequest['existingFlags'];

    try {
      const results = await cuiService.startJourney(
        {
          callbackUrl: getServiceUrl(req, PageUrls.YOUR_SUPPORT_CALLBACK),
          correlationId: caseId,
          existingFlags,
          language: getLanguageCode(req.url),
          masterFlagCode: 'RA0001',
        } as CUIStartJourneyRequest,
        {
          serviceToken: await this.getS2SService().getToken(),
          idamToken: req.session.user?.accessToken,
        } as CUIStartJourneyAuth
      );

      if (!results || !results.url) {
        logger.error('No URL returned from CUI service');
        return res.redirect(PageUrls.HOME);
      }

      return res.redirect(results.url);
    } catch (error) {
      req.session.errors.push({ propertyName: 'yourSupportRedirect', errorType: 'required' });
      logger.error('Error starting CUI journey', error);
      return res.redirect(setUrlLanguage(req, PageUrls.YOUR_SUPPORT));
    }
  };

  public callback = async (req: AppRequest, res: Response): Promise<void> => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const userCase = req.session?.userCase;
    const caseId = String(userCase?.id ?? '');

    const logoutUrl = getServiceUrl(req, AuthUrls.LOGOUT);
    const cuiService = getCuiService(logoutUrl);

    try {
      const result = await cuiService.getJourneyData(id, {
        serviceToken: await this.getS2SService().getToken(),
      } as CUIClientAuth);
      if (result.correlationId !== caseId) {
        throw new Error('Correlation ID does not match case ID');
      }
      if (result.action !== 'submit') {
        logger.info(
          `CUI journey completed with action "${result.action}", redirecting back to case page without updating flags`
        );
        return res.redirect(this.getExitUrl(req, true));
      }

      if (!result.replacementFlags) {
        throw new Error('CUI journey completed without replacement flags');
      }

      const claimantExternalFlags = {
        ...userCase.claimantExternalFlags,
        ...result.replacementFlags,
        details: result.replacementFlags.details ?? [],
      } as unknown as CaseFlags;

      req.session.userCase = {
        ...userCase,
        claimantExternalFlags,
      };

      const response = await getCaseApi(req.session.user?.accessToken).updateDraftCase(req.session.userCase);
      req.session.userCase = fromApiFormat(response.data);
      await this.saveSession(req);

      return res.redirect(this.getCuiCompletionUrl(req));
    } catch (error) {
      logger.error('Error retrieving CUI journey data', error);
      return res.redirect(PageUrls.HOME);
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

  private saveSession(req: AppRequest): Promise<void> {
    return new Promise((resolve, reject) => {
      req.session.save(error => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }
}
