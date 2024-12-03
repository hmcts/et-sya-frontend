import { Request, Response } from 'express';

import { PageUrls, TranslationKeys } from '../definitions/constants';

import { getLanguage } from './helpers/RouterHelpers';

export default class CookiePreferencesController {
  public get(req: Request, res: Response): void {
    const lang = getLanguage(req.url);
    res.cookie('i18next', lang, {
      httpOnly: true,
      sameSite: 'strict',
      secure: true,
    });
    res.render(TranslationKeys.COOKIE_PREFERENCES, {
      ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
      ...req.t(TranslationKeys.COOKIE_PREFERENCES, { returnObjects: true }),
      PageUrls,
    });
  }
}
