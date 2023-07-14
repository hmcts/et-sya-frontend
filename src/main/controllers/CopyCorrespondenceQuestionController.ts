import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { PageUrls } from '../definitions/constants';

import { setUrlLanguage } from './helpers/LanguageHelper';

export default class CopyCorrespondenceQuestionController {
  public get(req: AppRequest, res: Response): void {
    const redirectUrl = setUrlLanguage(req, PageUrls.CHECKLIST);
    res.render('copy-correspondence-question', {
      ...req.t('copy-correspondence-question', { returnObjects: true }),
      redirectUrl,
    });
  }
}
