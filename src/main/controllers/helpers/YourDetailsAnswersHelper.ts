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

import { answersAddressFormatter, formatCaseDateDDMMYYYY } from './PageContentHelpers';

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

export const getYourDetails = (userCase: CaseWithId, translations: AnyRecord): SummaryListRow[] => {
  const { change } = translations;
  const {
    disability,
    yes,
    no,
    takePartInHearing,
    dob,
    header,
    sex,
    title,
    notSelected,
    contactOrHomeAddress,
    howToBeContacted,
    email,
    post,
    languageLabel,
    welsh,
    english,
    hearingLabel,
  } = translations.personalDetails;
  const { telephone, notProvided } = translations.contactDetails;

  const rows = [
    { key: { text: header, classes: 'govuk-summary-list__key govuk-heading-m' }, value: {} },
    addSummaryRow(
      dob,
      formatCaseDateDDMMYYYY(userCase.dobDate) ?? '',
      undefined,
      createChangeAction(PageUrls.DOB_DETAILS + InterceptPaths.ANSWERS_CHANGE, change, dob)
    ),
    addSummaryRow(
      sex,
      getTranslationsForSexEnum(userCase, translations),
      undefined,
      createChangeAction(PageUrls.SEX_AND_TITLE + InterceptPaths.ANSWERS_CHANGE, change, sex)
    ),
    addSummaryRow(
      title,
      userCase.preferredTitle === undefined ? notSelected : userCase.preferredTitle,
      undefined,
      createChangeAction(PageUrls.SEX_AND_TITLE + InterceptPaths.ANSWERS_CHANGE, change, title)
    ),
    addSummaryRow(
      contactOrHomeAddress,
      answersAddressFormatter(
        userCase.address1,
        userCase.address2,
        userCase.addressTown,
        userCase.addressCountry,
        userCase.addressPostcode
      ),
      undefined,
      createChangeAction(PageUrls.ADDRESS_DETAILS + InterceptPaths.ANSWERS_CHANGE, change, contactOrHomeAddress)
    ),
    addSummaryRow(
      telephone,
      userCase.telNumber === undefined ? notProvided : userCase.telNumber,
      undefined,
      createChangeAction(PageUrls.TELEPHONE_NUMBER + InterceptPaths.ANSWERS_CHANGE, change, telephone)
    ),
    addSummaryRow(
      howToBeContacted,
      userCase.claimantContactPreference === EmailOrPost.EMAIL ? email : post,
      undefined,
      createChangeAction(PageUrls.UPDATE_PREFERENCES + InterceptPaths.ANSWERS_CHANGE, change, howToBeContacted)
    ),
  ];

  if (userCase.caseTypeId === CaseTypeId.ENGLAND_WALES) {
    rows.push(
      addSummaryRow(
        languageLabel,
        userCase.claimantContactLanguagePreference === EnglishOrWelsh.WELSH ? welsh : english,
        undefined,
        createChangeAction(PageUrls.UPDATE_PREFERENCES + InterceptPaths.ANSWERS_CHANGE, change, howToBeContacted)
      ),
      addSummaryRow(
        hearingLabel,
        userCase.claimantHearingLanguagePreference === EnglishOrWelsh.WELSH ? welsh : english,
        undefined,
        createChangeAction(PageUrls.UPDATE_PREFERENCES + InterceptPaths.ANSWERS_CHANGE, change, howToBeContacted)
      )
    );
  }

  rows.push(
    // TODO: Return to this, we're passing an array in and apparently this is fine though docs don't mention it
    addSummaryRow(
      takePartInHearing,
      getTranslationsForHearingPreferences(userCase, translations),
      undefined,
      createChangeAction(PageUrls.VIDEO_HEARINGS + InterceptPaths.ANSWERS_CHANGE, change, takePartInHearing)
    ),
    addSummaryRow(
      disability,
      userCase.reasonableAdjustments === YesOrNo.YES ? `${yes}, ${userCase.reasonableAdjustmentsDetail}` : no,
      undefined,
      createChangeAction(PageUrls.REASONABLE_ADJUSTMENTS + InterceptPaths.ANSWERS_CHANGE, change, disability)
    )
  );

  return rows;
};
