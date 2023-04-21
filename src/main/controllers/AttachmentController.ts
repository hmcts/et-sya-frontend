import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { PageUrls } from '../definitions/constants';
import { getDocId } from '../helper/ApiFormatter';
import { getLogger } from '../logger';
import { getCaseApi } from '../services/CaseService';

import { getClaimantResponseDocDownload } from './helpers/TseRespondentApplicationHelpers';

const logger = getLogger('AttachmentController');

/**
 * Displays a supporting material document
 */
export default class AttachmentController {
  public async get(req: AppRequest, res: Response): Promise<void> {
    const docId = req.params.docId;
    const userCase = req.session?.userCase;
    let respondentAppDocId;
    let claimantResponseDocId;
    let decisionDocId;
    let requestDocId;
    let contactTribunalDocId;
    const adminDecision = userCase.selectedGenericTseApplication?.value.adminDecision;

    if (req.session.documentDownloadPage === PageUrls.RESPONDENT_APPLICATION_DETAILS) {
      respondentAppDocId = getDocId(userCase.selectedGenericTseApplication?.value.documentUpload.document_url);

      claimantResponseDocId = undefined;
      const claimantResponseDoc = getClaimantResponseDocDownload(userCase.selectedGenericTseApplication);
      if (claimantResponseDoc !== undefined) {
        claimantResponseDocId = getDocId(claimantResponseDoc.document_url);
      }

      decisionDocId = undefined;
      const decisionDocIds = [];
      if (adminDecision?.length) {
        for (let i = adminDecision.length - 1; i >= 0; i--) {
          if (adminDecision[i].value.responseRequiredDoc !== undefined) {
            decisionDocIds[i] = adminDecision[i].value.responseRequiredDoc.document_url;
          }
        }
      }
      decisionDocId = decisionDocIds.map(it => getDocId(it)).find(id => id === docId);
    }

    requestDocId = undefined;
    if (req.session.documentDownloadPage === PageUrls.TRIBUNAL_ORDER_OR_REQUEST_DETAILS) {
      if (userCase.selectedRequestOrOrder?.value.sendNotificationUploadDocument?.length) {
        requestDocId = userCase.selectedRequestOrOrder?.value.sendNotificationUploadDocument
          .map(it => getDocId(it.value.uploadedDocument.document_url))
          .find(id => id === docId);
      }
    }

    if (req.session.documentDownloadPage === PageUrls.APPLICATION_DETAILS) {
      contactTribunalDocId = undefined;
      if (userCase.selectedGenericTseApplication?.value.documentUpload.document_url !== undefined) {
        contactTribunalDocId = getDocId(userCase.selectedGenericTseApplication?.value.documentUpload.document_url);
      }
    }

    try {
      if (
        docId !== decisionDocId &&
        docId !== requestDocId &&
        docId !== respondentAppDocId &&
        docId !== claimantResponseDocId &&
        docId !== contactTribunalDocId
      ) {
        logger.info('bad request parameter');
        return res.redirect('/not-found');
      }
      const document = await getCaseApi(req.session.user?.accessToken).getCaseDocument(docId);
      res.setHeader('Content-Type', document.headers['content-type']);
      res.status(200).send(Buffer.from(document.data, 'binary'));
    } catch (err) {
      logger.error(err.message);
      return res.redirect('/not-found');
    }
  }
}
