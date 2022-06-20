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
    dobDate: formatDoBString(fromApiCaseData.case_data?.claimantIndType?.claimant_date_of_birth),
    jobTitle: fromApiCaseData.case_data?.claimantOtherType?.claimant_occupation,
    startDate: formatDoBString(fromApiCaseData.case_data?.claimantOtherType?.claimant_employed_from),
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
        claimant_date_of_birth: formatDoB(caseItem.dobDate),
      },
      claimantType: {
        claimant_email_address: caseItem.email,
      },
      claimantOtherType: {
        claimant_occupation: caseItem.jobTitle,
        claimant_employed_from: formatDoB(caseItem.startDate),
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
      },
    },
  };
}

function formatDoB(dobDate: CaseDate) {
  return dobDate ? `${dobDate.year}-${dobDate.month}-${dobDate.day}` : null;
}

function formatDoBString(dobDate: string): CaseDate {
  if (dobDate) {
    const year = dobDate.substring(0, 4);
    const month = dobDate.substring(5, 7);
    const day = dobDate.substring(8);

    return {
      year,
      month,
      day,
    };
  }
}
