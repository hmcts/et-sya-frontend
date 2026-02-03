import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { ErrorPages, PageUrls, ServiceErrors } from '../definitions/constants';
import { fromApiFormat } from '../helper/ApiFormatter';
import { getLogger } from '../logger';
import { getCaseApi } from '../services/CaseService';

import { clearTseFields } from './helpers/CaseHelpers';
import { findSelectedGenericTseApplication } from './helpers/DocumentHelpers';
import { getLanguageParam } from './helpers/RouterHelpers';

const logger = getLogger('StoreRespondentController');

export default class StoreRespondentController {
  public get = async (req: AppRequest, res: Response): Promise<void> => {
    const languageParam = getLanguageParam(req.url);

    // Store respond to application
    try {
      await getCaseApi(req.session.user?.accessToken).storeRespondToApplication(req.session.userCase);
    } catch (error) {
      logger.error(error.message);
      return res.redirect(`${ErrorPages.NOT_FOUND}${languageParam}`);
    }

    const selectedApplication = findSelectedGenericTseApplication(
      req.session.userCase.genericTseApplicationCollection,
      req.session.userCase.selectedGenericTseApplication.id
    );
    if (!selectedApplication) {
      logger.error(ServiceErrors.ERROR_APPLICATION_NOT_FOUND + req.params?.appId);
      return res.redirect(`${ErrorPages.NOT_FOUND}${languageParam}`);
    }

    clearTseFields(req.session?.userCase);

    // Refresh userCase
    try {
      req.session.userCase = fromApiFormat(
        (await getCaseApi(req.session.user?.accessToken).getUserCase(req.session.userCase.id)).data
      );
    } catch (error) {
      logger.error(error.message);
      return res.redirect(`${ErrorPages.NOT_FOUND}${languageParam}`);
    }

    return res.redirect(
      PageUrls.STORED_RESPONSE_APPLICATION_CONFIRMATION.replace(':appId', selectedApplication.id) +
        getLanguageParam(req.url)
    );
  };
}
