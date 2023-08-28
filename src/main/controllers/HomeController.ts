import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { LegacyUrls, PageUrls, TranslationKeys } from '../definitions/constants';
import getLegacyUrl from '../utils/getLegacyUrlFromLng';

import { getLanguageParam } from './helpers/RouterHelpers';

export default class HomeController {
  public get(req: AppRequest, res: Response): void {
    const redirectUrl = getLegacyUrl(LegacyUrls.ET1_APPLY + LegacyUrls.ET1_PATH, req.language);
    res.render(TranslationKeys.HOME, {
      ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
      ...req.t(TranslationKeys.HOME, { returnObjects: true }),
      PageUrls,
      redirectUrl,
      languageParam: getLanguageParam(req.url),
    });
  }
}
