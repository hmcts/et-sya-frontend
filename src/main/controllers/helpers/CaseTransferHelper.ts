import { Response } from 'express';

import { CaseTransferInfoResponse, CaseTransferType } from '../../definitions/api/caseTransferInfoResponse';
import { AppRequest } from '../../definitions/appRequest';
import { PageUrls } from '../../definitions/constants';
import { getLogger } from '../../logger';
import { getCaseApi, isCaseNotFoundError } from '../../services/CaseService';

import { getLanguageParam } from './RouterHelpers';

const logger = getLogger('CaseTransferHelper');
const SESSION_SAVE_TIMEOUT_MS = 10000;

const getMatchingUserCase = (req: AppRequest, caseId: string) => {
  const userCase = req.session.userCase;
  return userCase && String(userCase.id) === String(caseId) ? userCase : undefined;
};

export const clearCaseTransferInfoIfStale = (req: AppRequest, caseId: string): void => {
  if (req.session.caseTransferInfo && String(req.session.caseTransferInfo.originalCaseId) !== String(caseId)) {
    req.session.caseTransferInfo = undefined;
  }
};

export const isTransferInfoForCase = (caseId: string, transferInfo?: CaseTransferInfoResponse): boolean => {
  return !!transferInfo?.transferred && String(transferInfo.originalCaseId) === String(caseId);
};

export const getRequestedCaseId = (req: AppRequest): string | undefined => {
  const { caseId } = req.query;

  if (Array.isArray(caseId)) {
    return undefined;
  }

  if (typeof caseId === 'string' && caseId.trim()) {
    return caseId;
  }

  return req.session.caseTransferInfo?.originalCaseId;
};

export const getTransferredCaseNoAccessBody = (
  translations: Record<string, string>,
  transferType?: CaseTransferType
): string => {
  if (transferType === 'CROSS_COUNTRY') {
    return translations.noAccessBodyCrossCountry;
  }

  return translations.noAccessBodyEcm;
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
  const redirectUrl = buildTransferredCaseRedirectUrl(req, caseId);

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
    logger.error(
      `Failed to save session before transferred case redirect for case ID ${caseId}: ${saveErrorMessage}. Redirecting anyway.`
    );
  }

  res.redirect(redirectUrl);
  return true;
};

export const handleTransferredCaseRedirect = async (
  req: AppRequest,
  res: Response,
  caseId: string,
  accessError?: unknown
): Promise<boolean> => {
  if (accessError !== undefined && !isCaseNotFoundError(accessError)) {
    return false;
  }

  try {
    const transferInfoData = (await getCaseApi(req.session.user?.accessToken).getCaseTransferInfo(caseId)).data;

    if (isTransferInfoForCase(caseId, transferInfoData)) {
      logger.info(`Case ID ${caseId} has been transferred. Redirecting to transferred case page.`);
      return saveSessionAndRedirectToTransferredCase(req, res, caseId, transferInfoData);
    }

    logger.info(`Case ID ${caseId} is not transferred or transfer info does not match requested case.`);
  } catch (transferError) {
    const transferErrorMessage = transferError instanceof Error ? transferError.message : String(transferError);
    logger.warn(`Case ID ${caseId} transfer check failed: ${transferErrorMessage}`);
  }

  return false;
};
