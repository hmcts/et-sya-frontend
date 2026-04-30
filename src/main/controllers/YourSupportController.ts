import { Response } from 'express';

import { CaseStateCheck } from '../decorators/CaseStateCheck';
import { AppRequest } from '../definitions/appRequest';
import { CaseWithId } from '../definitions/case';
import { AuthUrls, PageUrls, TranslationKeys } from '../definitions/constants';
import { AnyRecord } from '../definitions/util-types';
import { getLogger } from '../logger';

//import { handlePostLogic } from './helpers/CaseHelpers';

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
          correlationId: userCase?.id,
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

    const logoutUrl = getServiceUrl(req, AuthUrls.LOGOUT);
    const cuiService = getCuiService(logoutUrl);

    try {
      const result = await cuiService.getJourneyData(id, {
        serviceToken: await this.s2sService.getToken(),
      } as CUIClientAuth);
      if (result.correlationId !== userCase?.id) {
        // throw an error the data does not match the case
        throw new Error('Correlation ID does not match case ID');
      }
      req.session.userCase.claimantFlags = {
        ...userCase.claimantFlags,
        details: {
          ...userCase.claimantFlags?.details,
          ...result.replacementFlags,
        },
      } as unknown as CaseWithId['claimantFlags'];
      return res.redirect(PageUrls.YOUR_SUPPORT_CONFIRMATION);
    } catch (error) {
      logger.error('Error retrieving CUI journey data', error);
      return res.redirect(PageUrls.HOME);
    }
  };

  @CaseStateCheck()
  public confirmation = async (req: AppRequest, res: Response): Promise<void> => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

    const logoutUrl = getServiceUrl(req, AuthUrls.LOGOUT);
    const cuiService = getCuiService(logoutUrl);

    try {
      const result = await cuiService.getJourneyData(id, {
        serviceToken: await this.s2sService.getToken(),
      } as CUIClientAuth);
      // save data to ccd
      if (result) {
        //this is a blank if just to avoid eslint error about unused variable, but in future we will use the correlationId to link the data to the case in CCD
      }
    } catch (error) {
      logger.error('Error retrieving CUI journey data', error);
      return res.redirect(PageUrls.HOME);
    }
  };
}
