import { AppRequest } from '../../definitions/appRequest';
import { CaseWithId, YesOrNo } from '../../definitions/case';
import { DocumentTypeItem } from '../../definitions/complexTypes/documentTypeItem';
import { AllDocumentTypes, Applicant, PageUrls } from '../../definitions/constants';
import { applicationTypes } from '../../definitions/contact-applications';
import { AnyRecord } from '../../definitions/util-types';
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

/*
  Table rows prepared for Acas, Claimant and Respondents documents, Tribunal docs excluded, due to page design
  specificity
*/
export const prepareTableRows = (
  sortedDocuments: Map<string, DocumentTypeItem[]>,
  translations: AnyRecord,
  userCase: CaseWithId
): TableSection[] => {
  const respondentFilteredDocs = filterRespondentsDocuments(
    sortedDocuments.get(AllDocumentTypes.RESPONDENT_CORRESPONDENCE),
    userCase
  );
  return [
    sortedDocuments.get(AllDocumentTypes.ACAS_CERT),
    sortedDocuments.get(AllDocumentTypes.CLAIMANT_CORRESPONDENCE),
    respondentFilteredDocs,
  ]
    .filter(docs => docs.length > 0)
    .map(docSection => {
      return {
        caption: getTableCaption(docSection[0].value.typeOfDocument, translations),
        rows: docSection.map(it => mapDocumentToTableRow(it, translations)),
      };
    });
};

export const getTableCaption = (typeOfDoc: string, translations: AnyRecord): string => {
  switch (typeOfDoc) {
    case AllDocumentTypes.ACAS_CERT:
      return translations.acasDocs;
    case AllDocumentTypes.CLAIMANT_CORRESPONDENCE:
    case AllDocumentTypes.CLAIMANT_HEARING_DOCUMENT:
      return translations.claimantDocs;
    case AllDocumentTypes.RESPONDENT_CORRESPONDENCE:
    case AllDocumentTypes.RESPONDENT_HEARING_DOCUMENT:
      return translations.respondentDocs;
    default:
      return undefined;
  }
};

export const mapDocumentToTableRow = (item: DocumentTypeItem, translations: AnyRecord): TableRow => {
  // if there is a short description and a translation exists, use it, otherwise default to short description
  // bundles will add hearing details as short description caption, we will not have a translation for that
  return {
    date: item.value.uploadedDocument.createdOn,
    description: translations[item.value.shortDescription] || item.value.shortDescription,
    downloadLink: item.downloadLink,
  };
};

export const createSortedDocumentsMap = (docs: DocumentTypeItem[]): Map<string, DocumentTypeItem[]> => {
  const acasDocs: DocumentTypeItem[] = [];
  const claimantDocs: DocumentTypeItem[] = [];
  const respondentDocs: DocumentTypeItem[] = [];
  const tribunalDocs: DocumentTypeItem[] = [];

  docs?.forEach(doc => {
    switch (doc.value.typeOfDocument) {
      case AllDocumentTypes.ACAS_CERT:
        acasDocs.push(doc);
        break;
      case AllDocumentTypes.CLAIMANT_CORRESPONDENCE:
      case AllDocumentTypes.CLAIMANT_HEARING_DOCUMENT:
        claimantDocs.push(doc);
        break;
      case AllDocumentTypes.RESPONDENT_CORRESPONDENCE:
      case AllDocumentTypes.RESPONDENT_HEARING_DOCUMENT:
        respondentDocs.push(doc);
        break;
      default:
        tribunalDocs.push(doc);
        break;
    }
  });

  return new Map<string, DocumentTypeItem[]>([
    [AllDocumentTypes.ACAS_CERT, acasDocs],
    [AllDocumentTypes.CLAIMANT_CORRESPONDENCE, claimantDocs],
    [AllDocumentTypes.RESPONDENT_CORRESPONDENCE, respondentDocs],
    [AllDocumentTypes.TRIBUNAL_CORRESPONDENCE, tribunalDocs],
  ]);
};

/*
  Should filter respondents documents:
  1) A/B type where the answer to Rule92 question is ‘No’
  2) C type
 */
export const filterRespondentsDocuments = (docs: DocumentTypeItem[], userCase: CaseWithId): DocumentTypeItem[] => {
  const docsIdsToBeFiltered: string[] = [];

  userCase.genericTseApplicationCollection?.forEach(tse => {
    const tseValue = tse.value;
    if (
      tseValue.applicant === Applicant.RESPONDENT &&
      tseValue.documentUpload &&
      documentHasToBeFiltered(tseValue.copyToOtherPartyYesOrNo, tseValue.type)
    ) {
      docsIdsToBeFiltered.push(tseValue.documentUpload.document_url);
    }
  });
  return docs.filter(doc => !docsIdsToBeFiltered.includes(doc.value.uploadedDocument.document_url));
};

export const documentHasToBeFiltered = (rule92: string, typeOfApp: string): boolean => {
  return (
    applicationTypes.respondent.c.includes(typeOfApp) ||
    ((applicationTypes.respondent.a.includes(typeOfApp) || applicationTypes.respondent.b.includes(typeOfApp)) &&
      rule92 === YesOrNo.NO)
  );
};

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
      isValidResponseDocId(docId, selectedApplication.value.respondCollection)
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

export interface TableRow {
  date: string;
  description: string;
  downloadLink: string;
}

export interface TableSection {
  caption: string;
  rows: TableRow[];
}
