import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../definitions/constants';

import { setUrlLanguage } from './helpers/LanguageHelper';
import { getLanguageParam } from './helpers/RouterHelpers';

export default class HomeController {
  public get(req: AppRequest, res: Response): void {
    const redirectUrl = setUrlLanguage(req, PageUrls.CHECKLIST);
    const returnToExistingUrl = setUrlLanguage(req, PageUrls.RETURN_TO_EXISTING);
    res.render(TranslationKeys.HOME, {
      ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
      ...req.t(TranslationKeys.HOME, { returnObjects: true }),
      PageUrls,
      redirectUrl,
      returnToExistingUrl,
      languageParam: getLanguageParam(req.url),
    });
  }
}
