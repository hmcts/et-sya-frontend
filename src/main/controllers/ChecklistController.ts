import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../definitions/constants';

import { setUrlLanguage } from './helpers/LanguageHelper';
import { getLanguageParam } from './helpers/RouterHelpers';

export default class ChecklistController {
  public get(req: AppRequest, res: Response): void {
    const redirectUrl = setUrlLanguage(req, PageUrls.LIP_OR_REPRESENTATIVE);
    const languageParam = getLanguageParam(req.url);
    res.cookie('i18next', languageParam, {
      secure: true,
      sameSite: 'strict',
      httpOnly: true,
    });
    res.render(TranslationKeys.CHECKLIST, {
      ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
      ...req.t(TranslationKeys.CHECKLIST, { returnObjects: true }),
      PageUrls,
      redirectUrl,
    });
  }
}
