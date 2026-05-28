import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../definitions/constants';

import { getLanguageParam } from './helpers/RouterHelpers';

export default class ClaimSavedController {
  public get(req: AppRequest, res: Response): void {
    res.render(TranslationKeys.CLAIM_SAVED, {
      ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
      ...req.t(TranslationKeys.CLAIM_SAVED, { returnObjects: true }),
      PageUrls,
      languageParam: getLanguageParam(req.url),
    });
  }
}
