import { Request, Response } from 'express';

import { PageUrls, TranslationKeys } from '../definitions/constants';

export default class CookiePreferencesController {
  public get(req: Request, res: Response): void {
    res.render(TranslationKeys.COOKIE_PREFERENCES, {
      ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
      ...req.t(TranslationKeys.COOKIE_PREFERENCES, { returnObjects: true }),
      PageUrls,
    });
  }
}
