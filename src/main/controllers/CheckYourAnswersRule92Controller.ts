import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { PageUrls } from '../definitions/constants';

import { setUrlLanguage } from './helpers/LanguageHelper';

export default class CheckYourAnswersRule92Controller {
  public get(req: AppRequest, res: Response): void {
    const redirectUrl = setUrlLanguage(req, PageUrls.CHECKLIST);
    res.render('check-your-answers-rule92', {
      ...req.t('check-your-answers-rule92', { returnObjects: true }),
      redirectUrl,
    });
  }
}
