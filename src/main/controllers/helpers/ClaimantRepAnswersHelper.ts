import {
  CaseWithId,
  EmailOrPost,
  EnglishOrWelsh,
  HearingPreference,
  Representative,
  Respondent,
  Sex,
  YesOrNo,
} from '../../definitions/case';
import { Et1Address } from '../../definitions/complexTypes/et1Address';
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

const getLinkedCasesAnswer = (linkedCases: YesOrNo, translations: AnyRecord): string => {
  if (linkedCases === YesOrNo.YES) {
    return translations.doYesOrNo.yes;
  }
  if (linkedCases === YesOrNo.NO) {
    return translations.doYesOrNo.no;
  }
  return translations.notProvided;
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

export const getClaimantRepAboutYouUrl = (caseId: string, languageParam: string): string =>
  PageUrls.CLAIMANT_REP_ABOUT_YOU.replace(':caseId', caseId) + languageParam;

export type ClaimantRepSessionFields = Pick<
  CaseWithId,
  | 'representativeName'
  | 'representativeOrgName'
  | 'claimantRepEmail'
  | 'repAddress1'
  | 'repAddress2'
  | 'repAddressTown'
  | 'repAddressCountry'
  | 'repAddressPostcode'
  | 'representativePhoneNumber'
>;

const hasValue = (value?: string): boolean => !!value?.trim();

export const preserveClaimantRepSessionFields = (userCase?: CaseWithId): ClaimantRepSessionFields | undefined => {
  if (!userCase?.id) {
    return undefined;
  }

  return {
    representativeName: userCase.representativeName,
    representativeOrgName: userCase.representativeOrgName,
    claimantRepEmail: userCase.claimantRepEmail,
    repAddress1: userCase.repAddress1,
    repAddress2: userCase.repAddress2,
    repAddressTown: userCase.repAddressTown,
    repAddressCountry: userCase.repAddressCountry,
    repAddressPostcode: userCase.repAddressPostcode,
    representativePhoneNumber: userCase.representativePhoneNumber,
  };
};

export const syncClaimantRepresentativeFromSessionFields = (userCase: CaseWithId): void => {
  if (!userCase) {
    return;
  }

  const claimantRepresentative = { ...userCase.claimantRepresentative };

  if (hasValue(userCase.representativeName)) {
    claimantRepresentative.name_of_representative = userCase.representativeName;
  }
  if (hasValue(userCase.representativeOrgName)) {
    claimantRepresentative.name_of_organisation = userCase.representativeOrgName;
  }
  if (hasValue(userCase.claimantRepEmail)) {
    claimantRepresentative.representative_email_address = userCase.claimantRepEmail;
  }

  if (Object.keys(claimantRepresentative).length) {
    userCase.claimantRepresentative = claimantRepresentative;
  }
};

export const applyClaimantRepAboutYouPendingDisplay = (
  userCase: CaseWithId,
  pending?: ClaimantRepSessionFields
): void => {
  applyPreservedClaimantRepSessionFields(userCase, pending);
};

export const applyPreservedClaimantRepSessionFields = (
  userCase: CaseWithId,
  preserved?: ClaimantRepSessionFields
): void => {
  if (!preserved) {
    return;
  }

  if (hasValue(preserved.representativeName)) {
    userCase.representativeName = preserved.representativeName;
  }
  if (hasValue(preserved.representativeOrgName)) {
    userCase.representativeOrgName = preserved.representativeOrgName;
  }
  if (hasValue(preserved.claimantRepEmail)) {
    userCase.claimantRepEmail = preserved.claimantRepEmail;
  }
  if (hasValue(preserved.repAddress1)) {
    userCase.repAddress1 = preserved.repAddress1;
  }
  if (hasValue(preserved.repAddress2)) {
    userCase.repAddress2 = preserved.repAddress2;
  }
  if (hasValue(preserved.repAddressTown)) {
    userCase.repAddressTown = preserved.repAddressTown;
  }
  if (hasValue(preserved.repAddressCountry)) {
    userCase.repAddressCountry = preserved.repAddressCountry;
  }
  if (hasValue(preserved.repAddressPostcode)) {
    userCase.repAddressPostcode = preserved.repAddressPostcode;
  }
  if (hasValue(preserved.representativePhoneNumber)) {
    userCase.representativePhoneNumber = preserved.representativePhoneNumber;
  }

  syncClaimantRepresentativeFromSessionFields(userCase);
};

const setRepAddressFromApi = (userCase: CaseWithId, address?: Et1Address): void => {
  if (!address) {
    return;
  }
  if (!hasValue(userCase.repAddress1) && address.AddressLine1) {
    userCase.repAddress1 = address.AddressLine1;
  }
  if (!hasValue(userCase.repAddress2) && address.AddressLine2) {
    userCase.repAddress2 = address.AddressLine2;
  }
  if (!hasValue(userCase.repAddressTown) && address.PostTown) {
    userCase.repAddressTown = address.PostTown;
  }
  if (!hasValue(userCase.repAddressCountry) && address.Country) {
    userCase.repAddressCountry = address.Country;
  }
  if (!hasValue(userCase.repAddressPostcode) && address.PostCode) {
    userCase.repAddressPostcode = address.PostCode;
  }
};

const getClaimantRepresentativeEntry = (userCase: CaseWithId): Representative | undefined =>
  userCase.representatives?.find(rep => !rep.respondentId && hasValue(rep.nameOfRepresentative)) ??
  userCase.representatives?.find(rep => !rep.respondentId) ??
  userCase.representatives?.[0];

const setRepDetailsFromRepresentativeEntry = (userCase: CaseWithId, representative?: Representative): void => {
  if (!representative) {
    return;
  }
  if (!hasValue(userCase.representativeName) && representative.nameOfRepresentative) {
    userCase.representativeName = representative.nameOfRepresentative;
  }
  if (!hasValue(userCase.representativeOrgName) && representative.nameOfOrganisation) {
    userCase.representativeOrgName = representative.nameOfOrganisation;
  }
  setRepAddressFromApi(userCase, representative.representativeAddress);
};

const formatRepAddress = (userCase: CaseWithId, translations: AnyRecord): string => {
  const formatted = answersAddressFormatter(
    userCase.repAddress1,
    userCase.repAddress2,
    userCase.repAddressTown,
    userCase.repAddressCountry,
    userCase.repAddressPostcode
  );
  return hasValue(formatted) ? formatted : translations.notProvided;
};

export const populateClaimantRepDetailsFromCase = (userCase: CaseWithId): void => {
  if (!userCase) {
    return;
  }

  const claimantRep = userCase.claimantRepresentative;
  if (!hasValue(userCase.representativeName) && claimantRep?.name_of_representative) {
    userCase.representativeName = claimantRep.name_of_representative;
  }
  if (!hasValue(userCase.representativeOrgName) && claimantRep?.name_of_organisation) {
    userCase.representativeOrgName = claimantRep.name_of_organisation;
  }

  if (!hasValue(userCase.representativePhoneNumber) && userCase.telNumber) {
    userCase.representativePhoneNumber = userCase.telNumber;
  }

  const claimantRepEntry = getClaimantRepresentativeEntry(userCase);
  setRepDetailsFromRepresentativeEntry(userCase, claimantRepEntry);

  if (!hasValue(userCase.claimantRepEmail) && claimantRep?.representative_email_address) {
    userCase.claimantRepEmail = claimantRep.representative_email_address;
  }
  if (!hasValue(userCase.claimantRepEmail) && claimantRepEntry?.representativeEmailAddress) {
    userCase.claimantRepEmail = claimantRepEntry.representativeEmailAddress;
  }

  syncClaimantRepresentativeFromSessionFields(userCase);
};

export const getClaimantRepAboutYouDetails = (userCase: CaseWithId, translations: AnyRecord): SummaryListRow[] => {
  populateClaimantRepDetailsFromCase(userCase);

  const changePath = InterceptPaths.REP_ABOUT_YOU_CHANGE;
  const caseId = userCase.id;

  const representativeName =
    userCase.representativeName ?? userCase.claimantRepresentative?.name_of_representative ?? translations.notProvided;
  const representativeOrgName =
    userCase.representativeOrgName ?? userCase.claimantRepresentative?.name_of_organisation ?? translations.notProvided;
  const representativeEmail =
    userCase.claimantRepEmail ?? userCase.claimantRepresentative?.representative_email_address;
  const emailValue = representativeEmail
    ? `<a class="govuk-link" href="mailto:${representativeEmail}">${representativeEmail}</a>`
    : translations.notProvided;
  const phoneValue = userCase.representativePhoneNumber ?? translations.notProvided;

  return [
    addSummaryRow(
      translations.aboutYouDetails.name,
      representativeName,
      createChangeAction(
        PageUrls.CLAIMANT_REP_EDIT_NAME.replace(':caseId', caseId) + changePath,
        translations.change,
        translations.aboutYouDetails.name
      )
    ),
    addSummaryRow(translations.aboutYouDetails.organisation, representativeOrgName),
    addSummaryRow(
      translations.aboutYouDetails.typeOfOrganisation,
      userCase.representativeType ?? translations.notProvided
    ),
    addSummaryRow(
      translations.aboutYouDetails.address,
      formatRepAddress(userCase, translations),
      createChangeAction(
        PageUrls.REPRESENTATIVE_POSTCODE_ENTER + changePath,
        translations.change,
        translations.aboutYouDetails.address
      )
    ),
    addSummaryHtmlRow(
      translations.aboutYouDetails.email,
      emailValue,
      createChangeAction(
        PageUrls.CLAIMANT_REP_EDIT_EMAIL.replace(':caseId', caseId) + changePath,
        translations.change,
        translations.aboutYouDetails.email
      )
    ),
    addSummaryRow(
      translations.aboutYouDetails.phone,
      phoneValue,
      createChangeAction(
        PageUrls.REPRESENTATIVE_PHONE_NUMBER + changePath,
        translations.change,
        translations.aboutYouDetails.phone
      )
    ),
  ];
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
      getLinkedCasesAnswer(userCase.linkedCases, translations),
      createChangeAction(
        PageUrls.CLAIMANT_LINKED_CASES + InterceptPaths.REP_ANSWERS_CHANGE,
        translations.change,
        translations.claimDetails.linkedCases
      )
    )
  );

  return rows;
};
