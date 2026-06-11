import { Response } from 'express';

import { AppRequest } from '../../definitions/appRequest';
import { PageUrls } from '../../definitions/constants';
import { getLogger } from '../../logger';
import { getCaseApi } from '../../services/CaseService';

import { getLanguageParam } from './RouterHelpers';

const logger = getLogger('CaseTransferHelper');

export const buildTransferredCaseRedirectUrl = (req: AppRequest, caseId: string): string => {
  return `${PageUrls.TRANSFERRED_CASE}${getLanguageParam(req.url)}&caseId=${caseId}`;
};

export const handleTransferredCaseRedirect = async (
  req: AppRequest,
  res: Response,
  caseId: string
): Promise<boolean> => {
  try {
    const transferInfo = (await getCaseApi(req.session.user?.accessToken).getCaseTransferInfo(caseId)).data;
    if (transferInfo?.transferred) {
      logger.error(
        `Case ID ${caseId} has been transferred.` +
          ` Redirecting to transferred case page. Transfer info: ${JSON.stringify(transferInfo)}`
      );
      req.session.caseTransferInfo = transferInfo;
      res.redirect(buildTransferredCaseRedirectUrl(req, caseId));
      return true;
    }
  } catch (transferError) {
    logger.error(`Case ID ${caseId} transferred case check error occurred: ${JSON.stringify(transferError)}`);
    logger.error(transferError instanceof Error ? transferError.message : String(transferError));
  }
  return false;
};
