import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { PageUrls } from '../definitions/constants';

import { setUrlLanguage } from './helpers/LanguageHelper';

export default class NewAccountLandingController {
  public get = (req: AppRequest, res: Response): void => {
    const redirectUrl = setUrlLanguage(req, PageUrls.CLAIM_STEPS);
    res.render('new-account-landing', {
      ...req.t('common', { returnObjects: true }),
      ...req.t('new-account-landing', { returnObjects: true }),
      redirectUrl,
      PageUrls,
    });
  };
}
