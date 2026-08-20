import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { FEATURE_FLAGS, PageUrls, TranslationKeys } from '../definitions/constants';
import { getFlagValue } from '../modules/featureFlag/launchDarkly';

import { setUrlLanguage } from './helpers/LanguageHelper';
import { getLanguageParam } from './helpers/RouterHelpers';

export default class HomeController {
  public get = async (req: AppRequest, res: Response): Promise<void> => {
    const redirectUrl = setUrlLanguage(req, PageUrls.CHECKLIST);
    const returnToExistingUrl = setUrlLanguage(req, PageUrls.RETURN_TO_EXISTING);
    const eraOctober2026Enabled = await getFlagValue(FEATURE_FLAGS.ERA_OCTOBER_2026, null);

    res.render(TranslationKeys.HOME, {
      ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
      ...req.t(TranslationKeys.HOME, { returnObjects: true }),
      PageUrls,
      redirectUrl,
      returnToExistingUrl,
      languageParam: getLanguageParam(req.url),
      eraOctober2026Enabled,
    });
  };
}
