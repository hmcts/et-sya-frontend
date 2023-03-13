import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { PageUrls } from '../definitions/constants';
import { HubLinkNames, HubLinkStatus } from '../definitions/hub';
import { getLogger } from '../logger';

import { clearTseFields } from './ContactTheTribunalSelectedController';
import { handleUpdateHubLinksStatuses, respondToApplication } from './helpers/CaseHelpers';

const logger = getLogger('SubmitRespondentController');

export default class SubmitRespondentController {
  public get = async (req: AppRequest, res: Response): Promise<void> => {
    try {
      const userCase = req.session?.userCase;
      userCase.hubLinksStatuses[HubLinkNames.RespondentApplications] = HubLinkStatus.IN_PROGRESS;
      await handleUpdateHubLinksStatuses(req, logger);
      await respondToApplication(req, logger);
      clearTseFields(userCase);
    } catch (error) {
      logger.info(error.message);
    }
    // TODO should be changed after RET-2790
    return res.redirect(PageUrls.APPLICATION_COMPLETE);
  };
}
