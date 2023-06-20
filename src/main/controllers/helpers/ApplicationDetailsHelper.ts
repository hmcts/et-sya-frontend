import { Response } from 'express';

import { Document, YesOrNo } from '../../definitions/case';
import {
  GenericTseApplicationTypeItem,
  TseRespondTypeItem,
} from '../../definitions/complexTypes/genericTseApplicationTypeItem';
import { AnyRecord } from '../../definitions/util-types';

import { createDownloadLink, getDocumentAdditionalInformation } from './DocumentHelpers';

export const getTseApplicationDetails = (
  selectedApplication: GenericTseApplicationTypeItem,
  translations: AnyRecord,
  downloadLink: string | void
): { key: unknown; value?: unknown; actions?: unknown }[] => {
  return [
    {
      key: {
        text: translations.applicant,
        classes: 'govuk-!-font-weight-regular-m',
      },
      value: {
        text: selectedApplication.value.applicant,
      },
    },
    {
      key: {
        text: translations.requestDate,
        classes: 'govuk-!-font-weight-regular-m',
      },
      value: {
        text: selectedApplication.value.date,
      },
    },
    {
      key: {
        text: translations.applicationType,
        classes: 'govuk-!-font-weight-regular-m',
      },
      value: {
        text: translations[selectedApplication.value.type],
      },
    },
    {
      key: {
        text: translations.legend,
        classes: 'govuk-!-font-weight-regular-m',
      },
      value: { text: selectedApplication.value.details },
    },
    {
      key: {
        text: translations.supportingMaterial,
        classes: 'govuk-!-font-weight-regular-m',
      },
      value: { html: downloadLink },
    },
    {
      key: {
        text: translations.copyCorrespondence,
        classes: 'govuk-!-font-weight-regular-m',
      },
      value: { text: selectedApplication.value.copyToOtherPartyYesOrNo },
    },
    ...(selectedApplication.value.copyToOtherPartyYesOrNo === YesOrNo.YES
      ? []
      : [
          {
            key: {
              text: translations.copyToOtherPartyText,
              classes: 'govuk-!-font-weight-regular-m',
            },
            value: {
              text: selectedApplication.value.copyToOtherPartyText,
            },
          },
        ]),
  ];
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
  respondCollection: TseRespondTypeItem[],
  translations: AnyRecord,
  accessToken: string,
  res: Response
): Promise<any> => {
  const allResponses = [];

  for (const response of respondCollection) {
    if (response.value.from === 'Respondent' || response.value.from === 'Claimant') {
      allResponses.push([
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
            text: translations.yourReponse,
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
              accessToken,
              res
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
      ]);
    }
    if (response.value.from === 'Admin') {
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
              accessToken,
              res
            ),
          },
        },
        {
          key: {
            text: translations.requestMadeBy,
            classes: 'govuk-!-font-weight-regular-m',
          },
          value: { text: response.value.requestMadeBy },
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
    }
  }
  return allResponses;
};

export const getSupportingMaterialDownloadLink = async (
  responseDoc: Document,
  accessToken: string,
  res: Response
): Promise<string | void> => {
  let responseDocDownload = undefined;
  if (responseDoc !== undefined) {
    try {
      await getDocumentAdditionalInformation(responseDoc, accessToken);
    } catch (err) {
      return res.redirect('/not-found');
    }
    responseDocDownload = createDownloadLink(responseDoc);
    console.log(responseDocDownload);
  }
  return responseDocDownload;
};
