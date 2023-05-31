import { CaseWithId } from '../../definitions/case';
import { CHANGE, PageUrls } from '../../definitions/constants';
import { AnyRecord } from '../../definitions/util-types';

export const getCyaContent = (
  userCase: CaseWithId,
  translations: AnyRecord,
  languageParam: string,
  downloadLink: string,
  whoseHearingDoc: string,
  whatAreHearingDocs: string,
  selectedHearing: string
): { key: unknown; value?: unknown; actions?: unknown }[] => {
  return [
    {
      key: {
        text: translations.q1,
        classes: 'govuk-!-font-weight-regular-m',
      },
      value: {
        text: userCase.bundlesRespondentAgreedDocWith,
      },
      actions: {
        items: [
          {
            href: PageUrls.AGREEING_DOCUMENTS_FOR_HEARING + languageParam,
            text: CHANGE,
            visuallyHiddenText: translations.q1,
          },
        ],
      },
    },
    {
      key: {
        text: translations.q2,
        classes: 'govuk-!-font-weight-regular-m',
      },
      value: {
        text: selectedHearing,
      },
      actions: {
        items: [
          {
            href: PageUrls.ABOUT_HEARING_DOCUMENTS + languageParam,
            text: CHANGE,
            visuallyHiddenText: translations.q2,
          },
        ],
      },
    },
    {
      key: {
        text: translations.q3,
        classes: 'govuk-!-font-weight-regular-m',
      },
      value: {
        text: whoseHearingDoc,
      },
      actions: {
        items: [
          {
            href: PageUrls.ABOUT_HEARING_DOCUMENTS + languageParam,
            text: CHANGE,
            visuallyHiddenText: translations.q3,
          },
        ],
      },
    },
    {
      key: {
        text: translations.q4,
        classes: 'govuk-!-font-weight-regular-m',
      },
      value: {
        text: whatAreHearingDocs,
      },
      actions: {
        items: [
          {
            href: PageUrls.ABOUT_HEARING_DOCUMENTS + languageParam,
            text: CHANGE,
            visuallyHiddenText: translations.q4,
          },
        ],
      },
    },
    {
      key: {
        text: translations.q5,
        classes: 'govuk-!-font-weight-regular-m',
      },
      value: { html: downloadLink },

      actions: {
        items: [
          {
            href: PageUrls.HEARING_DOCUMENT_UPLOAD + languageParam,
            text: CHANGE,
            visuallyHiddenText: translations.q5,
          },
        ],
      },
    },
  ];
};
