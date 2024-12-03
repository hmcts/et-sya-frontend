import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../definitions/constants';

import { setUrlLanguage } from './helpers/LanguageHelper';

export default class ChecklistController {
  public get(req: AppRequest, res: Response): void {
    const redirectUrl = setUrlLanguage(req, PageUrls.LIP_OR_REPRESENTATIVE);
    res.render(TranslationKeys.CHECKLIST, {
      ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
      ...req.t(TranslationKeys.CHECKLIST, { returnObjects: true }),
      PageUrls,
      redirectUrl,
    });
  }
}
