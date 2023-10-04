import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { ErrorPages, TranslationKeys } from '../definitions/constants';
import { AnyRecord } from '../definitions/util-types';
import { getLogger } from '../logger';

import {
  findSelectedGenericTseApplication,
  getDocumentLink,
  populateDocumentMetadata,
} from './helpers/DocumentHelpers';
import { getAppDetailsLink, getCancelLink } from './helpers/LinkHelpers';
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

    if (req.params.appId === undefined) {
      logger.error('Application ID not found');
      return res.redirect(`${ErrorPages.NOT_FOUND}${languageParam}`);
    }

    const selectedApplication = findSelectedGenericTseApplication(
      userCase.genericTseApplicationCollection,
      req.params.appId
    );
    if (selectedApplication === undefined) {
      logger.error('Latest application not found');
      return res.redirect(`${ErrorPages.NOT_FOUND}${languageParam}`);
    }

    const document = selectedApplication.value.documentUpload;
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
      viewThisCorrespondenceLink: getAppDetailsLink(selectedApplication.id, languageParam),
      document,
      documentLink: getDocumentLink(document),
    });
  }
}
