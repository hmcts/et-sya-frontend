import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../definitions/constants';

export default class HomeController {
  public get(req: AppRequest, res: Response): void {
    res.render(TranslationKeys.HOME, {
      ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
      ...req.t(TranslationKeys.HOME, { returnObjects: true }),
      PageUrls,
    });
  }
}
