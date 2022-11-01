import { CaseWithId, EmailOrPost, HearingPreference, Sex, YesOrNo } from '../../definitions/case';
import { InterceptPaths, PageUrls } from '../../definitions/constants';
import { AnyRecord } from '../../definitions/util-types';

import { answersAddressFormatter } from './PageContentHelpers';

const getTranslationsForSexEnum = function (userCase: CaseWithId, translations: AnyRecord) {
  let translation = translations.personalDetails.preferNotToSay;
  if (userCase.claimantSex === Sex.MALE) {
    translation = translations.personalDetails.male;
  } else if (userCase.claimantSex === Sex.FEMALE) {
    translation = translations.personalDetails.female;
  }
  return translation;
};

const getTranslationsForHearingPreferences = function (userCase: CaseWithId, translations: AnyRecord) {
  const hearingPreferences: string[] = [];
  if (userCase.hearingPreferences !== undefined) {
    userCase.hearingPreferences.forEach(function (item) {
      if (item === HearingPreference.VIDEO) {
        hearingPreferences.push(translations.personalDetails.video);
      }
      if (item === HearingPreference.PHONE) {
        hearingPreferences.push(translations.personalDetails.phone);
      }
      if (item === HearingPreference.NEITHER) {
        hearingPreferences.push(translations.personalDetails.neither);
      }
    });
  }
  return hearingPreferences;
};

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
        text: getTranslationsForSexEnum(userCase, translations),
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
        text:
          userCase.claimantContactPreference === EmailOrPost.EMAIL
            ? translations.personalDetails.email
            : translations.personalDetails.post,
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
        text: getTranslationsForHearingPreferences(userCase, translations),
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
            ? translations.personalDetails.yes + ', ' + userCase.reasonableAdjustmentsDetail
            : translations.personalDetails.no,
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
