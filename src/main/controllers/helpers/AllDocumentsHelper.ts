import { AppRequest } from '../../definitions/appRequest';
import { DocumentTypeItem } from '../../definitions/complexTypes/documentTypeItem';
import { PageUrls } from '../../definitions/constants';
import { getDocId } from '../../helper/ApiFormatter';

import {
  getDecisionDocId,
  isJudgmentDocId,
  isSelectedAppDecisionDocId,
  isSelectedAppDocId,
  isSelectedAppResponseDocId,
  isValidResponseDocId,
} from './DocumentHelpers';
import { getAllAppsWithDecisions } from './JudgmentHelpers';

export const isDocFromJudgement = (req: AppRequest, docId: string): boolean => {
  if (req.session.documentDownloadPage === PageUrls.JUDGMENT_DETAILS) {
    const userCase = req.session?.userCase;
    if (isJudgmentDocId(userCase, docId)) {
      return true;
    }
    const appsWithDecisions = getAllAppsWithDecisions(userCase);
    if (
      isSelectedAppDocId(docId, appsWithDecisions) ||
      isSelectedAppResponseDocId(docId, appsWithDecisions) ||
      isSelectedAppDecisionDocId(docId, appsWithDecisions)
    ) {
      return true;
    }
  }
  return false;
};

export const isDocOnApplicationPage = (req: AppRequest, docId: string): boolean => {
  if (isApplicationSummaryPage(req.session.documentDownloadPage)) {
    const selectedApplication = req.session?.userCase.selectedGenericTseApplication;
    if (
      docId === getDocId(selectedApplication?.value.documentUpload?.document_url) ||
      docId === getDecisionDocId(req, selectedApplication) ||
      isValidResponseDocId(docId, selectedApplication.value.respondCollection) ||
      isValidResponseDocId(docId, selectedApplication.value.respondStoredCollection)
    ) {
      return true;
    }
  }
  return false;
};

export const isDocInDocumentCollection = (req: AppRequest, docId: string): boolean => {
  if (req.session.documentDownloadPage === PageUrls.ALL_DOCUMENTS) {
    const allDocsSelectedFileId = req.session?.userCase.documentCollection
      .map(it => getDocId(it.value.uploadedDocument.document_url))
      .find(it => docId === it);
    if (docId === allDocsSelectedFileId) {
      return true;
    }
  }
  return false;
};

export const isDocInPseRespondCollection = (req: AppRequest, docId: string): boolean => {
  for (const item of req.session.userCase?.sendNotificationCollection || []) {
    for (const respond of item.value.respondCollection || []) {
      for (const doc of respond.value.supportingMaterial?.values() || []) {
        if (doc.value.uploadedDocument && docId === getDocId(doc.value.uploadedDocument.document_url)) {
          return true;
        }
      }
    }
  }
  return false;
};

export const isBundlesDoc = (req: AppRequest, docId: string): boolean => {
  if (req.session.documentDownloadPage === PageUrls.ALL_DOCUMENTS) {
    const { userCase } = req.session;
    const bundleDocuments = userCase.bundleDocuments?.length ? userCase.bundleDocuments : [];
    return bundleDocuments.some(it => getDocId(it.value.uploadedDocument.document_url) === docId);
  }
  return false;
};

export const isApplicationSummaryPage = (page: string): boolean => {
  return page === PageUrls.RESPONDENT_APPLICATION_DETAILS || page === PageUrls.APPLICATION_DETAILS;
};

export const compareUploadDates = (a: DocumentTypeItem, b: DocumentTypeItem): number => {
  if (a?.value?.uploadedDocument?.createdOn === undefined || b?.value?.uploadedDocument?.createdOn === undefined) {
    return 1;
  }
  if (Date.parse(a?.value?.uploadedDocument?.createdOn) < Date.parse(b?.value?.uploadedDocument?.createdOn)) {
    return -1;
  }
  if (Date.parse(a?.value?.uploadedDocument?.createdOn) > Date.parse(b?.value?.uploadedDocument?.createdOn)) {
    return 1;
  }
  return 0;
};
