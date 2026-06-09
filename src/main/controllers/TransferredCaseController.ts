import { Response } from 'express';

import { CaseTransferInfoResponse } from '../definitions/api/caseTransferInfoResponse';
import { AppRequest } from '../definitions/appRequest';
import { TranslationKeys } from '../definitions/constants';
import { getLogger } from '../logger';
import { getCaseApi } from '../services/CaseService';

const logger = getLogger('TransferredCaseController');

const fallbackTransferInfo = (caseId: string): CaseTransferInfoResponse => ({
  transferred: true,
  transferType: 'ECM',
  originalCaseId: caseId,
  transferComplete: false,
});

export default class TransferredCaseController {
  public async get(req: AppRequest, res: Response): Promise<void> {
    const caseId = (req.query.caseId as string) || req.session.caseTransferInfo?.originalCaseId;
    let transferInfo: CaseTransferInfoResponse | undefined = req.session.caseTransferInfo;

    if (caseId && transferInfo?.originalCaseId !== caseId) {
      try {
        transferInfo = (await getCaseApi(req.session.user?.accessToken).getCaseTransferInfo(caseId)).data;
        logger.info(`Fetched transfer info for case ID ${caseId}: ${JSON.stringify(transferInfo)}`, '');
        req.session.caseTransferInfo = transferInfo;
      } catch (error) {
        logger.error(error instanceof Error ? error.message : String(error));
        if (caseId) {
          logger.info(`Falling back to default transfer info for case ID ${caseId}`, '');
          transferInfo = fallbackTransferInfo(caseId);
        } else {
          return res.redirect('/not-found');
        }
      }
    }

    if (!transferInfo?.transferred) {
      if (caseId) {
        transferInfo = fallbackTransferInfo(caseId);
      } else {
        return res.redirect('/not-found');
      }
    }

    this.renderTransferredCasePage(req, res, transferInfo);
  }

  private renderTransferredCasePage(req: AppRequest, res: Response, transferInfo: CaseTransferInfoResponse): void {
    const translations = req.t(TranslationKeys.TRANSFERRED_CASE, { returnObjects: true }) as Record<string, string>;
    const showNewCaseNumber = transferInfo.transferComplete && !!transferInfo.newEthosCaseReference;
    const noAccessBody =
      transferInfo.transferType === 'ECM' ? translations.noAccessBodyEcm : translations.noAccessBodyCrossCountry;

    res.render(TranslationKeys.TRANSFERRED_CASE, {
      ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
      ...req.t(TranslationKeys.SIDEBAR_CONTACT_US, { returnObjects: true }),
      ...translations,
      caseNumber: transferInfo.originalEthosCaseReference ?? '',
      replacementCaseNumber: transferInfo.newEthosCaseReference ?? '',
      destinationOffice: transferInfo.destinationOffice ?? '',
      transferComplete: transferInfo.transferComplete,
      showNewCaseNumber,
      noAccessBody,
    });
  }
}
