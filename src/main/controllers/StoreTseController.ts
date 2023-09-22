import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { ErrorPages, PageUrls } from '../definitions/constants';
import { HubLinkNames, HubLinkStatus } from '../definitions/hub';
import { getLogger } from '../logger';

import { clearTseFields, handleUpdateHubLinksStatuses } from './helpers/CaseHelpers';
import { getLanguageParam } from './helpers/RouterHelpers';
import { storeClaimantTse } from './helpers/StoreTseCaseHelpers';

const logger = getLogger('StoreTseController');

export default class StoreTseController {
  public get = async (req: AppRequest, res: Response): Promise<void> => {
    const languageParam = getLanguageParam(req.url);
    const userCase = req.session?.userCase;

    try {
      userCase.hubLinksStatuses[HubLinkNames.RequestsAndApplications] = HubLinkStatus.STORED;
      await handleUpdateHubLinksStatuses(req, logger);
    } catch (error) {
      logger.info(error.message);
      return res.redirect(`${ErrorPages.NOT_FOUND}${languageParam}`);
    }

    try {
      await storeClaimantTse(req, logger);
      clearTseFields(userCase);
    } catch (error) {
      logger.info(error.message);
      return res.redirect(`${ErrorPages.NOT_FOUND}${languageParam}`);
    }

    return res.redirect(PageUrls.STORED_APPLICATION_CONFIRMATION);
  };
}
