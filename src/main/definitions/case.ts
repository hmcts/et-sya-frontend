import { GenericTseApplicationTypeItem } from './complexTypes/genericTseApplicationTypeItem';
import { SendNotificationTypeItem } from './complexTypes/sendNotificationTypeItem';
import {
  CaseState,
  ClaimOutcomes,
  ClaimTypeDiscrimination,
  ClaimTypePay,
  DocumentDetail,
  TellUsWhatYouWant,
} from './definition';
import { HubLinksStatuses } from './hub';
import { UnknownRecord } from './util-types';

export enum Checkbox {
  Checked = 'checked',
  Unchecked = '',
}

export interface CaseDate {
  year: string;
  month: string;
  day: string;
}

export interface Respondent {
  respondentNumber?: number;
  respondentName?: string;
  respondentAddress1?: string;
  respondentAddress2?: string;
  respondentAddressTown?: string;
  respondentAddressCountry?: string;
  respondentAddressPostcode?: string;
  workAddress1?: string;
  workAddress2?: string;
  workAddressTown?: string;
  workAddressCountry?: string;
  workAddressPostcode?: string;
  acasCert?: YesOrNo;
  acasCertNum?: string;
  noAcasReason?: NoAcasNumberReason;
  ccdId?: string;
}

export interface RespondentApiModel {
  respondentNumber?: number;
  respondentName?: string;
  respondentAddress1?: string;
  respondentAddress2?: string;
  respondentAddressTown?: string;
  respondentAddressCountry?: string;
  respondentAddressPostcode?: string;
  workAddress1?: string;
  workAddress2?: string;
  workAddressTown?: string;
  workAddressCountry?: string;
  workAddressPostcode?: string;
  acasCert?: YesOrNo;
  acasCertNum?: string;
  noAcasReason?: NoAcasNumberReason;
}

export interface Case {
  createdDate: string;
  lastModified: string;
  ethosCaseReference?: string;
  feeGroupReference?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  dobDate?: CaseDate;
  address1?: string;
  address2?: string;
  addressTown?: string;
  addressCountry?: string;
  addressPostcode?: string;
  acasMultiple?: YesOrNo;
  claimantContactPreference?: EmailOrPost;
  claimantContactLanguagePreference?: EnglishOrWelsh;
  claimantHearingLanguagePreference?: EnglishOrWelsh;
  claimantRepresentedQuestion?: YesOrNo;
  caseType?: CaseType;
  caseTypeId?: CaseTypeId;
  telNumber?: string;
  validNoAcasReason?: YesOrNo;
  returnToExisting?: YesOrNo;
  jobTitle?: string;
  typeOfClaim?: string[];
  pastEmployer?: YesOrNo;
  noticeEnds?: CaseDate;
  noticePeriod?: YesOrNo;
  noticePeriodLength?: string;
  noticePeriodUnitPaid?: WeeksOrMonths;
  noticePeriodPaid?: string;
  noticePeriodAmountPaid?: string;
  noticePeriodUnit?: WeeksOrMonths;
  isStillWorking?: StillWorking;
  workAddress1?: string;
  workAddress2?: string;
  workAddressTown?: string;
  workAddressCountry?: string;
  workAddressPostcode?: string;
  startDate?: CaseDate;
  endDate?: CaseDate;
  avgWeeklyHrs?: number;
  payBeforeTax?: number;
  payAfterTax?: number;
  payInterval?: PayInterval;
  newJob?: YesOrNo;
  newJobStartDate?: CaseDate;
  newJobPay?: number;
  newJobPayInterval?: PayInterval;
  employeeBenefits?: YesOrNo;
  benefitsCharCount?: string;
  claimSummaryText?: string;
  claimSummaryFile?: Document;
  claimOutcome?: ClaimOutcomes[];
  compensationOutcome?: string;
  compensationAmount?: number;
  tribunalRecommendationOutcome?: string;
  claimTypeDiscrimination?: ClaimTypeDiscrimination[];
  claimTypePay?: ClaimTypePay[];
  tellUsWhatYouWant?: TellUsWhatYouWant[];
  tribunalRecommendationRequest?: string;
  whistleblowingClaim?: YesOrNo;
  whistleblowingEntityName?: string;
  personalDetailsCheck?: YesOrNo;
  claimDetailsCheck?: YesOrNo;
  claimantWorkAddressQuestion?: YesOrNo;
  respondents?: Respondent[];
  employmentAndRespondentCheck?: YesOrNo;
  ClaimantPcqId?: string;
  claimantPensionContribution?: YesOrNoOrNotSure;
  claimantPensionWeeklyContribution?: number;
  reasonableAdjustments?: YesOrNo;
  reasonableAdjustmentsDetail?: string;
  hearingPreferences?: HearingPreference[];
  hearingAssistance?: string;
  workPostcode?: string;
  respondentName?: string;
  claimantSex?: Sex;
  preferredTitle?: string;
  respondentAddress1?: string;
  respondentAddress2?: string;
  respondentAddressTown?: string;
  respondentAddressCountry?: string;
  respondentAddressPostcode?: string;
  acasCert?: YesOrNo;
  acasCertNum?: string;
  noAcasReason?: NoAcasNumberReason;
  managingOffice?: string;
  tribunalCorrespondenceEmail?: string;
  tribunalCorrespondenceTelephone?: string;
  et1SubmittedForm?: DocumentDetail;
  submittedDate?: CaseDate;
  et3ResponseReceived?: boolean;
  hubLinksStatuses?: HubLinksStatuses;
  allEt1DocumentDetails?: DocumentDetail[];
  acknowledgementOfClaimLetterDetail?: DocumentDetail[];
  rejectionOfClaimDocumentDetail?: DocumentDetail[];
  responseAcknowledgementDocumentDetail?: DocumentDetail[];
  responseRejectionDocumentDetail?: DocumentDetail[];
  respondentResponseDeadline?: string;
  responseEt3FormDocumentDetail?: DocumentDetail[];
  otherClaim?: string;
  typeOfClaimString?: string;
  // TSE
  contactApplicationType?: string;
  contactApplicationText?: string;
  contactApplicationFile?: Document;
  copyToOtherPartyYesOrNo?: YesOrNo;
  copyToOtherPartyText?: string;
  genericTseApplicationCollection?: GenericTseApplicationTypeItem[];
  selectedGenericTseApplication?: GenericTseApplicationTypeItem;
  responseText?: string;
  hasSupportingMaterial?: YesOrNo;
  supportingMaterialFile?: Document;
  sendNotificationCollection?: SendNotificationTypeItem[];

  //Created for saving select order or request value;
  selectedRequestOrOrder?: SendNotificationTypeItem;

  /* Used to save the Rule92 state to render the "Completed" page under various conditions, after submitting the CYA,
  all temporary fields such as copyToOtherPartyYesOrNo, contactApplicationText, etc. are cleared.*/
  rule92state?: boolean;
}

export const enum StillWorking {
  WORKING = 'Working',
  NOTICE = 'Notice',
  NO_LONGER_WORKING = 'No longer working',
}

export const enum NoAcasNumberReason {
  ANOTHER = 'Another person',
  NO_POWER = 'No Power',
  EMPLOYER = 'Employer already in touch',
  UNFAIR_DISMISSAL = 'Unfair Dismissal',
}

export interface CaseWithId extends Case {
  id: string;
  state: CaseState;
}

export const enum YesOrNo {
  YES = 'Yes',
  NO = 'No',
}

export const enum YesOrNoOrPreferNot {
  YES = 'Yes',
  NO = 'No',
  PREFER_NOT = 'Prefer not to say',
}

export const enum YesOrNoOrNotSure {
  YES = 'Yes',
  NO = 'No',
  NOT_SURE = 'Not Sure',
}

export const enum CaseType {
  SINGLE = 'Single',
  MULTIPLE = 'Multiple',
}

export const enum CaseTypeId {
  ENGLAND_WALES = 'ET_EnglandWales',
  SCOTLAND = 'ET_Scotland',
}

export const enum WeeksOrMonths {
  WEEKS = 'Weeks',
  MONTHS = 'Months',
}

export const enum EmailOrPost {
  EMAIL = 'Email',
  POST = 'Post',
}

export const enum EnglishOrWelsh {
  ENGLISH = 'English',
  WELSH = 'Welsh',
}

export const enum Sex {
  MALE = 'Male',
  FEMALE = 'Female',
  PREFER_NOT_TO_SAY = 'Prefer not to say',
}

export enum ccdPreferredTitle {
  MR = 'Mr',
  MRS = 'Mrs',
  MISS = 'Miss',
  MS = 'Ms',
  OTHER = 'Other',
}

export const enum PayInterval {
  WEEKLY = 'Weeks',
  MONTHLY = 'Months',
  ANNUAL = 'Annual',
}

export type DateParser = (property: string, body: UnknownRecord) => CaseDate;

export const enum CaseDataCacheKey {
  POSTCODE = 'workPostcode',
  CLAIMANT_REPRESENTED = 'claimantRepresentedQuestion',
  CASE_TYPE = 'caseType',
  TYPES_OF_CLAIM = 'typeOfClaim',
  OTHER_CLAIM_TYPE = 'otherClaimType',
  ACAS_MULTIPLE = 'acasMultiple',
  VALID_NO_ACAS_REASON = 'validNoAcasReason',
}

export const enum HearingPreference {
  VIDEO = 'Video',
  PHONE = 'Phone',
  NEITHER = 'Neither',
}

export interface Document {
  document_url: string;
  document_filename: string;
  document_binary_url: string;
  document_size?: number;
  document_mime_type?: string;
}
