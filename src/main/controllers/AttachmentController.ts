import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { PageUrls } from '../definitions/constants';
import { getDocId } from '../helper/ApiFormatter';
import { getLogger } from '../logger';
import { getCaseApi } from '../services/CaseService';

import {
  getDecisionDocId,
  getJudgmentDocId,
  getRequestDocId,
  getResponseDocId,
  getSelectedAppDecisionDocId,
  getSelectedAppDocId,
  getSelectedAppResponseDocId,
} from './helpers/DocumentHelpers';
import { getAllAppsWithDecisions, getDecisions, matchDecisionsToApps } from './helpers/JudgmentHelpers';

const logger = getLogger('AttachmentController');

/**
 * Displays a supporting material document
 */
export default class AttachmentController {
  public async get(req: AppRequest, res: Response): Promise<void> {
    const docId = req.params.docId;
    const userCase = req.session?.userCase;
    let responseDocId;
    let decisionDocId;
    let requestDocId;
    let contactTheTribunalSupportingFileId;
    let supportingFileId;
    let allDocsSelectedFileId;
    const selectedApplication = userCase.selectedGenericTseApplication;
    const selectedApplicationDocUrl = selectedApplication?.value.documentUpload?.document_url;
    let judgmentDocId;
    let appDocId;
    let decisions;
    let appDecisionDocId;

    if (req.session.documentDownloadPage === PageUrls.RESPONDENT_APPLICATION_DETAILS) {
      appDocId = getDocId(selectedApplicationDocUrl);
      responseDocId = getResponseDocId(selectedApplication);
      decisionDocId = getDecisionDocId(req, selectedApplication);
    }

    if (
      req.session.documentDownloadPage === PageUrls.TRIBUNAL_ORDER_OR_REQUEST_DETAILS ||
      req.session.documentDownloadPage === PageUrls.GENERAL_CORRESPONDENCE_NOTIFICATION_DETAILS
    ) {
      requestDocId = getRequestDocId(req);
    }

    if (req.session.documentDownloadPage === PageUrls.APPLICATION_DETAILS) {
      appDocId = undefined;
      if (selectedApplication?.value.documentUpload.document_url !== undefined) {
        appDocId = getDocId(selectedApplicationDocUrl);
      }
    }

    if (userCase.contactApplicationFile) {
      contactTheTribunalSupportingFileId = getDocId(userCase.contactApplicationFile?.document_url);
    }

    if (userCase.supportingMaterialFile) {
      supportingFileId = getDocId(userCase.supportingMaterialFile?.document_url);
    }

    if (req.session.documentDownloadPage === PageUrls.JUDGMENT_DETAILS) {
      judgmentDocId = getJudgmentDocId(req);
      if (judgmentDocId === undefined) {
        decisions = getDecisions(userCase);
        const appsWithDecisions = getAllAppsWithDecisions(userCase);
        const appsAndDecisions = matchDecisionsToApps(appsWithDecisions, decisions);
        appDocId = getSelectedAppDocId(req, appsAndDecisions);
        responseDocId = getSelectedAppResponseDocId(req, appsAndDecisions);
        appDecisionDocId = getSelectedAppDecisionDocId(req, appsAndDecisions);
      }
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
        docId !== responseDocId &&
        docId !== contactTheTribunalSupportingFileId &&
        docId !== supportingFileId &&
        docId !== judgmentDocId &&
        docId !== appDocId &&
        docId !== appDecisionDocId &&
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
