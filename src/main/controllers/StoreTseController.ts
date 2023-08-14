import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { PageUrls } from '../definitions/constants';
import { HubLinkNames, HubLinkStatus } from '../definitions/hub';
import { getLogger } from '../logger';

import { clearTseFields, handleUpdateHubLinksStatuses, storeClaimantTse } from './helpers/CaseHelpers';

const logger = getLogger('StoreTseController');

export default class StoreTseController {
  public get = async (req: AppRequest, res: Response): Promise<void> => {
    try {
      const userCase = req.session?.userCase;
      userCase.hubLinksStatuses[HubLinkNames.RequestsAndApplications] = HubLinkStatus.IN_PROGRESS;
      await handleUpdateHubLinksStatuses(req, logger);
      await storeClaimantTse(req, logger);
      clearTseFields(userCase);
    } catch (error) {
      logger.info(error.message);
    }
    return res.redirect(PageUrls.STORED_APPLICATION_CONFIRMATION);
  };
}
