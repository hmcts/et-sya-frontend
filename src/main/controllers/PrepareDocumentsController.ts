import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { FEATURE_FLAGS, PageUrls, TranslationKeys } from '../definitions/constants';
import { getFlagValue } from '../modules/featureFlag/launchDarkly';

import { getLanguageParam } from './helpers/RouterHelpers';

export default class PrepareDocumentsController {
  public async get(req: AppRequest, res: Response): Promise<void> {
    const languageParam = getLanguageParam(req.url);
    const redirectUrl = PageUrls.AGREEING_DOCUMENTS_FOR_HEARING + languageParam;
    const cancelPage = `/citizen-hub/${req.session.userCase?.id}${languageParam}`;
    const bundlesEnabled = await getFlagValue(FEATURE_FLAGS.BUNDLES, null);

    res.render(TranslationKeys.PREPARE_DOCUMENTS, {
      ...req.t(TranslationKeys.SIDEBAR_CONTACT_US, { returnObjects: true }),
      ...req.t(TranslationKeys.PREPARE_DOCUMENTS, { returnObjects: true }),
      redirectUrl,
      hideContactUs: true,
      cancelPage,
      bundlesEnabled,
    });
  }
}
