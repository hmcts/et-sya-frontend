import { AppRequest } from '../../definitions/appRequest';
import { Document } from '../../definitions/case';
import { GenericTseApplicationTypeItem } from '../../definitions/complexTypes/genericTseApplicationTypeItem';
import { DocumentDetail } from '../../definitions/definition';
import { getDocId, getFileExtension } from '../../helper/ApiFormatter';
import { getCaseApi } from '../../services/CaseService';

import { getClaimantResponseDocDownload } from './TseRespondentApplicationHelpers';

export const getDocumentDetails = async (documents: DocumentDetail[], accessToken: string): Promise<void> => {
  for await (const document of documents) {
    const docDetails = await getCaseApi(accessToken).getDocumentDetails(document.id);
    const { createdOn, size, mimeType, originalDocumentName } = docDetails.data;
    const retrievedValues = {
      size: (size / 1000000).toFixed(3),
      mimeType,
      originalDocumentName,
      createdOn: new Intl.DateTimeFormat('en-GB', {
        dateStyle: 'long',
      }).format(new Date(createdOn)),
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
  const { size, mimeType } = docDetails.data;
  doc.document_mime_type = mimeType;
  doc.document_size = size;
  return doc;
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

export function getClaimantResponseDocId(selectedApplication: GenericTseApplicationTypeItem): string {
  let claimantResponseDocId = undefined;
  const claimantResponseDoc = getClaimantResponseDocDownload(selectedApplication);
  if (claimantResponseDoc !== undefined) {
    claimantResponseDocId = getDocId(claimantResponseDoc.document_url);
  }
  return claimantResponseDocId;
}

export function getDecisionDocId(req: AppRequest, selectedApplication: GenericTseApplicationTypeItem): string {
  let decisionDocId = undefined;
  const docId = req.params.docId;
  const decisionDocIds = [];
  if (selectedApplication?.value.adminDecision?.length) {
    const adminDecisions = selectedApplication.value.adminDecision;
    for (let i = adminDecisions.length - 1; i >= 0; i--) {
      if (adminDecisions[i].value.responseRequiredDoc !== undefined) {
        decisionDocIds[i] = adminDecisions[i].value.responseRequiredDoc.document_url;
      }
    }
  }
  decisionDocId = decisionDocIds.map(it => getDocId(it)).find(id => id === docId);
  return decisionDocId;
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
