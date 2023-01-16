import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { YesOrNo } from '../definitions/case';
import { TranslationKeys } from '../definitions/constants';

import { getLanguageParam } from './helpers/RouterHelpers';

export default class ResponseCompleteController {
  public get(req: AppRequest, res: Response): void {
    const languageParam = getLanguageParam(req.url);
    const redirectUrl = `/citizen-hub/${req.session.userCase?.id}${languageParam}`;

    res.render(TranslationKeys.RESPONSE_COMPLETE, {
      ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
      ...req.t(TranslationKeys.RESPONSE_COMPLETE, { returnObjects: true }),
      rule92: YesOrNo.YES,
      redirectUrl,
    });
  }
}
