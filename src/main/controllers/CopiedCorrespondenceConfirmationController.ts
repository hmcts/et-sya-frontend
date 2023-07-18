import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { PageUrls } from '../definitions/constants';

import { setUrlLanguage } from './helpers/LanguageHelper';

export default class CopiedCorrespondenceConfirmationController {
  public get(req: AppRequest, res: Response): void {
    const redirectUrl = setUrlLanguage(req, PageUrls.CHECKLIST);
    res.render('copied-correspondence-confirmation', {
      ...req.t('copied-correspondence-confirmation', { returnObjects: true }),
      redirectUrl,
    });
  }
}
