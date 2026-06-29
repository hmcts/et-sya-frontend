import { Response } from 'express';

import { CaseTransferInfoResponse } from '../../definitions/api/caseTransferInfoResponse';
import { AppRequest } from '../../definitions/appRequest';
import { PageUrls } from '../../definitions/constants';
import { getLogger } from '../../logger';
import { getCaseApi, isCaseNotFoundError, isTransferredToEcmCaseError } from '../../services/CaseService';

import { getLanguageParam } from './RouterHelpers';

const logger = getLogger('CaseTransferHelper');
const SESSION_SAVE_TIMEOUT_MS = 10000;

export const createFallbackTransferInfo = (caseId: string): CaseTransferInfoResponse => ({
  transferred: true,
  transferType: 'ECM',
  originalCaseId: caseId,
  transferComplete: false,
});

export const buildTransferredCaseRedirectUrl = (req: AppRequest, caseId: string): string => {
  return `${PageUrls.TRANSFERRED_CASE}${getLanguageParam(req.url)}&caseId=${caseId}`;
};

export const saveSessionAndRedirectToTransferredCase = async (
  req: AppRequest,
  res: Response,
  caseId: string,
  transferInfo: CaseTransferInfoResponse
): Promise<boolean> => {
  req.session.caseTransferInfo = transferInfo;

  try {
    await new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error(`Session save timed out after ${SESSION_SAVE_TIMEOUT_MS}ms`));
      }, SESSION_SAVE_TIMEOUT_MS);

      req.session.save(err => {
        clearTimeout(timeout);
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  } catch (saveError) {
    const saveErrorMessage = saveError instanceof Error ? saveError.message : String(saveError);
    logger.error(`Failed to save session before transferred case redirect for case ID ${caseId}: ${saveErrorMessage}`);
    return false;
  }

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
    const caseApi = getCaseApi(req.session.user?.accessToken);
    const transferInfo = await caseApi.getCaseTransferInfo(caseId);
    const transferInfoData = transferInfo.data;

    if (transferInfoData?.transferred) {
      logger.info(`Case ID ${caseId} has been transferred. Redirecting to transferred case page.`);
      return saveSessionAndRedirectToTransferredCase(req, res, caseId, transferInfoData);
    }
  } catch (transferError) {
    const transferErrorMessage = transferError instanceof Error ? transferError.message : String(transferError);

    if (shouldFallbackToTransferredCase(originalError)) {
      logger.info(
        `Case ID ${caseId} appears transferred; transfer-info unavailable (${transferErrorMessage}). Using fallback redirect.`
      );
      return saveSessionAndRedirectToTransferredCase(req, res, caseId, createFallbackTransferInfo(caseId));
    }

    logger.warn(`Case ID ${caseId} transfer check failed: ${transferErrorMessage}`);
  }
  return false;
};
