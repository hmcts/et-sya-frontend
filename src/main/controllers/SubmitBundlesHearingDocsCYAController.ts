import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { ErrorPages, PageUrls } from '../definitions/constants';
import { getLogger } from '../logger';

import { clearBundlesFields, submitBundlesHearingDocs } from './helpers/CaseHelpers';

const logger = getLogger('SubmitBundlesHearingDocController');

export default class SubmitBundlesHearingDocsController {
  public get = async (req: AppRequest, res: Response): Promise<void> => {
    try {
      const { userCase } = req.session;
      await submitBundlesHearingDocs(req, logger);
      clearBundlesFields(userCase);
    } catch (error) {
      logger.error(error.message);
      return res.redirect(ErrorPages.NOT_FOUND);
    }
    return res.redirect(PageUrls.BUNDLES_COMPLETED);
  };
}
