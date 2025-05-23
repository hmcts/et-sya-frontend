import {
  CaseTypeId,
  CaseWithId,
  EmailOrPost,
  EnglishOrWelsh,
  HearingPanelPreference,
  HearingPreference,
  Sex,
  YesOrNo,
} from '../../definitions/case';
import { InterceptPaths, PageUrls } from '../../definitions/constants';
import { SummaryListRow, addSummaryRow, createChangeAction } from '../../definitions/govuk/govukSummaryList';
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
      userCase.dobDate === undefined
        ? ''
        : userCase.dobDate.day + '-' + userCase.dobDate.month + '-' + userCase.dobDate.year,
      createChangeAction(
        PageUrls.DOB_DETAILS + InterceptPaths.ANSWERS_CHANGE,
        translations.change,
        translations.personalDetails.dob
      )
    ),
    addSummaryRow(
      translations.personalDetails.sex,
      getTranslationsForSexEnum(userCase, translations),
      createChangeAction(
        PageUrls.SEX_AND_TITLE + InterceptPaths.ANSWERS_CHANGE,
        translations.change,
        translations.personalDetails.sex
      )
    ),
    addSummaryRow(
      translations.personalDetails.title,
      userCase.preferredTitle ?? translations.personalDetails.notSelected,
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
      userCase.telNumber ?? translations.contactDetails.notProvided,
      createChangeAction(
        PageUrls.TELEPHONE_NUMBER + InterceptPaths.ANSWERS_CHANGE,
        translations.change,
        translations.contactDetails.telephone
      )
    ),
    addSummaryRow(
      translations.personalDetails.howToBeContacted,
      userCase.claimantContactPreference === EmailOrPost.EMAIL
        ? translations.personalDetails.email
        : translations.personalDetails.post,
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
        userCase.claimantContactLanguagePreference === EnglishOrWelsh.WELSH
          ? translations.personalDetails.welsh
          : translations.personalDetails.english,
        createChangeAction(
          PageUrls.UPDATE_PREFERENCES + InterceptPaths.ANSWERS_CHANGE,
          translations.change,
          translations.personalDetails.howToBeContacted
        )
      ),
      addSummaryRow(
        translations.personalDetails.hearingLabel,
        userCase.claimantHearingLanguagePreference === EnglishOrWelsh.WELSH
          ? translations.personalDetails.welsh
          : translations.personalDetails.english,
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
      getTranslationsForHearingPreferences(userCase, translations),
      createChangeAction(
        PageUrls.VIDEO_HEARINGS + InterceptPaths.ANSWERS_CHANGE,
        translations.change,
        translations.personalDetails.takePartInHearing
      )
    ),
    addSummaryRow(
      translations.personalDetails.hearingPanelPreference,
      userCase.hearingPanelPreference === HearingPanelPreference.NO_PREFERENCE
        ? translations.personalDetails.noPreference
        : userCase.hearingPanelPreference === HearingPanelPreference.JUDGE
        ? translations.personalDetails.judge
        : userCase.hearingPanelPreference === HearingPanelPreference.PANEL
        ? translations.personalDetails.panel
        : '',
      createChangeAction(
        PageUrls.HEARING_PANEL_PREFERENCE + InterceptPaths.ANSWERS_CHANGE,
        translations.change,
        translations.personalDetails.hearingPanelPreference
      )
    )
  );

  if (userCase.hearingPanelPreference && userCase.hearingPanelPreference !== HearingPanelPreference.NO_PREFERENCE) {
    rows.push(
      addSummaryRow(
        translations.personalDetails.hearingPanelPreferenceReason,
        userCase.hearingPanelPreference === HearingPanelPreference.JUDGE
          ? userCase.hearingPanelPreferenceReasonJudge
          : userCase.hearingPanelPreferenceReasonPanel,
        createChangeAction(
          PageUrls.HEARING_PANEL_PREFERENCE + InterceptPaths.ANSWERS_CHANGE,
          translations.change,
          translations.personalDetails.hearingPanelPreferenceReason
        )
      )
    );
  }

  rows.push(
    addSummaryRow(
      translations.personalDetails.disability,
      userCase.reasonableAdjustments === YesOrNo.YES
        ? translations.personalDetails.yes + ', ' + userCase.reasonableAdjustmentsDetail
        : translations.personalDetails.no,
      createChangeAction(
        PageUrls.REASONABLE_ADJUSTMENTS + InterceptPaths.ANSWERS_CHANGE,
        translations.change,
        translations.personalDetails.disability
      )
    )
  );

  return rows;
};
