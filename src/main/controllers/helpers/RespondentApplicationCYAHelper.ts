import { CaseWithId, YesOrNo } from '../../definitions/case';
import { CHANGE, PageUrls } from '../../definitions/constants';
import { applicationTypes } from '../../definitions/contact-applications';
import { AnyRecord } from '../../definitions/util-types';

export const getRespondentCyaContent = (
  userCase: CaseWithId,
  translations: AnyRecord,
  languageParam: string,
  supportingMaterialUrl: string,
  downloadLink: string
): { key: unknown; value?: unknown; actions?: unknown }[] => {
  return [
    {
      key: {
        text: translations.legend,
        classes: 'govuk-!-font-weight-regular-m',
      },
      value: {
        text: userCase.responseText,
      },
      actions: {
        items: [
          {
            href: supportingMaterialUrl + languageParam,
            text: CHANGE,
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
            href: supportingMaterialUrl + languageParam,
            text: CHANGE,
            visuallyHiddenText: translations.supportingMaterial,
          },
        ],
      },
    },
    ...(applicationTypes.claimant.c.includes(userCase.contactApplicationType)
      ? []
      : [
          ...(!userCase.copyToOtherPartyYesOrNo
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
                        text: CHANGE,
                        visuallyHiddenText: translations.copyToOtherPartyYesOrNo,
                      },
                    ],
                  },
                },
                ...(userCase.copyToOtherPartyYesOrNo === YesOrNo.YES
                  ? []
                  : [
                      {
                        key: {
                          text: translations.copyToOtherPartyText,
                          classes: 'govuk-!-font-weight-regular-m',
                        },
                        value: {
                          text: userCase.copyToOtherPartyText,
                        },
                        actions: {
                          items: [
                            {
                              href: PageUrls.COPY_TO_OTHER_PARTY + languageParam,
                              text: CHANGE,
                              visuallyHiddenText: translations.copyToOtherPartyText,
                            },
                          ],
                        },
                      },
                    ]),
              ]),
        ]),
  ];
};
