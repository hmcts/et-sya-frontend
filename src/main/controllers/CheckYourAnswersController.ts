import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../definitions/constants';

export default class CheckYourAnswersController {
  public get(req: AppRequest, res: Response): void {
    res.render(TranslationKeys.CHECK_ANSWERS, {
      ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
      ...req.t(TranslationKeys.CHECK_ANSWERS, { returnObjects: true }),
      PageUrls,
      userCase: req.session?.userCase,
    });
  }
}
