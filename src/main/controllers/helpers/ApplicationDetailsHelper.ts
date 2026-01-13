import { AppRequest } from '../../definitions/appRequest';
import { CaseWithId, Document, YesOrNo } from '../../definitions/case';
import {
  GenericTseApplicationType,
  GenericTseApplicationTypeItem,
  TseRespondTypeItem,
} from '../../definitions/complexTypes/genericTseApplicationTypeItem';
import { PseResponseTypeItem } from '../../definitions/complexTypes/sendNotificationTypeItem';
import { Applicant, TseStatus } from '../../definitions/constants';
import { SummaryListRow, addSummaryHtmlRow, addSummaryRow } from '../../definitions/govuk/govukSummaryList';
import { AnyRecord } from '../../definitions/util-types';
import { datesStringToDateInLocale } from '../../helper/dateInLocale';
import { getCaseApi } from '../../services/CaseService';

import { isSentToClaimantByTribunal } from './AdminNotificationHelper';
import { createDownloadLink } from './DocumentHelpers';

export const getTseApplicationDetails = (
  selectedApplication: GenericTseApplicationTypeItem,
  translations: AnyRecord,
  downloadLink: string,
  applicationDate: string
): SummaryListRow[] => {
  const application = selectedApplication.value;
  const rows: SummaryListRow[] = [];

  rows.push(addSummaryRow(translations.applicant, translations[application.applicant]));

  if (application.status === TseStatus.STORED_STATE) {
    rows.push(addSummaryRow(translations.storedDate, applicationDate));
  } else {
    rows.push(addSummaryRow(translations.requestDate, applicationDate));
  }

  rows.push(
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
): Promise<TseRespondTypeItem[]> => {
  const allResponses: TseRespondTypeItem[] = [];
  const respondCollection = selectedApplication.value.respondCollection;
  let responseDate;
  if (!respondCollection?.length) {
    return allResponses;
  }
  for (const response of respondCollection) {
    let responseToAdd;
    responseDate = datesStringToDateInLocale(response.value.date, req.url);
    if (
      response.value.from === Applicant.CLAIMANT ||
      (response.value.from === Applicant.RESPONDENT && response.value.copyToOtherParty === YesOrNo.YES)
    ) {
      responseToAdd = await addNonAdminResponse(translations, response, req.session.user?.accessToken, responseDate);
    } else if (isSentToClaimantByTribunal(response)) {
      responseToAdd = await addAdminResponse(
        allResponses,
        translations,
        response,
        req.session.user?.accessToken,
        responseDate
      );
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

export const getAllStoredClaimantResponses = async (
  selectedApplication: GenericTseApplicationTypeItem,
  translations: AnyRecord,
  req: AppRequest
): Promise<TseRespondTypeItem[]> => {
  const allResponses: TseRespondTypeItem[] = [];
  const respondCollection = selectedApplication.value.respondStoredCollection;
  if (!respondCollection?.length) {
    return allResponses;
  }
  for (const response of respondCollection) {
    if (response.value.from === Applicant.CLAIMANT) {
      const responseToAdd: TseRespondTypeItem = await addNonAdminResponse(
        translations,
        response,
        req.session.user?.accessToken,
        datesStringToDateInLocale(response.value.date, req.url)
      );
      allResponses.push(responseToAdd);
    }
  }
  return allResponses;
};

export const getSupportingMaterialDownloadLink = (responseDoc: Document): string | undefined => {
  if (responseDoc !== undefined) {
    return createDownloadLink(responseDoc);
  }
  return undefined;
};

const addAdminResponse = async (
  allResponses: any[],
  translations: AnyRecord,
  response: TseRespondTypeItem,
  accessToken: string,
  responseDate: string
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
      value: { text: responseDate },
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
      value: { text: translations[response.value.isCmoOrRequest] },
    },
    {
      key: {
        text: translations.responseDue,
        classes: 'govuk-!-font-weight-regular-m',
      },
      value: { text: translations[response.value.isResponseRequired] },
    },
    {
      key: {
        text: translations.partyToRespond,
        classes: 'govuk-!-font-weight-regular-m',
      },
      value: { text: translations[response.value.selectPartyRespond] },
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
        html: getSupportingMaterialDownloadLink(
          response.value.addDocument?.find(element => element !== undefined).value.uploadedDocument
        ),
      },
    },
    {
      key: {
        text: translations.requestMadeBy,
        classes: 'govuk-!-font-weight-regular-m',
      },
      value: {
        text:
          response.value.isCmoOrRequest === 'Request'
            ? translations[response.value.requestMadeBy]
            : translations[response.value.cmoMadeBy],
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
      value: { text: translations[response.value.selectPartyNotify] },
    },
  ]);
};

export const addNonAdminResponse = async (
  translations: AnyRecord,
  response: TseRespondTypeItem | PseResponseTypeItem,
  accessToken: string,
  responseDate: string
): Promise<any> => {
  const supportingMaterial = getSupportingMaterialDownloadLink(
    response.value.supportingMaterial?.find(e => e).value.uploadedDocument
  );

  const rows = [
    addSummaryRow(translations.responder, translations[response.value.from]),
    addSummaryRow(translations.responseDate, responseDate),
    addSummaryRow(translations.response, response.value.response),
    addSummaryHtmlRow(translations.supportingMaterial, supportingMaterial),
  ];

  if (response.value.copyToOtherParty) {
    rows.push(addSummaryRow(translations.copyCorrespondence, translations[response.value.copyToOtherParty]));
  }

  return rows;
};

export const getResponseDisplay = async (
  response: TseRespondTypeItem,
  translations: AnyRecord,
  accessToken: string
): Promise<SummaryListRow[]> => {
  return addNonAdminResponse(translations, response, accessToken, response.value.date);
};

export const getAllTseApplicationCollection = (userCase: CaseWithId): GenericTseApplicationTypeItem[] => {
  const returnCollection: GenericTseApplicationTypeItem[] = [];
  if (userCase.genericTseApplicationCollection !== undefined) {
    returnCollection.push(...userCase.genericTseApplicationCollection);
  }
  if (userCase.tseApplicationStoredCollection !== undefined) {
    returnCollection.push(...userCase.tseApplicationStoredCollection);
  }
  return returnCollection;
};
