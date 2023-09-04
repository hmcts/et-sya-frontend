import { AppRequest } from '../../definitions/appRequest';
import { Document, YesOrNo } from '../../definitions/case';
import {
  GenericTseApplicationTypeItem,
  TseRespondTypeItem,
} from '../../definitions/complexTypes/genericTseApplicationTypeItem';
import { Applicant } from '../../definitions/constants';
import { SummaryListRow, addSummaryHtmlRow, addSummaryRow } from '../../definitions/govuk/govukSummaryList';
import { AnyRecord } from '../../definitions/util-types';
import { getCaseApi } from '../../services/CaseService';

import { isSentToClaimantByTribunal } from './AdminNotificationHelper';
import { createDownloadLink, getDocumentAdditionalInformation } from './DocumentHelpers';

export const getTseApplicationDetails = (
  selectedApplication: GenericTseApplicationTypeItem,
  translations: AnyRecord,
  downloadLink: string
): SummaryListRow[] => {
  const application = selectedApplication.value;
  const rows: SummaryListRow[] = [];

  rows.push(addSummaryRow(translations.applicant, application.applicant));
  rows.push(addSummaryRow(translations.requestDate, application.date));
  rows.push(addSummaryRow(translations.applicationType, translations[application.type]));
  rows.push(addSummaryRow(translations.legend, application.details));
  rows.push(addSummaryHtmlRow(translations.supportingMaterial, downloadLink));
  rows.push(addSummaryRow(translations.copyCorrespondence, application.copyToOtherPartyYesOrNo));

  if (application.copyToOtherPartyText) {
    rows.push(addSummaryRow(translations.copyToOtherPartyText, application.copyToOtherPartyText));
  }

  return rows;
};

export const getTseApplicationDecisionDetails = (
  selectedApplication: GenericTseApplicationTypeItem,
  translations: AnyRecord,
  decisionDocDownloadLink: string[] | undefined
): { key: unknown; value?: unknown; actions?: unknown }[] => {
  const tseApplicationDecisionDetails = [];

  let tableTopSpacing = '';
  let notification = translations.notification;

  for (let i = selectedApplication.value?.adminDecision.length - 1; i >= 0; i--) {
    if (i !== selectedApplication.value?.adminDecision.length - 1) {
      tableTopSpacing = translations.tableTopWithSpace;
      notification = translations.notificationWithSpace;
    }
    tseApplicationDecisionDetails.push(
      {
        key: {
          html: notification,
          classes: 'govuk-!-font-weight-regular-m',
        },
        value: {
          html: tableTopSpacing + selectedApplication.value.adminDecision[i].value.enterNotificationTitle,
        },
      },
      {
        key: {
          text: translations.decision,
          classes: 'govuk-!-font-weight-regular-m',
        },
        value: {
          text: selectedApplication.value.adminDecision[i].value.decision,
        },
      },
      {
        key: {
          text: translations.date,
          classes: 'govuk-!-font-weight-regular-m',
        },
        value: {
          text: selectedApplication.value.adminDecision[i].value.date,
        },
      },
      {
        key: {
          text: translations.sentBy,
          classes: 'govuk-!-font-weight-regular-m',
        },
        value: {
          text: translations.tribunal,
        },
      },
      {
        key: {
          text: translations.decisionType,
          classes: 'govuk-!-font-weight-regular-m',
        },
        value: {
          text: selectedApplication.value.adminDecision[i].value.typeOfDecision,
        },
      },
      {
        key: {
          text: translations.additionalInfo,
          classes: 'govuk-!-font-weight-regular-m',
        },
        value: {
          text: selectedApplication.value.adminDecision[i].value.additionalInformation,
        },
      },
      {
        key: {
          text: translations.document,
          classes: 'govuk-!-font-weight-regular-m',
        },
        value: { html: decisionDocDownloadLink[i] },
      },
      {
        key: {
          text: translations.decisionMadeBy,
          classes: 'govuk-!-font-weight-regular-m',
        },
        value: {
          text: selectedApplication.value.adminDecision[i].value.decisionMadeBy,
        },
      },
      {
        key: {
          text: translations.name,
          classes: 'govuk-!-font-weight-regular-m',
        },
        value: {
          text: selectedApplication.value.adminDecision[i].value.decisionMadeByFullName,
        },
      },
      {
        key: {
          text: translations.sentTo,
          classes: 'govuk-!-font-weight-regular-m',
        },
        value: {
          text: selectedApplication.value.adminDecision[i].value.selectPartyNotify,
        },
      }
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

const getSupportingMaterialDownloadLink = async (
  responseDoc: Document,
  accessToken: string
): Promise<string | void> => {
  let responseDocDownload;
  if (responseDoc !== undefined) {
    await getDocumentAdditionalInformation(responseDoc, accessToken);
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
