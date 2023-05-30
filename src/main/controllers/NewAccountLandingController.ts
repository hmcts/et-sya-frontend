import { AppRequest } from '../definitions/appRequest';
import { PageUrls } from '../definitions/constants';

import { setUrlLanguage } from './helpers/LanguageHelper';
import { getLanguageParam } from './helpers/RouterHelpers';

import { Response } from 'express';

export default class NewAccountLandingController {
  public get = (req: AppRequest, res: Response): void => {
    const redirectUrl = setUrlLanguage(req, PageUrls.CLAIM_STEPS);
    res.render('new-account-landing', {
      ...req.t('common', { returnObjects: true }),
      ...req.t('new-account-landing', { returnObjects: true }),
      redirectUrl,
      PageUrls,
      languageParam: getLanguageParam(req.url),
    });
  };
}
