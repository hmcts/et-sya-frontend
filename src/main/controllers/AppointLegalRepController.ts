import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../definitions/constants';

import { getLanguageParam } from './helpers/RouterHelpers';

export default class AppointLegalRepController {
  public get = async (req: AppRequest, res: Response): Promise<void> => {
    const content = {
      ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
    };

    const languageParam = getLanguageParam(req.url);
    const userCase = req.session.userCase;
    const allDocumentsUrl = PageUrls.ALL_DOCUMENTS;

    res.render(TranslationKeys.APPOINT_LEGAL_REPRESENTATIVE, {
      ...req.t(TranslationKeys.APPOINT_LEGAL_REPRESENTATIVE, { returnObjects: true }),
      ...content,
      currentUrl: '/appoint-legal-representative',
      languageParam,
      userCase,
      allDocumentsUrl,
    });
  };
}
