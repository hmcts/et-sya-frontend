import { SummaryListRow } from '../../definitions/govuk/govukSummaryList';
import { CaseWithId, YesOrNo } from '../../definitions/case';
import { CHANGE, PageUrls } from '../../definitions/constants';
import { applicationTypes } from '../../definitions/contact-applications';
import { AnyRecord } from '../../definitions/util-types';

export const getCyaContent = (
  userCase: CaseWithId,
  translations: AnyRecord,
  languageParam: string,
  contactTheTribunalSelectedUrl: string,
  downloadLink: string,
  typeOfApplication: string
): SummaryListRow[] => {
  const cyaContent: SummaryListRow[] = [
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
            text: CHANGE,
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
            href: contactTheTribunalSelectedUrl + languageParam,
            text: CHANGE,
            visuallyHiddenText: translations.supportingMaterial,
          },
        ],
      },
    },
  ];

  if (!applicationTypes.claimant.c.includes(userCase.contactApplicationType)) {
    cyaContent.push({
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
    });

    if (userCase.copyToOtherPartyYesOrNo === YesOrNo.NO) {
      cyaContent.push({
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
      });
    }
  }

  return cyaContent;
};
