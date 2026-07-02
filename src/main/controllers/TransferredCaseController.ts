import { Response } from 'express';

import { CaseTransferInfoResponse } from '../definitions/api/caseTransferInfoResponse';
import { AppRequest } from '../definitions/appRequest';
import { TranslationKeys } from '../definitions/constants';
import { getLogger } from '../logger';
import { getCaseApi, isCaseNotFoundError } from '../services/CaseService';

import {
  applyCaseTransferInfoToSession,
  buildTransferredCasePageHeading,
  createFallbackTransferInfo,
} from './helpers/CaseTransferHelper';

const logger = getLogger('TransferredCaseController');

const hasMatchingTransferInfo = (caseId: string, transferInfo?: CaseTransferInfoResponse): boolean => {
  return !!transferInfo?.transferred && String(transferInfo.originalCaseId) === String(caseId);
};

const renderTransferredCasePage = (req: AppRequest, res: Response, transferInfo: CaseTransferInfoResponse): void => {
  const translations = req.t(TranslationKeys.TRANSFERRED_CASE, { returnObjects: true }) as Record<string, string>;
  const showNewCaseNumber = transferInfo.transferComplete && !!transferInfo.newEthosCaseReference;
  const noAccessBody =
    transferInfo.transferType === 'ECM' ? translations.noAccessBodyEcm : translations.noAccessBodyCrossCountry;

  res.render(TranslationKeys.TRANSFERRED_CASE, {
    ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
    ...req.t(TranslationKeys.SIDEBAR_CONTACT_US, { returnObjects: true }),
    ...translations,
    pageHeading: buildTransferredCasePageHeading(translations, transferInfo),
    caseNumber: transferInfo.originalEthosCaseReference ?? '',
    replacementCaseNumber: transferInfo.newEthosCaseReference ?? '',
    destinationOffice: transferInfo.destinationOffice ?? '',
    transferComplete: transferInfo.transferComplete,
    showNewCaseNumber,
    noAccessBody,
  });
};

export default class TransferredCaseController {
  public async get(req: AppRequest, res: Response): Promise<void> {
    const caseId = (req.query.caseId as string) || req.session.caseTransferInfo?.originalCaseId;
    let transferInfo: CaseTransferInfoResponse | undefined = req.session.caseTransferInfo;

    if (caseId && !hasMatchingTransferInfo(caseId, transferInfo)) {
      try {
        transferInfo = (await getCaseApi(req.session.user?.accessToken).getCaseTransferInfo(caseId)).data;
        logger.info(`Fetched transfer info for case ID ${caseId}`);
        transferInfo = applyCaseTransferInfoToSession(req, transferInfo, caseId);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        if (isCaseNotFoundError(error)) {
          logger.info(`Transfer info not available for case ID ${caseId}: ${errorMessage}`);
        } else {
          logger.error(errorMessage);
        }
        if (caseId) {
          logger.info(`Falling back to default transfer info for case ID ${caseId}`);
          transferInfo = applyCaseTransferInfoToSession(req, createFallbackTransferInfo(req, caseId), caseId);
        } else {
          return res.redirect('/not-found');
        }
      }
    } else if (caseId && transferInfo) {
      transferInfo = applyCaseTransferInfoToSession(req, transferInfo, caseId);
    }

    if (!transferInfo?.transferred) {
      if (caseId) {
        transferInfo = applyCaseTransferInfoToSession(req, createFallbackTransferInfo(req, caseId), caseId);
      } else {
        return res.redirect('/not-found');
      }
    }

    renderTransferredCasePage(req, res, transferInfo);
  }
}
