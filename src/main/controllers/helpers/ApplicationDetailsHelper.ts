import { YesOrNo } from '../../definitions/case';
import { GenericTseApplicationTypeItem } from '../../definitions/complexTypes/genericTseApplicationTypeItem';
import { AnyRecord } from '../../definitions/util-types';

export const getTseApplicationDetails = (
  selectedApplication: GenericTseApplicationTypeItem,
  translations: AnyRecord,
  downloadLink: string
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
