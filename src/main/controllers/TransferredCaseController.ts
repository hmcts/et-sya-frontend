import { Response } from 'express';

import { CaseTransferInfoResponse } from '../definitions/api/caseTransferInfoResponse';
import { AppRequest } from '../definitions/appRequest';
import { ErrorPages, TranslationKeys } from '../definitions/constants';
import { getLogger } from '../logger';
import { getCaseApi } from '../services/CaseService';

import {
  applyCaseTransferInfoToSession,
  buildTransferredCasePageHeading,
  clearCaseTransferInfoIfStale,
  getRequestedCaseId,
  getTransferredCaseNoAccessBody,
  isTransferInfoForCase,
} from './helpers/CaseTransferHelper';

const logger = getLogger('TransferredCaseController');

const needsTransferInfoRefresh = (caseId: string, transferInfo?: CaseTransferInfoResponse): boolean => {
  if (!isTransferInfoForCase(caseId, transferInfo)) {
    return true;
  }

  return !transferInfo.transferComplete;
};

const renderTransferredCasePage = (req: AppRequest, res: Response, transferInfo: CaseTransferInfoResponse): void => {
  const translations = req.t(TranslationKeys.TRANSFERRED_CASE, { returnObjects: true }) as Record<string, string>;
  const showNewCaseNumber = transferInfo.transferComplete && !!transferInfo.newEthosCaseReference;
  const noAccessBody = getTransferredCaseNoAccessBody(translations, transferInfo.transferType);

  res.render(TranslationKeys.TRANSFERRED_CASE, {
    ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
    ...req.t(TranslationKeys.SIDEBAR_CONTACT_US, { returnObjects: true }),
    ...translations,
    pageHeading: buildTransferredCasePageHeading(translations, transferInfo),
    caseNumber: transferInfo.originalEthosCaseReference ?? '',
    replacementCaseNumber: transferInfo.newEthosCaseReference ?? '',
    transferComplete: transferInfo.transferComplete,
    showNewCaseNumber,
    noAccessBody,
  });
};

export default class TransferredCaseController {
  public async get(req: AppRequest, res: Response): Promise<void> {
    const caseId = getRequestedCaseId(req);

    if (!caseId) {
      return res.redirect(ErrorPages.NOT_FOUND);
    }

    clearCaseTransferInfoIfStale(req, caseId);

    let transferInfo: CaseTransferInfoResponse | undefined = req.session.caseTransferInfo;

    if (needsTransferInfoRefresh(caseId, transferInfo)) {
      try {
        transferInfo = (await getCaseApi(req.session.user?.accessToken).getCaseTransferInfo(caseId)).data;
        logger.info(`Fetched transfer info for case ID ${caseId}`);

        if (!isTransferInfoForCase(caseId, transferInfo)) {
          logger.info(`Transfer info for case ID ${caseId} is invalid or does not match requested case`);
          return res.redirect(ErrorPages.NOT_FOUND);
        }

        transferInfo = applyCaseTransferInfoToSession(req, transferInfo, caseId);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        logger.error(`Unable to load transfer info for case ID ${caseId}: ${errorMessage}`);
        return res.redirect(ErrorPages.NOT_FOUND);
      }
    } else if (transferInfo) {
      transferInfo = applyCaseTransferInfoToSession(req, transferInfo, caseId);
    }

    if (!isTransferInfoForCase(caseId, transferInfo)) {
      return res.redirect(ErrorPages.NOT_FOUND);
    }

    renderTransferredCasePage(req, res, transferInfo);
  }
}
