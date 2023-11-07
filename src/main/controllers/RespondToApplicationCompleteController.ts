import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { TranslationKeys } from '../definitions/constants';
import { getFlagValue } from '../modules/featureFlag/launchDarkly';

import { getLanguageParam } from './helpers/RouterHelpers';

export default class RespondToApplicationCompleteController {
  public get = async (req: AppRequest, res: Response): Promise<void> => {
    const userCase = req.session?.userCase;
    const welshEnabled = await getFlagValue('welsh-language', null);
    const languageParam = getLanguageParam(req.url);
    const redirectUrl = `/citizen-hub/${req.session.userCase?.id}${languageParam}`;

    res.render(TranslationKeys.RESPOND_TO_APPLICATION_COMPLETE, {
      ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
      ...req.t(TranslationKeys.RESPOND_TO_APPLICATION_COMPLETE, { returnObjects: true }),
      rule92: userCase.rule92state,
      redirectUrl,
      welshEnabled,
    });
  };
}
