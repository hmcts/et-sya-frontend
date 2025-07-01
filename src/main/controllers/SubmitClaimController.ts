import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { PageUrls } from '../definitions/constants';
import { fromApiFormat } from '../helper/ApiFormatter';
import { getLogger } from '../logger';
import { getCaseApi } from '../services/CaseService';

import { checkCaseStateAndRedirect } from './helpers/CaseHelpers';

const logger = getLogger('SubmitCaseController');

export default class SubmitCaseController {
  public get = async (req: AppRequest, res: Response): Promise<void> => {
    if (checkCaseStateAndRedirect(req, res)) {
      return; // Early return if redirect occurred
    }
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
