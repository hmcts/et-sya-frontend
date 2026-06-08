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
      req.session.caseTransferInfo = transferInfo;
      res.redirect(buildTransferredCaseRedirectUrl(req, caseId));
      return true;
    }
  } catch (transferError) {
    logger.error(transferError instanceof Error ? transferError.message : String(transferError));
  }
  return false;
};
