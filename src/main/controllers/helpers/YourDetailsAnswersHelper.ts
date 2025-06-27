import {
  CaseTypeId,
  CaseWithId,
  EmailOrPost,
  EnglishOrWelsh,
  HearingPreference,
  Sex,
  YesOrNo,
} from '../../definitions/case';
import { InterceptPaths, PageUrls } from '../../definitions/constants';
import { SummaryListRow, addSummaryRow, createChangeAction } from '../../definitions/govuk/govukSummaryList';
import { AnyRecord } from '../../definitions/util-types';

import { answersAddressFormatter } from './PageContentHelpers';

const getTranslationsSex = (userCase: CaseWithId, translations: AnyRecord): string => {
  switch (userCase?.claimantSex) {
    case Sex.MALE:
      return translations.personalDetails.male;
    case Sex.FEMALE:
      return translations.personalDetails.female;
    case Sex.PREFER_NOT_TO_SAY:
      return translations.personalDetails.preferNotToSay;
    default:
      return translations.notProvided;
  }
};

const getTranslationsContactPreference = (userCase: CaseWithId, translations: AnyRecord): string => {
  switch (userCase?.claimantContactPreference) {
    case EmailOrPost.EMAIL:
      return translations.personalDetails.email;
    case EmailOrPost.POST:
      return translations.personalDetails.post;
    default:
      return translations.notProvided;
  }
};

const getTranslationsLanguagePreference = (answer: EnglishOrWelsh, translations: AnyRecord): string => {
  switch (answer) {
    case EnglishOrWelsh.WELSH:
      return translations.personalDetails.welsh;
    case EnglishOrWelsh.ENGLISH:
      return translations.personalDetails.english;
    default:
      return translations.notProvided;
  }
};

const getTranslationsHearingPreferences = function (userCase: CaseWithId, translations: AnyRecord) {
  const preferenceMap: Record<string, string> = {
    [HearingPreference.VIDEO]: translations.personalDetails.video,
    [HearingPreference.PHONE]: translations.personalDetails.phone,
    [HearingPreference.NEITHER]: translations.personalDetails.neither,
  };
  const preferences = (userCase?.hearingPreferences || []).map(preference => preferenceMap[preference]).filter(Boolean);
  return preferences.length > 0 ? preferences : [translations.notProvided];
};

const getTranslationsReasonableAdjustments = (userCase: CaseWithId, translations: AnyRecord): string => {
  switch (userCase?.reasonableAdjustments) {
    case YesOrNo.YES:
      return translations.oesYesOrNo.yes + ', ' + userCase.reasonableAdjustmentsDetail;
    case YesOrNo.NO:
      return translations.oesYesOrNo.no;
    default:
      return translations.notProvided;
  }
};

export const getYourDetails = (userCase: CaseWithId, translations: AnyRecord): SummaryListRow[] => {
  const rows: SummaryListRow[] = [];

  rows.push(
    {
      key: {
        text: translations.personalDetails.header,
        classes: 'govuk-summary-list__key govuk-heading-m',
      },
      value: {},
    },
    addSummaryRow(
      translations.personalDetails.dob,
      userCase.dobDate
        ? userCase.dobDate.day + '-' + userCase.dobDate.month + '-' + userCase.dobDate.year
        : translations.notProvided,
      createChangeAction(
        PageUrls.DOB_DETAILS + InterceptPaths.ANSWERS_CHANGE,
        translations.change,
        translations.personalDetails.dob
      )
    ),
    addSummaryRow(
      translations.personalDetails.sex,
      getTranslationsSex(userCase, translations),
      createChangeAction(
        PageUrls.SEX_AND_TITLE + InterceptPaths.ANSWERS_CHANGE,
        translations.change,
        translations.personalDetails.sex
      )
    ),
    addSummaryRow(
      translations.personalDetails.title,
      userCase.preferredTitle ?? translations.notProvided,
      createChangeAction(
        PageUrls.SEX_AND_TITLE + InterceptPaths.ANSWERS_CHANGE,
        translations.change,
        translations.personalDetails.title
      )
    ),
    addSummaryRow(
      translations.personalDetails.contactOrHomeAddress,
      answersAddressFormatter(
        userCase.address1,
        userCase.address2,
        userCase.addressTown,
        userCase.addressCountry,
        userCase.addressPostcode
      ),
      createChangeAction(
        PageUrls.ADDRESS_DETAILS + InterceptPaths.ANSWERS_CHANGE,
        translations.change,
        translations.personalDetails.contactOrHomeAddress
      )
    ),
    addSummaryRow(
      translations.contactDetails.telephone,
      userCase.telNumber ?? translations.notProvided,
      createChangeAction(
        PageUrls.TELEPHONE_NUMBER + InterceptPaths.ANSWERS_CHANGE,
        translations.change,
        translations.contactDetails.telephone
      )
    ),
    addSummaryRow(
      translations.personalDetails.howToBeContacted,
      getTranslationsContactPreference(userCase, translations),
      createChangeAction(
        PageUrls.UPDATE_PREFERENCES + InterceptPaths.ANSWERS_CHANGE,
        translations.change,
        translations.personalDetails.howToBeContacted
      )
    )
  );

  if (userCase.caseTypeId === CaseTypeId.ENGLAND_WALES) {
    rows.push(
      addSummaryRow(
        translations.personalDetails.languageLabel,
        getTranslationsLanguagePreference(userCase?.claimantContactLanguagePreference, translations),
        createChangeAction(
          PageUrls.UPDATE_PREFERENCES + InterceptPaths.ANSWERS_CHANGE,
          translations.change,
          translations.personalDetails.howToBeContacted
        )
      ),
      addSummaryRow(
        translations.personalDetails.hearingLabel,
        getTranslationsLanguagePreference(userCase?.claimantHearingLanguagePreference, translations),
        createChangeAction(
          PageUrls.UPDATE_PREFERENCES + InterceptPaths.ANSWERS_CHANGE,
          translations.change,
          translations.personalDetails.howToBeContacted
        )
      )
    );
  }

  rows.push(
    addSummaryRow(
      translations.personalDetails.takePartInHearing,
      getTranslationsHearingPreferences(userCase, translations),
      createChangeAction(
        PageUrls.VIDEO_HEARINGS + InterceptPaths.ANSWERS_CHANGE,
        translations.change,
        translations.personalDetails.takePartInHearing
      )
    ),
    addSummaryRow(
      translations.personalDetails.disability,
      getTranslationsReasonableAdjustments(userCase, translations),
      createChangeAction(
        PageUrls.REASONABLE_ADJUSTMENTS + InterceptPaths.ANSWERS_CHANGE,
        translations.change,
        translations.personalDetails.disability
      )
    )
  );

  return rows;
};
