import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { ErrorPages, TranslationKeys } from '../definitions/constants';
import { AnyRecord } from '../definitions/util-types';
import { fromApiFormat } from '../helper/ApiFormatter';
import { getLogger } from '../logger';
import { getCaseApi } from '../services/CaseService';

import { getDocumentLink, populateDocumentMetadata } from './helpers/DocumentHelpers';
import { getLanguageParam } from './helpers/RouterHelpers';
import { getAppDetailsLink, getCancelLink, getLatestApplication } from './helpers/Rule92NotSystemUserHelper';

const logger = getLogger('StoredApplicationConfirmationController');

export default class StoredApplicationConfirmationController {
  public async get(req: AppRequest, res: Response): Promise<void> {
    try {
      req.session.userCase = fromApiFormat(
        (await getCaseApi(req.session.user?.accessToken).getUserCase(req.session.userCase.id)).data
      );
    } catch (error) {
      logger.error(error.message);
      return res.redirect(ErrorPages.NOT_FOUND);
    }

    const userCase = req.session.userCase;
    const accessToken = req.session.user?.accessToken;
    const languageParam = getLanguageParam(req.url);

    const translations: AnyRecord = {
      ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
      ...req.t(TranslationKeys.STORED_APPLICATION_CONFIRMATION, { returnObjects: true }),
    };

    let latestApplication;
    try {
      latestApplication = await getLatestApplication(userCase.genericTseApplicationCollection);
    } catch (err) {
      logger.error(err.message);
      return res.redirect(ErrorPages.NOT_FOUND);
    }

    const document = latestApplication?.value?.documentUpload;
    if (document) {
      try {
        await populateDocumentMetadata(document, accessToken);
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
