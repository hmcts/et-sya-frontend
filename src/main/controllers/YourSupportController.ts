import { Response } from 'express';

//import { CaseStateCheck } from '../decorators/CaseStateCheck';
import { AppRequest } from '../definitions/appRequest';
//import { CaseFlags } from '../definitions/case';
import { AuthUrls, PageUrls, TranslationKeys } from '../definitions/constants';
import { AnyRecord } from '../definitions/util-types';
//import { fromApiFormat } from '../helper/ApiFormatter';
import { getLogger } from '../logger';

//import { handlePostLogic } from './helpers/CaseHelpers';

//import { getCaseApi } from './../services/CaseService';
import {
  type CUIClientAuth,
  type CUIStartJourneyAuth,
  type CUIStartJourneyRequest,
  getCuiService,
} from './../services/CuiService';
import { IS2SService, getS2SService } from './../services/S2SService';
import { getServiceUrl } from './../utils/getServiceUrl';
import { setUrlLanguage } from './helpers/LanguageHelper';
import { getLanguageCode } from './helpers/RouterHelpers';

const logger = getLogger('YourSupportController');

export default class YourSupportController {
  private readonly s2sService: IS2SService;

  constructor() {
    this.s2sService = getS2SService();
  }

  //@CaseStateCheck()
  public get = async (req: AppRequest, res: Response): Promise<void> => {
    const userCase = req.session?.userCase;
    const cancelLink = setUrlLanguage(req, PageUrls.CITIZEN_HUB.replace(':caseId', userCase.id));
    const startLink = setUrlLanguage(req, PageUrls.YOUR_SUPPORT_REDIRECT);

    const translations: AnyRecord = {
      ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
      ...req.t(TranslationKeys.YOUR_SUPPORT, { returnObjects: true }),
    };
    const sessionErrors = req.session?.errors || [];
    req.session.errors = [];

    res.render('your-support', {
      ...translations,
      cancelLink,
      sessionErrors,
      startLink,
    });
  };

  //@CaseStateCheck()
  public redirectToCuiJourney = async (req: AppRequest, res: Response): Promise<void> => {
    const userCase = req.session?.userCase;
    const caseId = String(userCase?.id ?? '');
    const logoutUrl = getServiceUrl(req, AuthUrls.LOGOUT);
    const cuiService = getCuiService(logoutUrl);
    req.session.errors = [];
    const claimantFlags = userCase?.claimantFlags;
    const existingFlags = {
      ...claimantFlags,
      partyName: claimantFlags?.partyName || userCase?.claimantName || '',
      roleOnCase:
        claimantFlags?.roleOnCase ||
        (userCase?.claimantRepresentativeOrganisationPolicy ? 'Representative' : 'Claimant'),
      details: claimantFlags?.details ?? [],
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
          serviceToken: await this.s2sService.getToken(),
          idamToken: req.session.user?.accessToken,
        } as CUIStartJourneyAuth
      );

      if (!results || !results.url) {
        logger.error('No URL returned from CUI service');
        return res.redirect(PageUrls.HOME);
      }

      //redirect to cui journey
      return res.redirect(results.url);
    } catch (error) {
      req.session.errors.push({ propertyName: 'yourSupportRedirect', errorType: 'required' });
      logger.error('Error starting CUI journey', error);
      return res.redirect(setUrlLanguage(req, PageUrls.YOUR_SUPPORT));
    }
  };

  //@CaseStateCheck()
  public callback = async (req: AppRequest, res: Response): Promise<void> => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const userCase = req.session?.userCase;
    const caseId = String(userCase?.id ?? '');

    const logoutUrl = getServiceUrl(req, AuthUrls.LOGOUT);
    const cuiService = getCuiService(logoutUrl);

    try {
      const result = await cuiService.getJourneyData(id, {
        serviceToken: await this.s2sService.getToken(),
      } as CUIClientAuth);
      if (result.correlationId !== caseId) {
        // throw an error the data does not match the case
        throw new Error('Correlation ID does not match case ID');
      }
      if (result.action !== 'submit') {
        // if the user did not complete the journey, redirect them back to the case page without updating anything
        logger.info(
          `CUI journey completed with action "${result.action}", redirecting back to case page without updating flags`
        );
        return res.redirect(PageUrls.CITIZEN_HUB.replace(':caseId', caseId));
      }

      console.log('CUI journey result:', JSON.stringify(result, null, 2));

      if (!result.replacementFlags) {
        throw new Error('CUI journey completed without replacement flags');
      }

      // const claimantFlags = {
      //   ...userCase.claimantFlags,
      //   ...result.replacementFlags,
      //   details: result.replacementFlags.details ?? [],
      // } as unknown as CaseFlags;

      // req.session.userCase = {
      //   ...userCase,
      //   claimantFlags,
      // };
      //const response = await getCaseApi(req.session.user?.accessToken).updateDraftCase(req.session.userCase);
      //req.session.userCase = fromApiFormat(response.data);
      //await this.saveSession(req);
      return res.redirect(PageUrls.YOUR_SUPPORT_CONFIRMATION);
    } catch (error) {
      logger.error('Error retrieving CUI journey data', error);
      return res.redirect(PageUrls.HOME);
    }
  };

  //@CaseStateCheck()
  public confirmation = async (req: AppRequest, res: Response): Promise<void> => {
    const userCase = req.session?.userCase;
    const link = setUrlLanguage(req, PageUrls.CITIZEN_HUB.replace(':caseId', userCase.id));

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

  /*   private saveSession(req: AppRequest): Promise<void> {
    return new Promise((resolve, reject) => {
      req.session.save(error => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  } */
}
