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
