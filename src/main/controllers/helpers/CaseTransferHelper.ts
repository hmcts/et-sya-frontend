import { Response } from 'express';

import { CaseTransferInfoResponse } from '../../definitions/api/caseTransferInfoResponse';
import { AppRequest } from '../../definitions/appRequest';
import { PageUrls } from '../../definitions/constants';
import { getLogger } from '../../logger';
import { getCaseApi, isCaseNotFoundError, isTransferredToEcmCaseError } from '../../services/CaseService';

import { getLanguageParam } from './RouterHelpers';

const logger = getLogger('CaseTransferHelper');

export const createFallbackTransferInfo = (caseId: string): CaseTransferInfoResponse => ({
  transferred: true,
  transferType: 'ECM',
  originalCaseId: caseId,
  transferComplete: false,
});

export const buildTransferredCaseRedirectUrl = (req: AppRequest, caseId: string): string => {
  return `${PageUrls.TRANSFERRED_CASE}${getLanguageParam(req.url)}&caseId=${caseId}`;
};

const redirectToTransferredCase = (
  req: AppRequest,
  res: Response,
  caseId: string,
  transferInfo: CaseTransferInfoResponse
): boolean => {
  req.session.caseTransferInfo = transferInfo;
  res.redirect(buildTransferredCaseRedirectUrl(req, caseId));
  return true;
};

export const shouldFallbackToTransferredCase = (originalError?: unknown): boolean => {
  return isTransferredToEcmCaseError(originalError) || isCaseNotFoundError(originalError);
};

export const handleTransferredCaseRedirect = async (
  req: AppRequest,
  res: Response,
  caseId: string,
  originalError?: unknown
): Promise<boolean> => {
  try {
    const caseApi = await getCaseApi(req.session.user?.accessToken);
    const transferInfo = await caseApi.getCaseTransferInfo(caseId);
    const transferInfoData = transferInfo.data;

    if (transferInfoData?.transferred) {
      logger.info(`Case ID ${caseId} has been transferred. Redirecting to transferred case page.`);
      return redirectToTransferredCase(req, res, caseId, transferInfoData);
    }
  } catch (transferError) {
    const transferErrorMessage = transferError instanceof Error ? transferError.message : String(transferError);

    if (shouldFallbackToTransferredCase(originalError)) {
      logger.info(
        `Case ID ${caseId} appears transferred; transfer-info unavailable (${transferErrorMessage}). Using fallback redirect.`
      );
      return redirectToTransferredCase(req, res, caseId, createFallbackTransferInfo(caseId));
    }

    logger.warn(`Case ID ${caseId} transfer check failed: ${transferErrorMessage}`);
  }
  return false;
};
