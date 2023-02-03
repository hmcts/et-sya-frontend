import { CaseWithId } from '../../definitions/case';
import { ContactApplications, PageUrls } from '../../definitions/constants';
import { AnyRecord } from '../../definitions/util-types';

export const getCYAcontent = (
  userCase: CaseWithId,
  translations: AnyRecord,
  languageParam: string,
  contactTheTribunalSelectedUrl: string,
  downloadLink: string,
  typeOfApplication: string
): { key: unknown; value?: unknown; actions?: unknown }[] => {
  return [
    {
      key: {
        text: translations.applicationType,
        classes: 'govuk-!-font-weight-regular-m',
      },
      value: {
        text: typeOfApplication,
      },
      actions: {
        items: [
          {
            href: PageUrls.CONTACT_THE_TRIBUNAL + languageParam,
            text: 'Change',
            visuallyHiddenText: translations.applicationType,
          },
        ],
      },
    },
    {
      key: {
        text: translations.legend,
        classes: 'govuk-!-font-weight-regular-m',
      },
      value: {
        text: userCase.contactApplicationText,
      },
      actions: {
        items: [
          {
            href: contactTheTribunalSelectedUrl + languageParam,
            text: 'Change',
            visuallyHiddenText: translations.legend,
          },
        ],
      },
    },
    {
      key: {
        text: translations.supportingMaterial,
        classes: 'govuk-!-font-weight-regular-m',
      },
      value: { html: downloadLink },

      actions: {
        items: [
          {
            href: contactTheTribunalSelectedUrl + languageParam,
            text: 'Change',
            visuallyHiddenText: translations.supportingMaterial,
          },
        ],
      },
    },
    ...(ContactApplications.TypeC === userCase.contactApplicationType
      ? []
      : [
          {
            key: {
              text: translations.copyToOtherPartyYesOrNo,
              classes: 'govuk-!-font-weight-regular-m',
            },
            value: {
              text: userCase.copyToOtherPartyYesOrNo,
            },
            actions: {
              items: [
                {
                  href: PageUrls.COPY_TO_OTHER_PARTY + languageParam,
                  text: 'Change',
                  visuallyHiddenText: translations.copyToOtherPartyYesOrNo,
                },
              ],
            },
          },
        ]),
  ];
};
