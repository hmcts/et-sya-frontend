import { Response } from 'express';

import { Form } from '../components/form/form';
import { CaseStateCheck } from '../decorators/CaseStateCheck';
import { AppRequest } from '../definitions/appRequest';
import { AuthUrls, PageUrls, TranslationKeys, languages } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { saveForLaterButton, submitButton } from '../definitions/radios';
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
import { getPageContent } from './helpers/FormHelpers';

const logger = getLogger('YourSupportController');

export default class YourSupportController {
  private readonly form: Form;
  private readonly s2sService: IS2SService;

  private readonly yourSupportContent: FormContent = {
    fields: {},
    submit: submitButton,
    saveForLater: saveForLaterButton,
  };

  constructor() {
    this.form = new Form(<FormFields>this.yourSupportContent.fields);
    this.s2sService = getS2SService();
  }

  @CaseStateCheck()
  public get = async (req: AppRequest, res: Response): Promise<void> => {
    const content = getPageContent(req, this.yourSupportContent, [
      TranslationKeys.COMMON,
      TranslationKeys.YOUR_SUPPORT,
    ]);
    res.render('reasonable-adjustments', {
      ...content,
    });
  };

  @CaseStateCheck()
  public post = async (req: AppRequest, res: Response): Promise<void> => {
    const logoutUrl = getServiceUrl(req, AuthUrls.LOGOUT);
    const cuiService = getCuiService(logoutUrl);

    //get claimantFlags from ccd and pass to cui journey
    //currently setting fake data

    try {
      const results = await cuiService.startJourney(
        {
          callbackUrl: getServiceUrl(req, PageUrls.YOUR_SUPPORT_CALLBACK),
          correlationId: req.session?.userCase.id,
          existingFlags: {
            partyName: '',
            roleOnCase: '',
            details: [],
          },
          language: req.i18n?.language || languages.ENGLISH,
          masterFlagCode: 'RA0001',
        } as CUIStartJourneyRequest,
        {
          serviceToken: await this.s2sService.getToken(),
          idamToken: '',
        } as CUIStartJourneyAuth
      );

      if (!results || !results.url) {
        logger.error('No URL returned from CUI service');
        return res.redirect(PageUrls.HOME);
      }

      //redirect to cui journey
      return res.redirect(results.url);
    } catch (error) {
      logger.error('Error starting CUI journey', error);
      return res.redirect(PageUrls.HOME);
    }
  };

  @CaseStateCheck()
  public callback = async (req: AppRequest, res: Response): Promise<void> => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

    const logoutUrl = getServiceUrl(req, AuthUrls.LOGOUT);
    const cuiService = getCuiService(logoutUrl);

    try {
      const result = await cuiService.getJourneyData(id, {
        serviceToken: await this.s2sService.getToken(),
      } as CUIClientAuth);
      if (result.correlationId) {
        //this is a blank if just to avoid eslint error about unused variable, but in future we will use the correlationId to link the data to the case in CCD
      }
      // save data to ccd
      //redirect to the confirmation page
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
