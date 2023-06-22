import { AppRequest } from '../../definitions/appRequest';
import { CaseWithId, YesOrNo } from '../../definitions/case';
import { DocumentTypeItem } from '../../definitions/complexTypes/documentTypeItem';
import { AllDocumentTypes, Applicant, PageUrls } from '../../definitions/constants';
import { applicationTypes } from '../../definitions/contact-applications';
import { AnyRecord } from '../../definitions/util-types';
import { getDocId } from '../../helper/ApiFormatter';

import {
  getDecisionDocId,
  getSelectedAppDecisionDocId,
  getSelectedAppDocId,
  getSelectedAppResponseDocId,
  isJudgmentDocId,
  isValidResponseDocId,
} from './DocumentHelpers';
import { getAllAppsWithDecisions, getDecisions, matchDecisionsToApps } from './JudgmentHelpers';

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
        rows: docSection.map(it => mapDocumentToTableRow(it)),
      };
    });
};

export const getTableCaption = (typeOfDoc: string, translations: AnyRecord): string => {
  switch (typeOfDoc) {
    case AllDocumentTypes.ACAS_CERT:
      return translations.acasDocs;
    case AllDocumentTypes.CLAIMANT_CORRESPONDENCE:
      return translations.claimantDocs;
    case AllDocumentTypes.RESPONDENT_CORRESPONDENCE:
      return translations.respondentDocs;
    default:
      return undefined;
  }
};

export const mapDocumentToTableRow = (item: DocumentTypeItem): TableRow => {
  return {
    date: item.value.uploadedDocument.createdOn,
    description: item.value.shortDescription,
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
        claimantDocs.push(doc);
        break;
      case AllDocumentTypes.RESPONDENT_CORRESPONDENCE:
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
    const decisions = getDecisions(userCase);
    const appsWithDecisions = getAllAppsWithDecisions(userCase);
    const appsAndDecisions = matchDecisionsToApps(appsWithDecisions, decisions);
    if (
      docId === getSelectedAppDocId(docId, appsAndDecisions) ||
      docId === getSelectedAppResponseDocId(docId, appsAndDecisions) ||
      docId === getSelectedAppDecisionDocId(docId, appsAndDecisions)
    ) {
      return true;
    }
  }
  return false;
};

export const isDocOnApplicationPage = (req: AppRequest, docId: string): boolean => {
  if (
    req.session.documentDownloadPage === PageUrls.RESPONDENT_APPLICATION_DETAILS ||
    req.session.documentDownloadPage === PageUrls.APPLICATION_DETAILS
  ) {
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

export const isApplicationSummaryPage = (page: string): boolean => {
  if (page === PageUrls.RESPONDENT_APPLICATION_DETAILS || page === PageUrls.APPLICATION_DETAILS) {
    return true;
  }
  return false;
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
