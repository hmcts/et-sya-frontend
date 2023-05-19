import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { YesOrNo } from '../definitions/case';
import { TranslationKeys } from '../definitions/constants';

import { getLanguageParam } from './helpers/RouterHelpers';

export default class Rule92HoldingPageController {
  public get(req: AppRequest, res: Response): void {
    const languageParam = getLanguageParam(req.url);
    const redirectUrl = `/citizen-hub/${req.session.userCase?.id}${languageParam}`;
    const userCase = req.session?.userCase;
    const repCollection = userCase.representatives;

    res.render(TranslationKeys.RULE92_HOLDING_PAGE, {
      ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
      ...req.t(TranslationKeys.RULE92_HOLDING_PAGE, { returnObjects: true }),
      redirectUrl,
      respondentIsSystemUser:
        repCollection !== undefined &&
        !repCollection.some(r => r.hasMyHMCTSAccount === YesOrNo.NO || r.hasMyHMCTSAccount === undefined),
    });
  }
}
