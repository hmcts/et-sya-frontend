import { CaseWithId } from './case';
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
  TRIBUNAL_RECOMMENDATION = 'tribunalRecommendation',
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
  AGE = 'age',
  DISABILITY = 'disability',
  ETHNICITY = 'ethnicity',
  GENDER_REASSIGNMENT = 'genderReassignment',
  MARRIAGE_OR_CIVIL_PARTNERSHIP = 'marriageOrCivilPartnership',
  PREGNANCY_OR_MATERNITY = 'pregnancyOrMaternity',
  RACE = 'race',
  RELIGION_OR_BELIEF = 'religionOrBelief',
  SEX = 'Sex (Including equal pay)',
  SEXUAL_ORIENTATION = 'sexualOrientation',
}

export const enum ClaimTypePay {
  ARREARS = 'arrears',
  HOLIDAY_PAY = 'holidayPay',
  NOTICE_PAY = 'noticePay',
  REDUNDANCY_PAY = 'redundancyPay',
  OTHER_PAYMENTS = 'otherPayments',
}

export const enum TellUsWhatYouWant {
  COMPENSATION_ONLY = 'compensationOnly',
  TRIBUNAL_RECOMMENDATION = 'tribunalRecommendation',
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
}
