import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { PageUrls } from '../definitions/constants';

import { setI18nLanguageCookie, setUrlLanguage } from './helpers/LanguageHelper';

export default class NewAccountLandingController {
  public get = (req: AppRequest, res: Response): void => {
    const redirectUrl = setUrlLanguage(req, PageUrls.CLAIM_STEPS);
    req.cookies.i18next = setI18nLanguageCookie(req, req.cookies.i18next);
    res.render('new-account-landing', {
      ...req.t('common', { returnObjects: true }),
      ...req.t('new-account-landing', { returnObjects: true }),
      redirectUrl,
    });
  };
}
