import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { PageUrls } from '../definitions/constants';
import { getLogger } from '../logger';

import { submitStoredClaimantTse } from './helpers/CaseHelpers';

const logger = getLogger('SubmitStoredTseController');

export default class SubmitStoredTseController {
  public get = async (req: AppRequest, res: Response): Promise<void> => {
    try {
      const userCase = req.session?.userCase;
      await submitStoredClaimantTse(req, logger);
      userCase.selectedGenericTseApplication = undefined;
      userCase.confirmCopied = undefined;
    } catch (error) {
      logger.info(error.message);
    }
    return res.redirect(PageUrls.APPLICATION_COMPLETE);
  };
}
