import { AppRequest } from '../../definitions/appRequest';
import { Document, YesOrNo } from '../../definitions/case';
import {
  GenericTseApplicationType,
  GenericTseApplicationTypeItem,
  TseRespondTypeItem,
} from '../../definitions/complexTypes/genericTseApplicationTypeItem';
import { Applicant } from '../../definitions/constants';
import { SummaryListRow, addSummaryHtmlRow, addSummaryRow } from '../../definitions/govuk/govukSummaryList';
import { AnyRecord } from '../../definitions/util-types';
import { getCaseApi } from '../../services/CaseService';

import { isSentToClaimantByTribunal } from './AdminNotificationHelper';
import { createDownloadLink, populateDocumentMetadata } from './DocumentHelpers';

export const getTseApplicationDetails = (
  selectedApplication: GenericTseApplicationTypeItem,
  translations: AnyRecord,
  downloadLink: string
): SummaryListRow[] => {
  const application = selectedApplication.value;
  const rows: SummaryListRow[] = [];

  rows.push(
    addSummaryRow(translations.applicant, translations[application.applicant]),
    addSummaryRow(translations.requestDate, application.date),
    addSummaryRow(translations.applicationType, translations[application.type]),
    addSummaryRow(translations.legend, application.details),
    addSummaryHtmlRow(translations.supportingMaterial, downloadLink),
    addSummaryRow(translations.copyCorrespondence, translations[application.copyToOtherPartyYesOrNo])
  );

  if (application.copyToOtherPartyText) {
    rows.push(addSummaryRow(translations.copyToOtherPartyText, application.copyToOtherPartyText));
  }

  return rows;
};

export const getTseApplicationDecisionDetails = (
  selectedApplication: GenericTseApplicationType,
  translations: AnyRecord,
  decisionDocDownloadLink: string[] | undefined
): SummaryListRow[] => {
  const tseApplicationDecisionDetails = [];

  let tableTopSpacing = '';
  let notification = translations.notification;

  for (let i = selectedApplication?.adminDecision.length - 1; i >= 0; i--) {
    if (i !== selectedApplication?.adminDecision.length - 1) {
      tableTopSpacing = translations.tableTopWithSpace;
      notification = translations.notificationWithSpace;
    }
    const adminDecision = selectedApplication.adminDecision[i].value;
    tseApplicationDecisionDetails.push(
      {
        key: {
          html: notification,
          classes: 'govuk-!-font-weight-regular-m',
        },
        value: {
          html: tableTopSpacing + adminDecision.enterNotificationTitle,
        },
      },
      addSummaryRow(translations.decision, adminDecision.decision),
      addSummaryRow(translations.date, adminDecision.date),
      addSummaryRow(translations.sentBy, translations.tribunal),
      addSummaryRow(translations.decisionType, adminDecision.typeOfDecision),
      addSummaryRow(translations.additionalInfo, adminDecision.additionalInformation),
      addSummaryHtmlRow(translations.document, decisionDocDownloadLink[i]),
      addSummaryRow(translations.decisionMadeBy, adminDecision.decisionMadeBy),
      addSummaryRow(translations.name, adminDecision.decisionMadeByFullName),
      addSummaryRow(translations.sentTo, adminDecision.selectPartyNotify)
    );
  }
  return tseApplicationDecisionDetails;
};

export const getAllResponses = async (
  selectedApplication: GenericTseApplicationTypeItem,
  translations: AnyRecord,
  req: AppRequest
): Promise<any> => {
  const allResponses: any[] = [];
  const respondCollection = selectedApplication.value.respondCollection;
  if (!respondCollection?.length) {
    return allResponses;
  }
  for (const response of respondCollection) {
    let responseToAdd;
    if (
      response.value.from === Applicant.CLAIMANT ||
      (response.value.from === Applicant.RESPONDENT && response.value.copyToOtherParty === YesOrNo.YES)
    ) {
      responseToAdd = await addNonAdminResponse(translations, response, req.session.user?.accessToken);
    } else if (isSentToClaimantByTribunal(response)) {
      responseToAdd = await addAdminResponse(allResponses, translations, response, req.session.user?.accessToken);
      if (response.value.isResponseRequired !== YesOrNo.YES && response.value.viewedByClaimant !== YesOrNo.YES) {
        await getCaseApi(req.session.user?.accessToken).updateResponseAsViewed(
          req.session.userCase,
          selectedApplication.id,
          response.id
        );
      }
    }
    if (responseToAdd !== undefined) {
      allResponses.push(responseToAdd);
    }
  }
  return allResponses;
};

const getSupportingMaterialDownloadLink = async (responseDoc: Document, accessToken: string): Promise<string> => {
  let responseDocDownload;
  if (responseDoc !== undefined) {
    await populateDocumentMetadata(responseDoc, accessToken);
    responseDocDownload = createDownloadLink(responseDoc);
  }
  return responseDocDownload;
};

const addAdminResponse = async (
  allResponses: any[],
  translations: AnyRecord,
  response: TseRespondTypeItem,
  accessToken: string
): Promise<any> => {
  allResponses.push([
    {
      key: {
        text: translations.responseItem,
        classes: 'govuk-!-font-weight-regular-m',
      },
      value: { text: response.value.enterResponseTitle },
    },
    {
      key: {
        text: translations.date,
        classes: 'govuk-!-font-weight-regular-m',
      },
      value: { text: response.value.date },
    },
    {
      key: {
        text: translations.sentBy,
        classes: 'govuk-!-font-weight-regular-m',
      },
      value: { text: translations.tribunal },
    },
    {
      key: {
        text: translations.orderOrRequest,
        classes: 'govuk-!-font-weight-regular-m',
      },
      value: { text: response.value.isCmoOrRequest },
    },
    {
      key: {
        text: translations.responseDue,
        classes: 'govuk-!-font-weight-regular-m',
      },
      value: { text: response.value.isResponseRequired },
    },
    {
      key: {
        text: translations.partyToRespond,
        classes: 'govuk-!-font-weight-regular-m',
      },
      value: { text: response.value.selectPartyRespond },
    },
    {
      key: {
        text: translations.additionalInfo,
        classes: 'govuk-!-font-weight-regular-m',
      },
      value: { text: response.value.additionalInformation },
    },
    {
      key: {
        text: translations.description,
        classes: 'govuk-!-font-weight-regular-m',
      },
      value: { text: response.value.addDocument?.find(element => element !== undefined).value.shortDescription },
    },
    {
      key: {
        text: translations.document,
        classes: 'govuk-!-font-weight-regular-m',
      },
      value: {
        html: await getSupportingMaterialDownloadLink(
          response.value.addDocument?.find(element => element !== undefined).value.uploadedDocument,
          accessToken
        ),
      },
    },
    {
      key: {
        text: translations.requestMadeBy,
        classes: 'govuk-!-font-weight-regular-m',
      },
      value: {
        text: response.value.isCmoOrRequest === 'Request' ? response.value.requestMadeBy : response.value.cmoMadeBy,
      },
    },
    {
      key: {
        text: translations.name,
        classes: 'govuk-!-font-weight-regular-m',
      },
      value: { text: response.value.madeByFullName },
    },
    {
      key: {
        text: translations.sentTo,
        classes: 'govuk-!-font-weight-regular-m',
      },
      value: { text: response.value.selectPartyNotify },
    },
  ]);
};

const addNonAdminResponse = async (
  translations: AnyRecord,
  response: TseRespondTypeItem,
  accessToken: string
): Promise<any> => {
  return [
    {
      key: {
        text: translations.responder,
        classes: 'govuk-!-font-weight-regular-m',
      },
      value: {
        text: response.value.from,
      },
    },
    {
      key: {
        text: translations.responseDate,
        classes: 'govuk-!-font-weight-regular-m',
      },
      value: { text: response.value.date },
    },
    {
      key: {
        text: translations.response,
        classes: 'govuk-!-font-weight-regular-m',
      },
      value: { text: response.value.response },
    },
    {
      key: {
        text: translations.supportingMaterial,
        classes: 'govuk-!-font-weight-regular-m',
      },
      value: {
        html: await getSupportingMaterialDownloadLink(
          response.value.supportingMaterial?.find(element => element !== undefined).value.uploadedDocument,
          accessToken
        ),
      },
    },
    {
      key: {
        text: translations.copyCorrespondence,
        classes: 'govuk-!-font-weight-regular-m',
      },
      value: { text: response.value.copyToOtherParty },
    },
  ];
};
