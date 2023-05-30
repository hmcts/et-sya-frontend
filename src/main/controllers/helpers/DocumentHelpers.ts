import { AxiosResponse } from 'axios';

import { AppRequest } from '../../definitions/appRequest';
import { CaseWithId, Document } from '../../definitions/case';
import { DocumentTypeItem } from '../../definitions/complexTypes/documentTypeItem';
import { GenericTseApplicationTypeItem } from '../../definitions/complexTypes/genericTseApplicationTypeItem';
import { DOCUMENT_CONTENT_TYPES } from '../../definitions/constants';
import { DecisionAndApplicationDetails, DocumentDetail } from '../../definitions/definition';
import { getDocId, getFileExtension } from '../../helper/ApiFormatter';
import { getCaseApi } from '../../services/CaseService';

export const getDocumentDetails = async (documents: DocumentDetail[], accessToken: string): Promise<void> => {
  for await (const document of documents) {
    const docDetails = await getCaseApi(accessToken).getDocumentDetails(document.id);
    const { createdOn, size, mimeType, originalDocumentName } = docDetails.data;
    const retrievedValues = {
      size: (size / 1000000).toFixed(3),
      mimeType,
      originalDocumentName,
      createdOn: new Intl.DateTimeFormat('en-GB', { dateStyle: 'long' }).format(new Date(createdOn)),
      description: document.description,
    };
    Object.assign(
      documents.find(doc => doc.id === document.id),
      retrievedValues
    );
  }
};

export const getDocumentAdditionalInformation = async (doc: Document, accessToken: string): Promise<Document> => {
  const docId = getDocId(doc.document_url);
  const docDetails = await getCaseApi(accessToken).getDocumentDetails(docId);
  const { createdOn, size, mimeType } = docDetails.data;
  doc.createdOn = new Intl.DateTimeFormat('en-GB', {
    dateStyle: 'long',
  }).format(new Date(createdOn));
  doc.document_mime_type = mimeType;
  doc.document_size = size;
  return doc;
};

export const getDocumentsAdditionalInformation = async (
  documents: DocumentTypeItem[],
  accessToken: string
): Promise<void> => {
  if (documents?.length) {
    for (const doc of documents) {
      await getDocumentAdditionalInformation(doc.value.uploadedDocument, accessToken);
    }
  }
};

// merge arrays but make sure they are not undefined
export const combineDocuments = (...arrays: DocumentDetail[][]): DocumentDetail[] =>
  [].concat(...arrays.filter(Array.isArray)).filter(doc => doc !== undefined);

export const createDownloadLink = (file: Document): string => {
  const mimeType = getFileExtension(file?.document_filename);
  let downloadLink = '';
  if (file?.document_size && file.document_mime_type && file.document_filename) {
    const href = '/getSupportingMaterial/' + getDocId(file.document_url);
    downloadLink =
      `<a href='${href}' target='_blank' class='govuk-link'>` +
      file.document_filename +
      '(' +
      mimeType +
      ', ' +
      formatBytes(file.document_size) +
      ')' +
      '</a>';
  }
  return downloadLink;
};

export const findSelectedGenericTseApplication = (
  items: GenericTseApplicationTypeItem[],
  param: string
): GenericTseApplicationTypeItem => {
  return items?.find(it => it.id === param);
};

export function formatBytes(bytes: number, decimals = 2): string {
  if (!+bytes) {
    return '0 Bytes';
  }

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))}${sizes[i]}`;
}

export function getResponseDocId(selectedApplication: GenericTseApplicationTypeItem): string {
  let responseDocId = undefined;
  let responseDoc = undefined;
  if (selectedApplication?.value?.respondCollection?.length) {
    const selectedAppResponse = selectedApplication.value.respondCollection;
    responseDoc = selectedAppResponse[0].value.supportingMaterial?.length
      ? selectedAppResponse[0].value.supportingMaterial[0].value.uploadedDocument
      : undefined;
  }
  if (responseDoc !== undefined) {
    responseDocId = getDocId(responseDoc.document_url);
  }
  return responseDocId;
}

export function getDecisionDocId(req: AppRequest, selectedApplication: GenericTseApplicationTypeItem): string {
  const docId = req.params.docId;
  const decisionDocUrls = [];
  if (selectedApplication?.value.adminDecision?.length) {
    const adminDecisions = selectedApplication.value.adminDecision;
    for (let i = adminDecisions.length - 1; i >= 0; i--) {
      if (adminDecisions[i].value.responseRequiredDoc !== undefined) {
        decisionDocUrls[i] = adminDecisions[i].value.responseRequiredDoc[0].value.uploadedDocument.document_url;
      }
    }
  }
  return decisionDocUrls.map(it => getDocId(it)).find(id => id === docId);
}

export function getSelectedAppDecisionDocId(
  req: AppRequest,
  appsAndDecisions: DecisionAndApplicationDetails[]
): string {
  const docId = req.params.docId;
  const selectedAppDecisionDocIds = [];
  for (let i = 0; i < appsAndDecisions.length; i++) {
    if (appsAndDecisions[i].decisionOfApp?.value?.responseRequiredDoc?.length) {
      const parent = appsAndDecisions[i];
      for (let j = 0; j < parent.decisionOfApp.value.responseRequiredDoc.length; j++) {
        if (parent.decisionOfApp.value.responseRequiredDoc[j].downloadLink) {
          const nested = parent.decisionOfApp.value.responseRequiredDoc[j];
          selectedAppDecisionDocIds.push(nested.value.uploadedDocument.document_url);
        }
      }
    }
  }
  return selectedAppDecisionDocIds.map(it => getDocId(it)).find(id => id === docId);
}

export function getSelectedAppDocId(req: AppRequest, appsAndDecisions: DecisionAndApplicationDetails[]): string {
  let selectedAppDocId = undefined;
  const docId = req.params.docId;
  const selectedAppDocIds = [];
  for (let i = appsAndDecisions.length - 1; i >= 0; i--) {
    if (appsAndDecisions[i].value.documentUpload !== undefined) {
      selectedAppDocIds[i] = appsAndDecisions[i].value.documentUpload.document_url;
    }
  }
  selectedAppDocId = selectedAppDocIds.map(it => getDocId(it)).find(id => id === docId);
  return selectedAppDocId;
}

export function getSelectedAppResponseDocId(
  req: AppRequest,
  appsAndDecisions: DecisionAndApplicationDetails[]
): string {
  let selectedAppResponseDocId = undefined;
  const docId = req.params.docId;
  const selectedAppResponseDocIds = [];
  for (let i = appsAndDecisions.length - 1; i >= 0; i--) {
    if (appsAndDecisions[i].value?.respondCollection?.length) {
      const parent = appsAndDecisions[i];
      for (let j = 0; j < parent.value.respondCollection?.length; j++) {
        const nested = parent.value.respondCollection[j];
        if (nested.value.supportingMaterial?.length) {
          selectedAppResponseDocIds[i] = nested.value.supportingMaterial[0].value.uploadedDocument.document_url;
        }
      }
    }
  }
  selectedAppResponseDocId = selectedAppResponseDocIds.map(it => getDocId(it)).find(id => id === docId);
  return selectedAppResponseDocId;
}

export function getRequestDocId(req: AppRequest): string {
  const docId = req.params.docId;
  const userCase = req.session?.userCase;
  const requestDoc = userCase.selectedRequestOrOrder?.value.sendNotificationUploadDocument;
  let requestDocId = undefined;
  if (requestDoc?.length) {
    requestDocId = requestDoc.map(it => getDocId(it.value.uploadedDocument.document_url)).find(id => id === docId);
  }
  return requestDocId;
}

export function getJudgmentDocId(req: AppRequest): string {
  const docId = req.params.docId;
  const userCase = req.session?.userCase;
  const judgmentDoc = userCase.selectedRequestOrOrder?.value.sendNotificationUploadDocument;
  let judgmentDocId = undefined;
  if (judgmentDoc?.length) {
    judgmentDocId = judgmentDoc.map(it => getDocId(it.value.uploadedDocument.document_url)).find(id => id === docId);
  }
  return judgmentDocId;
}

export const combineUserCaseDocuments = (userCases: CaseWithId[]): DocumentDetail[] => {
  const combinedDocuments: DocumentDetail[] = [];
  userCases?.forEach(userCase => {
    combinedDocuments.push(userCase.et1SubmittedForm);
    pushDocumentsToCombinedDocuments(combinedDocuments, userCase.acknowledgementOfClaimLetterDetail);
    pushDocumentsToCombinedDocuments(combinedDocuments, userCase.rejectionOfClaimDocumentDetail);
    pushDocumentsToCombinedDocuments(combinedDocuments, userCase.responseAcknowledgementDocumentDetail);
    pushDocumentsToCombinedDocuments(combinedDocuments, userCase.responseRejectionDocumentDetail);
    pushDocumentsToCombinedDocuments(combinedDocuments, userCase.responseEt3FormDocumentDetail);
    if (userCase.claimSummaryFile?.document_url) {
      const document_url = userCase.claimSummaryFile.document_url;
      const documentId = document_url?.substring(document_url?.lastIndexOf('/') + 1);
      const claimSummaryFileDetail: DocumentDetail = {
        description: 'Claim Summary File Detail',
        id: documentId,
        originalDocumentName: userCase.claimSummaryFile.document_filename,
      };
      combinedDocuments.push(claimSummaryFileDetail);
    }
  });
  return combinedDocuments;
};

function pushDocumentsToCombinedDocuments(combinedDocuments: DocumentDetail[], documentDetailsList: DocumentDetail[]) {
  documentDetailsList?.forEach(documentDetail => combinedDocuments.push(documentDetail));
}

export const findDocumentMimeTypeByExtension = (extension: string): string | undefined => {
  const mimetype = Object.entries(DOCUMENT_CONTENT_TYPES).find(([, [ext]]) => ext === extension) || [];
  return mimetype[1] ? mimetype[1][1] : undefined;
};

export const findContentTypeByDocumentDetail = (documentDetail: DocumentDetail): string => {
  let contentType = documentDetail.mimeType;
  if (!contentType && documentDetail.originalDocumentName) {
    const originalDocumentExtension = documentDetail.originalDocumentName
      .substring(documentDetail.originalDocumentName.indexOf('.') + 1)
      ?.toLowerCase();
    contentType = findDocumentMimeTypeByExtension(originalDocumentExtension);
  }
  return contentType;
};

export const findContentTypeByDocument = (document: AxiosResponse): string => {
  let contentType = document.headers['content-type'];
  if (!contentType) {
    let fileName: string = document?.headers?.originalfilename;
    if (!fileName) {
      const contentDisposition = document.headers['content-disposition'];
      fileName = contentDisposition?.substring(
        contentDisposition?.indexOf('"') + 1,
        contentDisposition?.lastIndexOf('"')
      );
    }
    const fileExtension = fileName?.substring(fileName.indexOf('.') + 1)?.toLowerCase();
    contentType = findDocumentMimeTypeByExtension(fileExtension);
  }
  return contentType;
};
