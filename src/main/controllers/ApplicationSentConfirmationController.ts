import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { PageUrls } from '../definitions/constants';

import { setUrlLanguage } from './helpers/LanguageHelper';

export default class ApplicationSentConfirmationController {
  public get(req: AppRequest, res: Response): void {
    const redirectUrl = setUrlLanguage(req, PageUrls.CHECKLIST);
    res.render('application-sent-confirmation', {
      ...req.t('application-sent-confirmation', { returnObjects: true }),
      redirectUrl,
    });
  }
}
