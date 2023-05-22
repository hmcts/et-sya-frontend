import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { PageUrls } from '../definitions/constants';
import { getLogger } from '../logger';

import { submitBundlesHearingDocs } from './helpers/CaseHelpers';

const logger = getLogger('SubmitBundlesHearingDocController');

export default class SubmitBundlesHearingDocsController {
  public get = async (req: AppRequest, res: Response): Promise<void> => {
    try {
      // const userCase = req.session?.userCase;
      await submitBundlesHearingDocs(req, logger);
      // clearTseFields(userCase);
    } catch (error) {
      logger.info(error.message);
    }
    return res.redirect(PageUrls.APPLICATION_COMPLETE);
  };
}
