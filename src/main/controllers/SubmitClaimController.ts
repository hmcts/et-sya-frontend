import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { PageUrls } from '../definitions/constants';
import { fromApiFormat } from '../helper/ApiFormatter';
import { getCaseApi } from '../services/CaseService';

const { Logger } = require('@hmcts/nodejs-logging');
const logger = Logger.getLogger('app');

export default class SubmitCaseController {
  public get = async (req: AppRequest, res: Response): Promise<void> => {
    try {
      const submittedClaim = await getCaseApi(req.session.user?.accessToken).submitCase(req.session.userCase);
      logger.info(`Submitted Case - ${submittedClaim.data.id}`);
      req.session.userCase = fromApiFormat(submittedClaim.data);
    } catch (error) {
      logger.info(error.message);
    }
    return res.redirect(PageUrls.CLAIM_SUBMITTED);
  };
}
