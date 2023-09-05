import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { ErrorPages, TranslationKeys } from '../definitions/constants';
import { AnyRecord } from '../definitions/util-types';
import { getLogger } from '../logger';

import { getDocumentAdditionalInformation, getDocumentLink } from './helpers/DocumentHelpers';
import { getLanguageParam } from './helpers/RouterHelpers';
import { getAppDetailsLink, getCancelLink, getLatestApplication } from './helpers/Rule92NotSystemUserHelper';

const logger = getLogger('StoredApplicationConfirmationController');

export default class StoredApplicationConfirmationController {
  public async get(req: AppRequest, res: Response): Promise<void> {
    const userCase = req.session?.userCase;
    const accessToken = req.session.user?.accessToken;
    const languageParam = getLanguageParam(req.url);

    const translations: AnyRecord = {
      ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
      ...req.t(TranslationKeys.STORED_APPLICATION_CONFIRMATION, { returnObjects: true }),
    };

    const latestApplication = getLatestApplication(userCase.genericTseApplicationCollection);

    const document = latestApplication.value?.documentUpload;
    if (document) {
      try {
        await getDocumentAdditionalInformation(document, accessToken);
      } catch (err) {
        logger.error(err.message);
        return res.redirect(ErrorPages.NOT_FOUND);
      }
    }

    res.render(TranslationKeys.STORED_APPLICATION_CONFIRMATION, {
      ...translations,
      redirectUrl: getCancelLink(req),
      viewThisCorrespondenceLink: getAppDetailsLink(latestApplication.id, languageParam),
      document,
      documentLink: getDocumentLink(document),
    });
  }
}
