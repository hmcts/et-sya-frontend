export const enum TypesOfClaim {
  BREACH_OF_CONTRACT = 'breachOfContract',
  DISCRIMINATION = 'discrimination',
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
  SUBMITTED = 'SUBMITTED',
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
  SEX = 'sex',
  SEXUAL_ORIENTATION = 'sexualOrientation',
}

export const enum ClaimTypePay {
  ARREARS = 'arrears',
  HOLIDAY_PAY = 'holidayPay',
  NOTICE_PAY = 'noticePay',
  REDUNDANCY_PAY = 'redundancyPay',
  OTHER_PAYMENTS = 'otherPayments',
}
