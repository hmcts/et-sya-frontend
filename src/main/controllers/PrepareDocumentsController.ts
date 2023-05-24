import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../definitions/constants';

import { getLanguageParam } from './helpers/RouterHelpers';

export default class PrepareDocumentsController {
  public get(req: AppRequest, res: Response): void {
    const languageParam = getLanguageParam(req.url);
    const redirectUrl = PageUrls.AGREEING_DOCUMENTS_FOR_HEARING + languageParam;
    const cancelPage = `/citizen-hub/${req.session.userCase?.id}${languageParam}`;

    res.render(TranslationKeys.PREPARE_DOCUMENTS, {
      ...req.t(TranslationKeys.SIDEBAR_CONTACT_US, { returnObjects: true }),
      ...req.t(TranslationKeys.PREPARE_DOCUMENTS, { returnObjects: true }),
      redirectUrl,
      hideContactUs: true,
      cancelPage,
    });
  }
}
