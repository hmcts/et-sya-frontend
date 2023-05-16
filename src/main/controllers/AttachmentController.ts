import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { PageUrls } from '../definitions/constants';
import { getDocId } from '../helper/ApiFormatter';
import { getLogger } from '../logger';
import { getCaseApi } from '../services/CaseService';

import { getClaimantResponseDocId, getDecisionDocId, getRequestDocId } from './helpers/DocumentHelpers';

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
    let contactTheTribunalSupportingFileId;
    let supportingFileId;
    let allDocsSelectedFileId;
    const selectedApplication = userCase.selectedGenericTseApplication;

    if (req.session.documentDownloadPage === PageUrls.RESPONDENT_APPLICATION_DETAILS) {
      respondentAppDocId = getDocId(selectedApplication?.value.documentUpload?.document_url);
      claimantResponseDocId = getClaimantResponseDocId(selectedApplication);
      decisionDocId = getDecisionDocId(req, selectedApplication);
    }

    if (req.session.documentDownloadPage === PageUrls.TRIBUNAL_ORDER_OR_REQUEST_DETAILS) {
      requestDocId = getRequestDocId(req);
    }

    if (req.session.documentDownloadPage === PageUrls.APPLICATION_DETAILS) {
      contactTribunalDocId = undefined;
      if (selectedApplication?.value.documentUpload.document_url !== undefined) {
        contactTribunalDocId = getDocId(selectedApplication?.value.documentUpload?.document_url);
      }
    }

    if (userCase.contactApplicationFile) {
      contactTheTribunalSupportingFileId = getDocId(userCase.contactApplicationFile?.document_url);
    }

    if (userCase.supportingMaterialFile) {
      supportingFileId = getDocId(userCase.supportingMaterialFile?.document_url);
    }

    if (req.session.documentDownloadPage === PageUrls.ALL_DOCUMENTS) {
      allDocsSelectedFileId = userCase.documentCollection
        .map(it => getDocId(it.value.uploadedDocument.document_url))
        .find(it => docId === it);
    }

    try {
      if (
        docId !== decisionDocId &&
        docId !== requestDocId &&
        docId !== respondentAppDocId &&
        docId !== claimantResponseDocId &&
        docId !== contactTribunalDocId &&
        docId !== contactTheTribunalSupportingFileId &&
        docId !== supportingFileId &&
        docId !== allDocsSelectedFileId
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
