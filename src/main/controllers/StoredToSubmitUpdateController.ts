import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { PageUrls } from '../definitions/constants';
import { HubLinkNames, HubLinkStatus } from '../definitions/hub';
import { getLogger } from '../logger';

import { handleUpdateHubLinksStatuses, storedToSubmitClaimantTse } from './helpers/CaseHelpers';

const logger = getLogger('StoredToSubmitUpdateController');

export default class StoredToSubmitUpdateController {
  public get = async (req: AppRequest, res: Response): Promise<void> => {
    try {
      const userCase = req.session?.userCase;
      userCase.hubLinksStatuses[HubLinkNames.RequestsAndApplications] = HubLinkStatus.IN_PROGRESS;
      await handleUpdateHubLinksStatuses(req, logger);
      await storedToSubmitClaimantTse(req, logger);
      userCase.selectedGenericTseApplication = undefined;
      userCase.confirmCopied = undefined;
    } catch (error) {
      logger.info(error.message);
    }
    return res.redirect(PageUrls.APPLICATION_COMPLETE);
  };
}
