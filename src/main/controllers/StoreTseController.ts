import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { ErrorPages, PageUrls } from '../definitions/constants';
import { HubLinkNames, HubLinkStatus } from '../definitions/hub';
import { fromApiFormat } from '../helper/ApiFormatter';
import { getLogger } from '../logger';
import { getCaseApi } from '../services/CaseService';

import { clearTseFields, handleUpdateHubLinksStatuses } from './helpers/CaseHelpers';
import { getLanguageParam } from './helpers/RouterHelpers';
import { getLatestApplication } from './helpers/StoredApplicationConfirmationHelpers';

const logger = getLogger('StoreTseController');

export default class StoreTseController {
  public get = async (req: AppRequest, res: Response): Promise<void> => {
    const languageParam = getLanguageParam(req.url);
    let userCase = req.session?.userCase;

    // Update Hub Links Statuses
    try {
      userCase.hubLinksStatuses[HubLinkNames.RequestsAndApplications] = HubLinkStatus.STORED;
      await handleUpdateHubLinksStatuses(req, logger);
    } catch (error) {
      logger.error(error.message);
      return res.redirect(`${ErrorPages.NOT_FOUND}${languageParam}`);
    }

    // Store application
    try {
      await getCaseApi(req.session.user?.accessToken).storeClaimantTse(req.session.userCase);
    } catch (error) {
      logger.error(error.message);
      return res.redirect(`${ErrorPages.NOT_FOUND}${languageParam}`);
    }

    // Clear temporary fields + Update UserCase
    try {
      clearTseFields(userCase);
      req.session.userCase = fromApiFormat(
        (await getCaseApi(req.session.user?.accessToken).getUserCase(req.session.userCase.id)).data
      );
      userCase = req.session.userCase;
    } catch (error) {
      logger.error(error.message);
      return res.redirect(`${ErrorPages.NOT_FOUND}${languageParam}`);
    }

    // Get Latest Stored Application
    let latestApplicationId;
    try {
      const latestApplication = await getLatestApplication(userCase.tseApplicationStoredCollection);
      latestApplicationId = latestApplication.id;
    } catch (err) {
      logger.error(err.message);
      return res.redirect(`${ErrorPages.NOT_FOUND}${languageParam}`);
    }

    return res.redirect(
      PageUrls.STORED_APPLICATION_CONFIRMATION.replace(':appId', latestApplicationId) + languageParam
    );
  };
}
