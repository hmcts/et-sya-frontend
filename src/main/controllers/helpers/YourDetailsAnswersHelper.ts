import { CaseWithId, YesOrNo } from '../../definitions/case';
import { InterceptPaths, PageUrls } from '../../definitions/constants';
import { AnyRecord } from '../../definitions/util-types';

import { answersAddressFormatter } from './PageContentHelpers';

export const getYourDetails = (
  userCase: CaseWithId,
  translations: AnyRecord
): { key: unknown; value?: unknown; actions?: unknown }[] => {
  return [
    {
      key: {
        text: translations.personalDetails.header,
        classes: 'govuk-heading-m',
      },
    },
    {
      key: {
        text: translations.personalDetails.dob,
        classes: 'govuk-!-font-weight-regular-m',
      },
      value: {
        text:
          userCase.dobDate === undefined
            ? ''
            : userCase.dobDate.day + '-' + userCase.dobDate.month + '-' + userCase.dobDate.year,
      },
      actions: {
        items: [
          {
            href: PageUrls.DOB_DETAILS + InterceptPaths.ANSWERS_CHANGE,
            text: translations.change,
            visuallyHiddenText: translations.personalDetails.dob,
          },
        ],
      },
    },
    {
      key: {
        text: translations.personalDetails.sex,
        classes: 'govuk-!-font-weight-regular-m',
      },
      value: {
        text: userCase.claimantSex,
      },
      actions: {
        items: [
          {
            href: PageUrls.SEX_AND_TITLE + InterceptPaths.ANSWERS_CHANGE,
            text: translations.change,
            visuallyHiddenText: translations.personalDetails.sex,
          },
        ],
      },
    },
    {
      key: {
        text: translations.personalDetails.title,
        classes: 'govuk-!-font-weight-regular-m',
      },
      value: {
        text:
          userCase.preferredTitle === undefined ? translations.personalDetails.notSelected : userCase.preferredTitle,
      },

      actions: {
        items: [
          {
            href: PageUrls.SEX_AND_TITLE + InterceptPaths.ANSWERS_CHANGE,
            text: translations.change,
            visuallyHiddenText: translations.personalDetails.title,
          },
        ],
      },
    },
    {
      key: {
        text: translations.personalDetails.contactOrHomeAddress,
        classes: 'govuk-!-font-weight-regular-m',
      },
      value: {
        text: answersAddressFormatter(
          userCase.address1,
          userCase.address2,
          userCase.addressTown,
          userCase.addressCountry,
          userCase.addressPostcode
        ),
      },
      actions: {
        items: [
          {
            href: PageUrls.ADDRESS_DETAILS + InterceptPaths.ANSWERS_CHANGE,
            text: translations.change,
            visuallyHiddenText: translations.personalDetails.contactOrHomeAddress,
          },
        ],
      },
    },
    {
      key: {
        text: translations.contactDetails.telephone,
        classes: 'govuk-!-font-weight-regular-m',
      },
      value: {
        text: userCase.telNumber === undefined ? translations.contactDetails.notProvided : userCase.telNumber,
      },
      actions: {
        items: [
          {
            href: PageUrls.TELEPHONE_NUMBER + InterceptPaths.ANSWERS_CHANGE,
            text: translations.change,
            visuallyHiddenText: translations.contactDetails.telephone,
          },
        ],
      },
    },
    {
      key: {
        text: translations.personalDetails.howToBeContacted,
        classes: 'govuk-!-font-weight-regular-m',
      },
      value: {
        text: userCase.claimantContactPreference,
      },
      actions: {
        items: [
          {
            href: PageUrls.UPDATE_PREFERENCES + InterceptPaths.ANSWERS_CHANGE,
            text: translations.change,
            visuallyHiddenText: translations.personalDetails.howToBeContacted,
          },
        ],
      },
    },
    {
      key: {
        text: translations.personalDetails.takePartInHearing,
        classes: 'govuk-!-font-weight-regular-m',
      },
      value: {
        text: userCase.hearingPreferences,
      },
      actions: {
        items: [
          {
            href: PageUrls.VIDEO_HEARINGS + InterceptPaths.ANSWERS_CHANGE,
            text: translations.change,
            visuallyHiddenText: translations.personalDetails.takePartInHearing,
          },
        ],
      },
    },
    {
      key: {
        text: translations.personalDetails.disability,
        classes: 'govuk-!-font-weight-regular-m',
      },
      value: {
        text:
          userCase.reasonableAdjustments === YesOrNo.YES
            ? userCase.reasonableAdjustments + ', ' + userCase.reasonableAdjustmentsDetail
            : userCase.reasonableAdjustments,
      },
      actions: {
        items: [
          {
            href: PageUrls.REASONABLE_ADJUSTMENTS + InterceptPaths.ANSWERS_CHANGE,
            text: translations.change,
            visuallyHiddenText: translations.personalDetails.disability,
          },
        ],
      },
    },
  ];
};
