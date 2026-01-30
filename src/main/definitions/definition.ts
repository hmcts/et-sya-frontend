import { CaseWithId } from './case';
import { GenericTseApplicationType, TseAdminDecisionItem } from './complexTypes/genericTseApplicationTypeItem';
export const enum TypesOfClaim {
  BREACH_OF_CONTRACT = 'breachOfContract',
  DISCRIMINATION = 'discrimination',
  PAY_RELATED_CLAIM = 'payRelated',
  UNFAIR_DISMISSAL = 'unfairDismissal',
  WHISTLE_BLOWING = 'whistleBlowing',
  OTHER_TYPES = 'otherTypesOfClaims',
}

export const enum ClaimOutcomes {
  COMPENSATION = 'compensation',
  TRIBUNAL_RECOMMENDATION = 'tribunal',
  OLD_JOB = 'oldJob',
  ANOTHER_JOB = 'anotherJob',
}

export const enum CaseState {
  DRAFT = 'Draft',
  AWAITING_SUBMISSION_TO_HMCTS = 'AWAITING_SUBMISSION_TO_HMCTS',
  SUBMITTED = 'Submitted',
  ACCEPTED = 'Accepted',
}

export const enum HubCaseState {
  SUBMITTED = 'SUBMITTED',
  ACCEPTED = 'ACCEPTED',
  RESPONSE_RECEIVED = 'RESPONSE_RECEIVED',
  HEARING_DETAILS = 'HEARING_DETAILS',
  CLAIM_DECISION = 'CLAIM_DECISION',
}

export const enum ClaimTypeDiscrimination {
  AGE = 'Age',
  DISABILITY = 'Disability',
  ETHNICITY = 'Ethnicity',
  GENDER_REASSIGNMENT = 'Gender reassignment',
  MARRIAGE_OR_CIVIL_PARTNERSHIP = 'Marriage or civil partnership',
  PREGNANCY_OR_MATERNITY = 'Pregnancy or maternity',
  RACE = 'Race',
  RELIGION_OR_BELIEF = 'Religion or belief',
  SEX = 'Sex',
  SEXUAL_ORIENTATION = 'Sexual orientation',
}

export const enum ClaimTypePay {
  ARREARS = 'Arrears',
  HOLIDAY_PAY = 'Holiday pay',
  NOTICE_PAY = 'Notice pay',
  REDUNDANCY_PAY = 'Redundancy pay',
  OTHER_PAYMENTS = 'Other payments',
}

export const enum TellUsWhatYouWant {
  COMPENSATION_ONLY = 'compensation',
  TRIBUNAL_RECOMMENDATION = 'tribunal',
  OLD_JOB = 'oldJob',
  ANOTHER_JOB = 'anotherJob',
}

export const enum sectionStatus {
  notStarted = 'NOT STARTED',
  completed = 'COMPLETED',
  inProgress = 'IN PROGRESS',
  cannotStartYet = 'CANNOT START YET',
}

export interface ApplicationTableRecord {
  userCase: CaseWithId;
  respondents: string;
  completionStatus: string;
  url: string;
  deleteDraftUrl: string;
}

export interface DocumentDetail {
  id: string;
  description: string;
  size?: string;
  mimeType?: string;
  originalDocumentName?: string;
  createdOn?: string;
  type?: string;
}

export interface RespondentApplicationDetails {
  respondentApplicationHeader?: string;
  respondToRespondentAppRedirectUrl?: string;
  dueDate?: Date;
  dueDateDayMonthYear?: string;
  respondByDate?: string;
  applicant?: string;
  copyToOtherPartyYesOrNo?: string;
  applicationType?: string;
  number?: string;
  applicationState?: string;
  type?: string;
  date?: string;
}

export interface DecisionAndApplicationDetails {
  decisionOfApp?: TseAdminDecisionItem;
  id?: string;
  value?: GenericTseApplicationType;
  linkValue?: string;
  redirectUrl?: string;
  statusColor?: string;
  displayStatus?: string;
  applicant?: string;
  decisionBannerHeader?: string;
  applicationType?: string;
}
