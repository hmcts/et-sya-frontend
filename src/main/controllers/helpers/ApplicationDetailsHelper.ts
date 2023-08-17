
import { AppRequest } from '../../definitions/appRequest';
import { Document, YesOrNo } from '../../definitions/case';
import { GenericTseApplicationType, GenericTseApplicationTypeItem } from '../../definitions/complexTypes/genericTseApplicationTypeItem';
import { Applicant } from '../../definitions/constants';
import { AnyRecord } from '../../definitions/util-types';
import { getCaseApi } from '../../services/CaseService';
import { isSentToClaimantByTribunal } from './AdminNotificationHelper';
import { createDownloadLink, populateDocumentMetadata } from './DocumentHelpers';
import { TseRespondType } from '../../definitions/complexTypes/genericTseApplicationTypeItem';
import { GovUkSummaryRow } from 'definitions/nunjucks';

export const getTseApplicationDetails = (application: GenericTseApplicationType, translations: AnyRecord, downloadLink: string) => {
  const rows = [
    addSummaryRow(translations.applicant, application.applicant),
    addSummaryRow(translations.requestDate, application.date),
    addSummaryRow(translations.applicationType, translations[application.type]),
    addSummaryRow(translations.legend, application.details),
    addSummaryRow(translations.supportingMaterial, undefined, downloadLink),
    addSummaryRow(translations.copyCorrespondence, application.copyToOtherPartyYesOrNo)
  ];

  if (application.copyToOtherPartyText) {
    rows.push(addSummaryRow(translations.copyToOtherPartyText, application.copyToOtherPartyText));
  }

  return rows;
};

export const getTseApplicationDecisionDetails = (
  application: GenericTseApplicationType,
  translations: AnyRecord,
  decisionDocDownloadLink: string[]
): Array<Array<GovUkSummaryRow>> => {
  const reversedDownloadLinks = [...decisionDocDownloadLink].reverse()

  return [...application.adminDecision].reverse().map(({ value: decision }, i) =>
    [
      addSummaryRow(translations.notification, decision.enterNotificationTitle),
      addSummaryRow(translations.decision, decision.decision),
      addSummaryRow(translations.date, decision.date),
      addSummaryRow(translations.sentBy, translations.tribunal),
      addSummaryRow(translations.decisionType, decision.typeOfDecision),
      addSummaryRow(translations.additionalInfo, decision.additionalInformation),
      addSummaryRow(translations.document, undefined, reversedDownloadLinks[i]),
      addSummaryRow(translations.decisionMadeBy, decision.decisionMadeBy),
      addSummaryRow(translations.name, decision.decisionMadeByFullName),
      addSummaryRow(translations.sentTo, decision.selectPartyNotify)
    ]
  )
};

export const getAllResponses = async (
  selectedApplication: GenericTseApplicationTypeItem,
  translations: AnyRecord,
  req: AppRequest
) => {
  const respondCollection = selectedApplication.value.respondCollection;
  if (!respondCollection?.length) {
    return [];
  }

  const allResponses: Array<Array<GovUkSummaryRow>> = [];
  const { user, userCase } = req.session;

  for (const { id, value: response } of respondCollection) {
    if (isSentToClaimantByTribunal(response)) {
      allResponses.push(await getRowsForAdminResponse(translations, response, req.session.user?.accessToken));
      if (response.isResponseRequired !== YesOrNo.YES && response.viewedByClaimant !== YesOrNo.YES) {
        await getCaseApi(user.accessToken).updateResponseAsViewed(userCase, selectedApplication.id, id);
      }
    } else if (response.from !== Applicant.ADMIN) {
      allResponses.push(await getRowsForNonAdminResponse(translations, response, user.accessToken))
    }
  }

  return allResponses;
};

const getSupportingMaterialDownloadLink = async (responseDoc: Document, accessToken: string) => {
  if (!responseDoc) {
    throw new Error('Document was null');
  }

  await populateDocumentMetadata(responseDoc, accessToken);
  return createDownloadLink(responseDoc);
};

const getRowsForAdminResponse = async (translations: AnyRecord, response: TseRespondType, accessToken: string): Promise<Array<GovUkSummaryRow>> => {
  const requestMadeBy = response.isCmoOrRequest === 'Request' ? response.requestMadeBy : response.cmoMadeBy

  const firstDocument = response.addDocument?.find(e => e).value;
  let downloadLink = ''; 

  if (firstDocument) {
    downloadLink = await getSupportingMaterialDownloadLink(firstDocument.uploadedDocument, accessToken);
  }

  return [
    addSummaryRow(translations.responseItem, response.enterResponseTitle),
    addSummaryRow(translations.date, response.date),
    addSummaryRow(translations.sentBy, translations.tribunal),
    addSummaryRow(translations.orderOrRequest, response.isCmoOrRequest),
    addSummaryRow(translations.responseDue, response.isResponseRequired),
    addSummaryRow(translations.partyToRespond, response.selectPartyRespond),
    addSummaryRow(translations.additionalInfo, response.additionalInformation),
    addSummaryRow(translations.requestMadeBy, requestMadeBy),
    addSummaryRow(translations.description, firstDocument?.shortDescription),
    addSummaryRow(translations.document, undefined, downloadLink),
    addSummaryRow(translations.name, response.madeByFullName),
    addSummaryRow(translations.sentTo, response.selectPartyNotify),
  ];
};

const getRowsForNonAdminResponse = async (translations: AnyRecord, response: TseRespondType, accessToken: string) => {
  const firstDocument = response.supportingMaterial?.find(e => e).value.uploadedDocument;
  let downloadLink = '';
  if (firstDocument) {
    downloadLink = await getSupportingMaterialDownloadLink(firstDocument, accessToken);
  }

  return [
    addSummaryRow(translations.responder, response.from),
    addSummaryRow(translations.responseDate, response.date),
    addSummaryRow(translations.response, response.response),
    addSummaryRow(translations.supportingMaterial, undefined, downloadLink),
    addSummaryRow(translations.copyCorrespondence, response.copyToOtherParty),
  ];
};

function addSummaryRow(keyText: string, valueText?: string, valueHtml?: string): GovUkSummaryRow {
  return {
    key: {
      text: keyText,
      classes: 'govuk-!-font-weight-regular-m'
    },
    value: {
      text: valueText,
      html: valueHtml
    }
  }
}