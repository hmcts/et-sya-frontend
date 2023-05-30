import { AppRequest } from '../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../definitions/constants';

import { setUrlLanguage } from './helpers/LanguageHelper';

import { Response } from 'express';

export default class ChecklistController {
  public get(req: AppRequest, res: Response): void {
    const redirectUrl = setUrlLanguage(req, PageUrls.WORK_POSTCODE);
    res.render(TranslationKeys.CHECKLIST, {
      ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
      ...req.t(TranslationKeys.CHECKLIST, { returnObjects: true }),
      PageUrls,
      redirectUrl,
    });
  }
}
