import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { TranslationKeys } from '../definitions/constants';

import { getLanguageParam } from './helpers/RouterHelpers';

export default class TribunalResponseCompletedController {
  public get(req: AppRequest, res: Response): void {
    const userCase = req.session?.userCase;
    const languageParam = getLanguageParam(req.url);
    const redirectUrl = `/citizen-hub/${userCase?.id}${languageParam}`;
    res.render(TranslationKeys.TRIBUNAL_RESPONSE_COMPLETED, {
      ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
      ...req.t(TranslationKeys.TRIBUNAL_RESPONSE_COMPLETED, { returnObjects: true }),
      rule92: userCase.rule92state,
      redirectUrl,
    });
  }
}
