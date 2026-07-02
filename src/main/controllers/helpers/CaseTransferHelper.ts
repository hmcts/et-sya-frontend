import { Response } from 'express';

import { CaseTransferInfoResponse } from '../../definitions/api/caseTransferInfoResponse';
import { AppRequest } from '../../definitions/appRequest';
import { PageUrls } from '../../definitions/constants';
import { getLogger } from '../../logger';
import { getCaseApi, isCaseNotFoundError, isTransferredToEcmCaseError } from '../../services/CaseService';

import { getLanguageParam } from './RouterHelpers';

const logger = getLogger('CaseTransferHelper');
const SESSION_SAVE_TIMEOUT_MS = 10000;

const getMatchingUserCase = (req: AppRequest, caseId: string) => {
  const userCase = req.session.userCase;
  return userCase && String(userCase.id) === String(caseId) ? userCase : undefined;
};

export const enrichTransferInfoWithCaseParties = (
  req: AppRequest,
  transferInfo: CaseTransferInfoResponse,
  caseId: string
): CaseTransferInfoResponse => {
  const userCase = getMatchingUserCase(req, caseId);
  const existingTransferInfo =
    req.session.caseTransferInfo && String(req.session.caseTransferInfo.originalCaseId) === String(caseId)
      ? req.session.caseTransferInfo
      : undefined;

  return {
    ...transferInfo,
    claimantFirstName: transferInfo.claimantFirstName ?? existingTransferInfo?.claimantFirstName ?? userCase?.firstName,
    claimantLastName: transferInfo.claimantLastName ?? existingTransferInfo?.claimantLastName ?? userCase?.lastName,
    respondentName:
      transferInfo.respondentName ?? existingTransferInfo?.respondentName ?? userCase?.respondents?.[0]?.respondentName,
  };
};

export const applyCaseTransferInfoToSession = (
  req: AppRequest,
  transferInfo: CaseTransferInfoResponse,
  caseId: string
): CaseTransferInfoResponse => {
  const enrichedTransferInfo = enrichTransferInfoWithCaseParties(req, transferInfo, caseId);
  req.session.caseTransferInfo = enrichedTransferInfo;
  return enrichedTransferInfo;
};

export const buildTransferredCasePageHeading = (
  translations: Record<string, string>,
  transferInfo: CaseTransferInfoResponse
): string => {
  const { claimantFirstName, claimantLastName, respondentName } = transferInfo;

  if (claimantFirstName && claimantLastName && respondentName) {
    return `${translations.header}${claimantFirstName} ${claimantLastName} vs ${respondentName}`;
  }

  return translations.title;
};

export const createFallbackTransferInfo = (req: AppRequest, caseId: string): CaseTransferInfoResponse =>
  enrichTransferInfoWithCaseParties(
    req,
    {
      transferred: true,
      transferType: 'ECM',
      originalCaseId: caseId,
      transferComplete: false,
    },
    caseId
  );

export const buildTransferredCaseRedirectUrl = (req: AppRequest, caseId: string): string => {
  return `${PageUrls.TRANSFERRED_CASE}${getLanguageParam(req.url)}&caseId=${caseId}`;
};

export const saveSessionAndRedirectToTransferredCase = async (
  req: AppRequest,
  res: Response,
  caseId: string,
  transferInfo: CaseTransferInfoResponse
): Promise<boolean> => {
  applyCaseTransferInfoToSession(req, transferInfo, caseId);

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
      return saveSessionAndRedirectToTransferredCase(req, res, caseId, createFallbackTransferInfo(req, caseId));
    }

    logger.warn(`Case ID ${caseId} transfer check failed: ${transferErrorMessage}`);
  }
  return false;
};
