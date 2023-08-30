import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { PageUrls } from '../definitions/constants';
import { getLogger } from '../logger';

import { storedToSubmitClaimantTse } from './helpers/CaseHelpers';

const logger = getLogger('StoredToSubmitUpdateController');

export default class StoredToSubmitUpdateController {
  public get = async (req: AppRequest, res: Response): Promise<void> => {
    try {
      const userCase = req.session?.userCase;
      await storedToSubmitClaimantTse(req, logger);
      userCase.selectedGenericTseApplication = undefined;
      userCase.confirmCopied = undefined;
    } catch (error) {
      logger.info(error.message);
    }
    return res.redirect(PageUrls.APPLICATION_COMPLETE);
  };
}
