import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { TranslationKeys } from '../definitions/constants';
import { getFlagValue } from '../modules/featureFlag/launchDarkly';

import { retrieveCurrentLocale } from './helpers/ApplicationTableRecordTranslationHelper';
import { getLanguageParam } from './helpers/RouterHelpers';

export default class ApplicationCompleteController {
  public get = async (req: AppRequest, res: Response): Promise<void> => {
    // Clear flag so user can start new applications
    req.session.visitedContactTribunalSelection = false;

    const welshEnabled = await getFlagValue('welsh-language', null);
    const userCase = req.session?.userCase;
    const languageParam = getLanguageParam(req.url);
    const redirectUrl = `/citizen-hub/${req.session.userCase?.id}${languageParam}`;
    const applicationDate = new Date();
    applicationDate.setDate(applicationDate.getDate() + 7);
    const dateString = applicationDate.toLocaleDateString(retrieveCurrentLocale(req?.url), {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    res.render(TranslationKeys.APPLICATION_COMPLETE, {
      ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
      ...req.t(TranslationKeys.APPLICATION_COMPLETE, { returnObjects: true }),
      applicationDate: dateString,
      rule92: userCase.rule92state,
      redirectUrl,
      welshEnabled,
    });
  };
}
