import { AxiosResponse } from 'axios';

import { AppRequest } from '../../definitions/appRequest';
import { CaseWithId, Document } from '../../definitions/case';
import { DocumentTypeItem } from '../../definitions/complexTypes/documentTypeItem';
import {
  GenericTseApplicationTypeItem,
  TseRespondTypeItem,
} from '../../definitions/complexTypes/genericTseApplicationTypeItem';
import { Applicant, DOCUMENT_CONTENT_TYPES, PageUrls } from '../../definitions/constants';
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

export function isValidResponseDocId(docId: string, respondCollection: TseRespondTypeItem[]): boolean {
  for (const response of respondCollection) {
    if (response.value.from === Applicant.CLAIMANT || response.value.from === Applicant.RESPONDENT) {
      if (
        docId ===
        getDocId(
          response.value.supportingMaterial?.find(element => element !== undefined).value.uploadedDocument.document_url
        )
      ) {
        return true;
      }
    } else if (response.value.from === Applicant.ADMIN) {
      if (docId === getDocId(response.value?.addDocument[0].value?.uploadedDocument.document_url)) {
        return true;
      }
    }
  }
  return false;
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

export function getSelectedAppDecisionDocId(docId: string, appsAndDecisions: DecisionAndApplicationDetails[]): string {
  const selectedAppDecisionDocIds = [];
  for (const element of appsAndDecisions) {
    if (element.decisionOfApp?.value?.responseRequiredDoc?.length) {
      const responseRequiredDocs = element.decisionOfApp.value.responseRequiredDoc;
      for (const doc of responseRequiredDocs) {
        if (doc.downloadLink) {
          selectedAppDecisionDocIds.push(doc.value.uploadedDocument.document_url);
        }
      }
    }
  }
  return selectedAppDecisionDocIds.map(it => getDocId(it)).find(id => id === docId);
}

export function getSelectedAppDocId(docId: string, appsAndDecisions: DecisionAndApplicationDetails[]): string {
  let selectedAppDocId = undefined;
  const selectedAppDocIds = [];
  for (let i = appsAndDecisions.length - 1; i >= 0; i--) {
    if (appsAndDecisions[i].value.documentUpload !== undefined) {
      selectedAppDocIds[i] = appsAndDecisions[i].value.documentUpload.document_url;
    }
  }
  selectedAppDocId = selectedAppDocIds.map(it => getDocId(it)).find(id => id === docId);
  return selectedAppDocId;
}

export function getSelectedAppResponseDocId(docId: string, appsAndDecisions: DecisionAndApplicationDetails[]): string {
  let selectedAppResponseDocId = undefined;
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

export function isRequestDocId(req: AppRequest, docId: string): boolean {
  if (
    req.session.documentDownloadPage === PageUrls.TRIBUNAL_ORDER_OR_REQUEST_DETAILS ||
    req.session.documentDownloadPage === PageUrls.GENERAL_CORRESPONDENCE_NOTIFICATION_DETAILS
  ) {
    const requestDoc = req.session?.userCase.selectedRequestOrOrder?.value.sendNotificationUploadDocument;
    if (docId === requestDoc?.map(it => getDocId(it.value.uploadedDocument.document_url)).find(id => id === docId)) {
      return true;
    }
    return false;
  }
}

export function isJudgmentDocId(userCase: CaseWithId, docId: string): boolean {
  const judgmentDoc = userCase.selectedRequestOrOrder?.value.sendNotificationUploadDocument;
  if (judgmentDoc?.length) {
    return (
      judgmentDoc.map(it => getDocId(it.value.uploadedDocument.document_url)).find(id => id === docId) !== undefined
    );
  }
  return false;
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
