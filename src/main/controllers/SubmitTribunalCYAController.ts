import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { PageUrls } from '../definitions/constants';
import { getLogger } from '../logger';

import { clearTseFields } from './ContactTheTribunalSelectedController';
import { handleUpdateHubLinksStatuses } from './helpers/CaseHelpers';

const logger = getLogger('SubmitCaseController');

export default class SubmitTribunalCYAController {
  public get = async (req: AppRequest, res: Response): Promise<void> => {
    try {
      const userCase = req.session.userCase;
      await handleUpdateHubLinksStatuses(req, logger);
      clearTseFields(userCase);
    } catch (error) {
      logger.info(error.message);
    }
    return res.redirect(PageUrls.APPLICATION_COMPLETE);
  };
}
