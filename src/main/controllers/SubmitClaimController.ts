import { Response } from 'express';

import { CaseStateCheck } from '../decorators/CaseStateCheck';
import { AppRequest } from '../definitions/appRequest';
import { PageUrls } from '../definitions/constants';
import { fromApiFormat } from '../helper/ApiFormatter';
import { getLogger } from '../logger';
import { getCaseApi } from '../services/CaseService';

const logger = getLogger('SubmitCaseController');

export default class SubmitCaseController {
  @CaseStateCheck()
  public get = async (req: AppRequest, res: Response): Promise<void> => {
    try {
      const submittedClaim = await getCaseApi(req.session.user?.accessToken).submitCase(req.session.userCase);
      logger.info(`Submitted Case - ${submittedClaim.data.id}`);
      req.session.userCase = fromApiFormat(submittedClaim.data);
      req.session.errors = [];
    } catch (error) {
      logger.info(error.message);
      req.session.errors = [{ errorType: 'api', propertyName: 'hiddenErrorField' }];
      return res.redirect(PageUrls.CHECK_ANSWERS);
    }
    return res.redirect(PageUrls.CLAIM_SUBMITTED);
  };
}
