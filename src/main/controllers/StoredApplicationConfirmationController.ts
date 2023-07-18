import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { PageUrls } from '../definitions/constants';

import { setUrlLanguage } from './helpers/LanguageHelper';

export default class StoredApplicationConfirmationController {
  public get(req: AppRequest, res: Response): void {
    const redirectUrl = setUrlLanguage(req, PageUrls.CHECKLIST);
    res.render('stored-application-confirmation', {
      ...req.t('stored-application-confirmation', { returnObjects: true }),
      redirectUrl,
    });
  }
}
