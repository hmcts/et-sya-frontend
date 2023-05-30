import { PageUrls, TranslationKeys } from '../definitions/constants';

import { Request, Response } from 'express';

export default class CookiePreferencesController {
  public get(req: Request, res: Response): void {
    res.render(TranslationKeys.COOKIE_PREFERENCES, {
      ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
      ...req.t(TranslationKeys.COOKIE_PREFERENCES, { returnObjects: true }),
      PageUrls,
    });
  }
}
