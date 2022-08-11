import { isDateEmpty } from '../components/form/dateValidators';
import { CreateCaseBody, UpdateCaseBody } from '../definitions/api/caseApiBody';
import { CaseApiDataResponse } from '../definitions/api/caseApiResponse';
import { UserDetails } from '../definitions/appRequest';
import { CaseDataCacheKey, CaseDate, CaseWithId } from '../definitions/case';
import { CcdDataModel } from '../definitions/constants';

export function toApiFormatCreate(
  userDataMap: Map<CaseDataCacheKey, string>,
  userDetails: UserDetails
): CreateCaseBody {
  return {
    post_code: 'SW1A 1AA', // TODO Replace with value from new postcode triage page
    case_data: {
      caseType: userDataMap.get(CaseDataCacheKey.CASE_TYPE),
      claimantRepresentedQuestion: userDataMap.get(CaseDataCacheKey.CLAIMANT_REPRESENTED),
      caseSource: CcdDataModel.CASE_SOURCE,
      claimantIndType: {
        claimant_first_names: userDetails.givenName,
        claimant_last_name: userDetails.familyName,
      },
      claimantType: {
        claimant_email_address: userDetails.email,
      },
    },
  };
}

export function fromApiFormat(fromApiCaseData: CaseApiDataResponse): CaseWithId {
  return {
    id: fromApiCaseData.id,
    state: fromApiCaseData.state,
    caseTypeId: fromApiCaseData.case_type_id,
    claimantRepresentedQuestion: fromApiCaseData.case_data?.claimantRepresentedQuestion,
    caseType: fromApiCaseData.case_data?.caseType,
    firstName: fromApiCaseData.case_data?.claimantIndType?.claimant_first_names,
    lastName: fromApiCaseData.case_data?.claimantIndType?.claimant_last_name,
    email: fromApiCaseData.case_data?.claimantType?.claimant_email_address,
    dobDate: parseDateFromString(fromApiCaseData.case_data?.claimantIndType?.claimant_date_of_birth),
    claimantSex: fromApiCaseData.case_data?.claimantIndType?.claimant_sex,
    claimantGenderIdentitySame: fromApiCaseData.case_data?.claimantIndType?.claimant_gender_identity_same,
    claimantGenderIdentity: fromApiCaseData.case_data?.claimantIndType?.claimant_gender_identity,
    preferredTitle: fromApiCaseData.case_data?.claimantIndType?.claimant_preferred_title,
    otherTitlePreference: fromApiCaseData.case_data?.claimantIndType?.claimant_title_other,
    jobTitle: fromApiCaseData.case_data?.claimantOtherType?.claimant_occupation,
    startDate: parseDateFromString(fromApiCaseData.case_data?.claimantOtherType?.claimant_employed_from),
    noticePeriod: fromApiCaseData.case_data?.claimantOtherType?.claimant_notice_period,
    noticePeriodUnit: fromApiCaseData.case_data?.claimantOtherType?.claimant_notice_period_unit,
    noticePeriodLength: fromApiCaseData.case_data?.claimantOtherType?.claimant_notice_period_duration,
    avgWeeklyHrs: fromApiCaseData.case_data?.claimantOtherType?.claimant_average_weekly_hours,
    payBeforeTax: fromApiCaseData.case_data?.claimantOtherType?.claimant_pay_before_tax,
    payAfterTax: fromApiCaseData.case_data?.claimantOtherType?.claimant_pay_after_tax,
    payInterval: fromApiCaseData.case_data?.claimantOtherType?.claimant_pay_cycle,
    claimantPensionContribution: fromApiCaseData.case_data?.claimantOtherType?.claimant_pension_contribution,
    claimantPensionWeeklyContribution:
      fromApiCaseData.case_data?.claimantOtherType?.claimant_pension_weekly_contribution,
    employeeBenefits: fromApiCaseData.case_data?.claimantOtherType?.claimant_benefits,
    benefitsCharCount: fromApiCaseData.case_data?.claimantOtherType?.claimant_benefits_detail,
    pastEmployer: fromApiCaseData.case_data?.claimantOtherType?.pastEmployer,
    isStillWorking: fromApiCaseData.case_data?.claimantOtherType?.stillWorking,
    reasonableAdjustments: fromApiCaseData.case_data?.claimantHearingPreference?.reasonable_adjustments,
    reasonableAdjustmentsDetail: fromApiCaseData.case_data?.claimantHearingPreference?.reasonable_adjustments_detail,
    personalDetailsCheck: fromApiCaseData.case_data?.claimantTaskListChecks?.personalDetailsCheck,
    noticeEnds: parseDateFromString(fromApiCaseData.case_data?.claimantOtherType?.claimant_employed_notice_period),
    hearingPreferences: fromApiCaseData.case_data?.claimantHearingPreference?.hearing_preferences,
    hearingAssistance: fromApiCaseData.case_data?.claimantHearingPreference?.hearing_assistance,
    claimantContactPreference: fromApiCaseData.case_data?.claimantType?.claimant_contact_preference,
    employmentAndRespondentCheck: fromApiCaseData.case_data?.claimantTaskListChecks?.employmentAndRespondentCheck,
    claimDetailsCheck: fromApiCaseData.case_data?.claimantTaskListChecks?.claimDetailsCheck,
  };
}

export function toApiFormat(caseItem: CaseWithId): UpdateCaseBody {
  return {
    case_id: caseItem.id,
    case_type_id: caseItem.caseTypeId,
    case_data: {
      caseType: caseItem.caseType,
      claimantRepresentedQuestion: caseItem.claimantRepresentedQuestion,
      caseSource: CcdDataModel.CASE_SOURCE,
      claimantIndType: {
        claimant_first_names: caseItem.firstName,
        claimant_last_name: caseItem.lastName,
        claimant_date_of_birth: formatDate(caseItem.dobDate),
        claimant_sex: caseItem.claimantSex,
        claimant_gender_identity_same: caseItem.claimantGenderIdentitySame,
        claimant_gender_identity: caseItem.claimantGenderIdentity,
        claimant_preferred_title: caseItem.preferredTitle,
        claimant_title_other: caseItem.otherTitlePreference,
      },
      claimantType: {
        claimant_email_address: caseItem.email,
        claimant_contact_preference: caseItem.claimantContactPreference,
      },
      claimantOtherType: {
        pastEmployer: caseItem.pastEmployer,
        stillWorking: caseItem.isStillWorking,
        claimant_occupation: caseItem.jobTitle,
        claimant_employed_from: formatDate(caseItem.startDate),
        claimant_notice_period: caseItem.noticePeriod,
        claimant_notice_period_unit: caseItem.noticePeriodUnit,
        claimant_notice_period_duration: caseItem.noticePeriodLength,
        claimant_average_weekly_hours: caseItem.avgWeeklyHrs,
        claimant_pay_before_tax: caseItem.payBeforeTax,
        claimant_pay_after_tax: caseItem.payAfterTax,
        claimant_pay_cycle: caseItem.payInterval,
        claimant_pension_contribution: caseItem.claimantPensionContribution,
        claimant_pension_weekly_contribution: caseItem.claimantPensionWeeklyContribution,
        claimant_benefits: caseItem.employeeBenefits,
        claimant_benefits_detail: caseItem.benefitsCharCount,
        claimant_employed_notice_period: formatDate(caseItem.noticeEnds),
      },
      claimantHearingPreference: {
        reasonable_adjustments: caseItem.reasonableAdjustments,
        reasonable_adjustments_detail: caseItem.reasonableAdjustmentsDetail,
        hearing_preferences: caseItem.hearingPreferences,
        hearing_assistance: caseItem.hearingAssistance,
      },
      claimantTaskListChecks: {
        personalDetailsCheck: caseItem.personalDetailsCheck,
        employmentAndRespondentCheck: caseItem.employmentAndRespondentCheck,
        claimDetailsCheck: caseItem.claimDetailsCheck,
      },
    },
  };
}

export const formatDate = (date: CaseDate): string => {
  if (!date || isDateEmpty(date)) {
    return null;
  }

  return `${date.year}-${date.month.padStart(2, '0')}-${date.day.padStart(2, '0')}`;
};

export const parseDateFromString = (date: string): CaseDate => {
  if (date) {
    return {
      year: date.substring(0, 4),
      month: date.substring(5, 7),
      day: date.substring(8),
    };
  }
};
