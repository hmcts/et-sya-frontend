import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { ErrorPages, TranslationKeys } from '../definitions/constants';
import { AnyRecord } from '../definitions/util-types';
import { getLogger } from '../logger';

import { getDocumentLink, populateDocumentMetadata } from './helpers/DocumentHelpers';
import { getCancelLink } from './helpers/LinkHelpers';
import { getLanguageParam } from './helpers/RouterHelpers';

const logger = getLogger('StoredApplicationConfirmationController');

export default class StoredApplicationConfirmationController {
  public async get(req: AppRequest, res: Response): Promise<void> {
    const languageParam = getLanguageParam(req.url);
    const userCase = req.session.userCase;
    const accessToken = req.session.user?.accessToken;

    const translations: AnyRecord = {
      ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
      ...req.t(TranslationKeys.STORED_APPLICATION_CONFIRMATION, { returnObjects: true }),
    };

    const document = userCase.viewCorrespondenceDoc;
    if (document) {
      try {
        await populateDocumentMetadata(document, accessToken);
      } catch (err) {
        logger.error(err.message);
        return res.redirect(`${ErrorPages.NOT_FOUND}${languageParam}`);
      }
    }

    res.render(TranslationKeys.STORED_APPLICATION_CONFIRMATION, {
      ...translations,
      redirectUrl: getCancelLink(req),
      viewThisCorrespondenceLink: userCase.viewCorrespondenceLink,
      document,
      documentLink: getDocumentLink(document),
    });
  }
}
