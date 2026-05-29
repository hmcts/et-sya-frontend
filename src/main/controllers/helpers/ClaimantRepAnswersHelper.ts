import {
  CaseWithId,
  EmailOrPost,
  EnglishOrWelsh,
  HearingPreference,
  Respondent,
  Sex,
  YesOrNo,
} from '../../definitions/case';
import { InterceptPaths, PageUrls } from '../../definitions/constants';
import { TypesOfClaim } from '../../definitions/definition';
import {
  SummaryListRow,
  addSummaryHtmlRow,
  addSummaryRow,
  createChangeAction,
} from '../../definitions/govuk/govukSummaryList';
import { AnyRecord } from '../../definitions/util-types';

import { answersAddressFormatter } from './PageContentHelpers';

const getContactPreference = (userCase: CaseWithId, translations: AnyRecord): string => {
  switch (userCase?.claimantContactPreference) {
    case EmailOrPost.EMAIL:
      return translations.personalDetails.email;
    case EmailOrPost.POST:
      return translations.personalDetails.post;
    default:
      return translations.notProvided;
  }
};

const getLanguagePreference = (answer: EnglishOrWelsh, translations: AnyRecord): string => {
  switch (answer) {
    case EnglishOrWelsh.WELSH:
      return translations.personalDetails.welsh;
    case EnglishOrWelsh.ENGLISH:
      return translations.personalDetails.english;
    default:
      return translations.notProvided;
  }
};

const getHearingPreferences = (userCase: CaseWithId, translations: AnyRecord): string => {
  const preferenceMap: Record<string, string> = {
    [HearingPreference.VIDEO]: translations.personalDetails.video,
    [HearingPreference.PHONE]: translations.personalDetails.phone,
    [HearingPreference.NEITHER]: translations.personalDetails.neither,
  };
  const preferences = (userCase?.hearingPreferences || [])
    .map(preference => preferenceMap[preference])
    .filter(Boolean)
    .join(', ');
  return preferences.length > 0 ? preferences : translations.notProvided;
};

const getReasonableAdjustments = (userCase: CaseWithId, translations: AnyRecord): string => {
  switch (userCase?.reasonableAdjustments) {
    case YesOrNo.YES:
      return translations.oesYesOrNo.yes + ', ' + userCase.reasonableAdjustmentsDetail;
    case YesOrNo.NO:
      return translations.oesYesOrNo.no;
    default:
      return translations.notProvided;
  }
};

const getSex = (userCase: CaseWithId, translations: AnyRecord): string => {
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

export const getRepresentativeDetails = (userCase: CaseWithId, translations: AnyRecord): SummaryListRow[] => {
  const rows: SummaryListRow[] = [];

  rows.push(
    addSummaryRow(
      translations.repDetails.typeOfRepresentative,
      userCase.representativeType ?? translations.notProvided,
      createChangeAction(
        PageUrls.REPRESENTATIVE_DETAILS + InterceptPaths.REP_ANSWERS_CHANGE,
        translations.change,
        translations.repDetails.typeOfRepresentative
      )
    ),
    addSummaryRow(
      translations.repDetails.organisationName,
      userCase.representativeOrgName ?? translations.notProvided,
      createChangeAction(
        PageUrls.REPRESENTATIVE_DETAILS + InterceptPaths.REP_ANSWERS_CHANGE,
        translations.change,
        translations.repDetails.organisationName
      )
    ),
    addSummaryRow(
      translations.repDetails.representativeName,
      userCase.representativeName ?? translations.notProvided,
      createChangeAction(
        PageUrls.REPRESENTATIVE_DETAILS + InterceptPaths.REP_ANSWERS_CHANGE,
        translations.change,
        translations.repDetails.representativeName
      )
    ),
    addSummaryRow(
      translations.repDetails.representativeAddress,
      answersAddressFormatter(
        userCase.repAddress1,
        userCase.repAddress2,
        userCase.repAddressTown,
        userCase.repAddressCountry,
        userCase.repAddressPostcode
      ),
      createChangeAction(
        PageUrls.REPRESENTATIVE_POSTCODE_ENTER + InterceptPaths.REP_ANSWERS_CHANGE,
        translations.change,
        translations.repDetails.representativeAddress
      )
    ),
    addSummaryRow(
      translations.repDetails.representativeTelephone,
      userCase.representativePhoneNumber ?? translations.notProvided,
      createChangeAction(
        PageUrls.REPRESENTATIVE_PHONE_NUMBER + InterceptPaths.REP_ANSWERS_CHANGE,
        translations.change,
        translations.repDetails.representativeTelephone
      )
    ),
    addSummaryRow(
      translations.repDetails.howToBeContacted,
      getContactPreference(userCase, translations),
      createChangeAction(
        PageUrls.REPRESENTATIVE_COMMS_PREFERENCE + InterceptPaths.REP_ANSWERS_CHANGE,
        translations.change,
        translations.repDetails.howToBeContacted
      )
    ),
    addSummaryRow(
      translations.repDetails.contactLanguage,
      getLanguagePreference(userCase?.claimantContactLanguagePreference, translations),
      createChangeAction(
        PageUrls.REPRESENTATIVE_COMMS_PREFERENCE + InterceptPaths.REP_ANSWERS_CHANGE,
        translations.change,
        translations.repDetails.contactLanguage
      )
    ),
    addSummaryRow(
      translations.repDetails.hearingLanguage,
      getLanguagePreference(userCase?.claimantHearingLanguagePreference, translations),
      createChangeAction(
        PageUrls.REPRESENTATIVE_COMMS_PREFERENCE + InterceptPaths.REP_ANSWERS_CHANGE,
        translations.change,
        translations.repDetails.hearingLanguage
      )
    ),
    addSummaryRow(
      translations.repDetails.hearingPreferences,
      getHearingPreferences(userCase, translations),
      createChangeAction(
        PageUrls.VIDEO_HEARINGS + InterceptPaths.REP_ANSWERS_CHANGE,
        translations.change,
        translations.repDetails.hearingPreferences
      )
    ),
    addSummaryRow(
      translations.repDetails.disability,
      getReasonableAdjustments(userCase, translations),
      createChangeAction(
        PageUrls.REASONABLE_ADJUSTMENTS + InterceptPaths.REP_ANSWERS_CHANGE,
        translations.change,
        translations.repDetails.disability
      )
    )
  );

  return rows;
};

export const getClaimantPersonalDetails = (userCase: CaseWithId, translations: AnyRecord): SummaryListRow[] => {
  return [
    addSummaryRow(
      translations.claimantDetails.firstName,
      userCase.firstName ?? translations.notProvided,
      createChangeAction(
        PageUrls.DOB_DETAILS + InterceptPaths.REP_ANSWERS_CHANGE,
        translations.change,
        translations.claimantDetails.firstName
      )
    ),
    addSummaryRow(
      translations.claimantDetails.lastName,
      userCase.lastName ?? translations.notProvided,
      createChangeAction(
        PageUrls.DOB_DETAILS + InterceptPaths.REP_ANSWERS_CHANGE,
        translations.change,
        translations.claimantDetails.lastName
      )
    ),
    addSummaryRow(
      translations.claimantDetails.dob,
      userCase.dobDate
        ? userCase.dobDate.day + '-' + userCase.dobDate.month + '-' + userCase.dobDate.year
        : translations.notProvided,
      createChangeAction(
        PageUrls.DOB_DETAILS + InterceptPaths.REP_ANSWERS_CHANGE,
        translations.change,
        translations.claimantDetails.dob
      )
    ),
    addSummaryRow(
      translations.claimantDetails.sex,
      getSex(userCase, translations),
      createChangeAction(
        PageUrls.SEX_AND_TITLE + InterceptPaths.REP_ANSWERS_CHANGE,
        translations.change,
        translations.claimantDetails.sex
      )
    ),
    addSummaryRow(
      translations.claimantDetails.preferredTitle,
      userCase.preferredTitle ?? translations.notProvided,
      createChangeAction(
        PageUrls.SEX_AND_TITLE + InterceptPaths.REP_ANSWERS_CHANGE,
        translations.change,
        translations.claimantDetails.preferredTitle
      )
    ),
    addSummaryRow(
      translations.claimantDetails.address,
      answersAddressFormatter(
        userCase.address1,
        userCase.address2,
        userCase.addressTown,
        userCase.addressCountry,
        userCase.addressPostcode
      ),
      createChangeAction(
        PageUrls.ADDRESS_POSTCODE_ENTER + InterceptPaths.REP_ANSWERS_CHANGE,
        translations.change,
        translations.claimantDetails.address
      )
    ),
    addSummaryRow(
      translations.claimantDetails.email,
      userCase.email ?? translations.notProvided,
      createChangeAction(
        PageUrls.UPDATE_PREFERENCES + InterceptPaths.REP_ANSWERS_CHANGE,
        translations.change,
        translations.claimantDetails.email
      )
    ),
  ];
};

export const getClaimantRespondentSection = (respondent: Respondent, translations: AnyRecord): SummaryListRow[] => [
  addSummaryRow(
    translations.respondentDetails.respondentName,
    respondent.respondentName ?? translations.notProvided,
    createChangeAction(
      PageUrls.CLAIMANT_RESPONDENT_NAME + InterceptPaths.REP_ANSWERS_CHANGE,
      translations.change,
      translations.respondentDetails.respondentName
    )
  ),
  addSummaryRow(
    translations.respondentDetails.respondentAddress,
    answersAddressFormatter(
      respondent.respondentAddress1,
      respondent.respondentAddress2,
      respondent.respondentAddressTown,
      respondent.respondentAddressCountry,
      respondent.respondentAddressPostcode
    ),
    createChangeAction(
      PageUrls.CLAIMANT_RESPONDENT_POSTCODE_ENTER + InterceptPaths.REP_ANSWERS_CHANGE,
      translations.change,
      translations.respondentDetails.respondentAddress
    )
  ),
  addSummaryRow(
    translations.respondentDetails.acasNumber,
    respondent.acasCertNum ?? translations.notProvided,
    createChangeAction(
      PageUrls.CLAIMANT_ACAS_CERT_NUM + InterceptPaths.REP_ANSWERS_CHANGE,
      translations.change,
      translations.respondentDetails.acasNumber
    )
  ),
];

export const getClaimantClaimDetails = (userCase: CaseWithId, translations: AnyRecord): SummaryListRow[] => {
  const rows: SummaryListRow[] = [];

  if (userCase.typeOfClaim?.includes(TypesOfClaim.DISCRIMINATION)) {
    rows.push(
      addSummaryHtmlRow(
        translations.claimDetails.claimTypeDiscrimination,
        userCase.claimTypeDiscrimination?.map(type => translations.discriminationClaims[type]).join('<br>') ??
          translations.notProvided,
        createChangeAction(
          PageUrls.CLAIMANT_CLAIM_TYPE_DISCRIMINATION + InterceptPaths.REP_ANSWERS_CHANGE,
          translations.change,
          translations.claimDetails.claimTypeDiscrimination
        )
      )
    );
  }

  if (userCase.typeOfClaim?.includes(TypesOfClaim.PAY_RELATED_CLAIM)) {
    rows.push(
      addSummaryHtmlRow(
        translations.claimDetails.claimTypePay,
        userCase.claimTypePay?.map(type => translations.payClaims[type]).join('<br>') ?? translations.notProvided,
        createChangeAction(
          PageUrls.CLAIMANT_CLAIM_TYPE_PAY + InterceptPaths.REP_ANSWERS_CHANGE,
          translations.change,
          translations.claimDetails.claimTypePay
        )
      )
    );
  }

  rows.push(
    addSummaryRow(
      translations.claimDetails.describeWhatHappened,
      userCase.claimSummaryText ?? translations.notProvided,
      createChangeAction(
        PageUrls.CLAIMANT_DESCRIBE_WHAT_HAPPENED + InterceptPaths.REP_ANSWERS_CHANGE,
        translations.change,
        translations.claimDetails.describeWhatHappened
      )
    ),
    addSummaryHtmlRow(
      translations.claimDetails.ifClaimSuccessful,
      userCase.tellUsWhatYouWant?.map(type => translations.tellUsWhatYouWant[type]).join('<br>') ??
        translations.notProvided,
      createChangeAction(
        PageUrls.CLAIMANT_TELL_US_WHAT_YOU_WANT + InterceptPaths.REP_ANSWERS_CHANGE,
        translations.change,
        translations.claimDetails.ifClaimSuccessful
      )
    ),
    addSummaryRow(
      translations.claimDetails.linkedCases,
      userCase.linkedCases === YesOrNo.YES
        ? translations.doYesOrNo.yes
        : userCase.linkedCases === YesOrNo.NO
        ? translations.doYesOrNo.no
        : translations.notProvided,
      createChangeAction(
        PageUrls.CLAIMANT_LINKED_CASES + InterceptPaths.REP_ANSWERS_CHANGE,
        translations.change,
        translations.claimDetails.linkedCases
      )
    )
  );

  return rows;
};
