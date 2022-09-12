import i18next from 'i18next';

import { isDateEmpty } from '../components/form/dateValidators';
import { CreateCaseBody, RespondentRequestBody, UpdateCaseBody } from '../definitions/api/caseApiBody';
import { CaseApiDataResponse, RespondentApiModel, ServingDocument } from '../definitions/api/caseApiResponse';
import { UserDetails } from '../definitions/appRequest';
import { CaseDataCacheKey, CaseDate, CaseWithId, Respondent, ccdPreferredTitle } from '../definitions/case';
import { CcdDataModel } from '../definitions/constants';

export function toApiFormatCreate(
  userDataMap: Map<CaseDataCacheKey, string>,
  userDetails: UserDetails
): CreateCaseBody {
  return {
    post_code: userDataMap.get(CaseDataCacheKey.POSTCODE),
    case_data: {
      caseType: userDataMap.get(CaseDataCacheKey.CASE_TYPE),
      claimantRepresentedQuestion: userDataMap.get(CaseDataCacheKey.CLAIMANT_REPRESENTED),
      typeOfClaim: JSON.parse(userDataMap.get(CaseDataCacheKey.TYPES_OF_CLAIM)),
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
    ethosCaseReference: fromApiCaseData.case_data?.ethosCaseReference,
    state: fromApiCaseData.state,
    caseTypeId: fromApiCaseData.case_type_id,
    claimantRepresentedQuestion: fromApiCaseData.case_data?.claimantRepresentedQuestion,
    caseType: fromApiCaseData.case_data?.caseType,
    firstName: fromApiCaseData.case_data?.claimantIndType?.claimant_first_names,
    lastName: fromApiCaseData.case_data?.claimantIndType?.claimant_last_name,
    email: fromApiCaseData.case_data?.claimantType?.claimant_email_address,
    typeOfClaim: fromApiCaseData.case_data?.typeOfClaim,
    dobDate: parseDateFromString(fromApiCaseData.case_data?.claimantIndType?.claimant_date_of_birth),
    claimantSex: fromApiCaseData.case_data?.claimantIndType?.claimant_sex,
    preferredTitle: returnPreferredTitle(
      fromApiCaseData.case_data?.claimantIndType?.claimant_preferred_title,
      fromApiCaseData.case_data?.claimantIndType?.claimant_title_other
    ),
    jobTitle: fromApiCaseData.case_data?.claimantOtherType?.claimant_occupation,
    startDate: parseDateFromString(fromApiCaseData.case_data?.claimantOtherType?.claimant_employed_from),
    endDate: parseDateFromString(fromApiCaseData.case_data?.claimantOtherType?.claimant_employed_to),
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
    newJob: fromApiCaseData.case_data?.newEmploymentType?.new_job,
    newJobStartDate: parseDateFromString(fromApiCaseData.case_data?.newEmploymentType?.newly_employed_from),
    newJobPay: fromApiCaseData.case_data?.newEmploymentType?.new_pay_before_tax,
    newJobPayInterval: fromApiCaseData.case_data?.newEmploymentType?.new_job_pay_interval,
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
    createdDate: convertFromTimestampString(fromApiCaseData.created_date),
    lastModified: convertFromTimestampString(fromApiCaseData.last_modified),
    respondents: mapRespondents(fromApiCaseData.case_data?.respondentCollection),
    et3IsThereAnEt3Response: fromApiCaseData?.case_data?.et3IsThereAnEt3Response,
    hubLinks: fromApiCaseData?.case_data?.hubLinks,
    acknowledgementOfClaimLetterDetail: getAcknowledgementOfClaimLetterValues(
      fromApiCaseData?.case_data?.servingDocumentCollection
    ),
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
      typeOfClaim: caseItem.typeOfClaim,
      claimantIndType: {
        claimant_first_names: caseItem.firstName,
        claimant_last_name: caseItem.lastName,
        claimant_date_of_birth: formatDate(caseItem.dobDate),
        claimant_sex: caseItem.claimantSex,
        claimant_preferred_title: isValidPreferredTitle(caseItem.preferredTitle),
        claimant_title_other: isOtherTitle(caseItem.preferredTitle),
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
        claimant_pay_before_tax: formatToCcdAcceptedNumber(caseItem.payBeforeTax),
        claimant_pay_after_tax: formatToCcdAcceptedNumber(caseItem.payAfterTax),
        claimant_pay_cycle: caseItem.payInterval,
        claimant_pension_contribution: caseItem.claimantPensionContribution,
        claimant_pension_weekly_contribution: caseItem.claimantPensionWeeklyContribution,
        claimant_benefits: caseItem.employeeBenefits,
        claimant_benefits_detail: caseItem.benefitsCharCount,
        claimant_employed_notice_period: formatDate(caseItem.noticeEnds),
        claimant_employed_to: formatDate(caseItem.endDate),
      },
      newEmploymentType: {
        new_job: caseItem.newJob,
        newly_employed_from: formatDate(caseItem.newJobStartDate),
        new_pay_before_tax: formatToCcdAcceptedNumber(caseItem.newJobPay),
        new_job_pay_interval: caseItem.newJobPayInterval,
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
      respondentCollection: setRespondentApiFormat(caseItem.respondents),
      hubLinks: caseItem.hubLinks,
    },
  };
}

export const formatToCcdAcceptedNumber = (amount: number): number => {
  if (amount === undefined) {
    return;
  }
  return parseFloat(amount.toString().replace(/,/g, ''));
};

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
      day: date.substring(8, 10),
    };
  }
};

export const isValidPreferredTitle = (title: string): string => {
  if (title === undefined || title === '') {
    return undefined;
  }
  const titleValues = Object.values(ccdPreferredTitle);
  for (const titleValue of titleValues) {
    if (title.toLocaleLowerCase() === titleValue.toLocaleLowerCase()) {
      return titleValue;
    }
  }
  return ccdPreferredTitle.OTHER;
};

export const isOtherTitle = (title: string): string => {
  if (title === undefined || title === '') {
    return undefined;
  }
  const titleValues = Object.values(ccdPreferredTitle);
  for (const titleValue of titleValues) {
    if (title.toLocaleLowerCase() === titleValue.toLocaleLowerCase()) {
      return undefined;
    }
  }
  return title;
};

export const returnPreferredTitle = (preferredTitle?: string, otherTitle?: string): string => {
  if (otherTitle) {
    return otherTitle;
  } else {
    return preferredTitle;
  }
};

function convertFromTimestampString(responseDate: string) {
  const dateComponent = responseDate.substring(0, responseDate.indexOf('T'));
  return new Date(dateComponent).toLocaleDateString(i18next.language, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export const mapRespondents = (respondents: RespondentApiModel[]): Respondent[] => {
  if (respondents === undefined) {
    return;
  }
  const caseRespondents: Respondent[] = respondents.map(respondent => {
    return {
      respondentName: respondent.value.respondent_name,
    };
  });
  return caseRespondents;
};

export const setRespondentApiFormat = (respondents: Respondent[]): RespondentRequestBody[] => {
  if (respondents === undefined) {
    return;
  }
  const apiFormatRespondents = respondents.map(respondent => {
    return {
      value: {
        respondent_name: respondent.respondentName,
      },
    };
  });
  return apiFormatRespondents;
};

export const getAcknowledgementOfClaimLetterValues = (
  servingDocumentCollection: ServingDocument[]
): { id: string; description: string } => {
  if (!servingDocumentCollection) {
    return;
  }
  const foundDocument = servingDocumentCollection.find(doc => doc.value.typeOfDocument === '1.1');
  if (!foundDocument) {
    return;
  }
  const docUrl = foundDocument.value.uploadedDocument.document_url;
  return {
    id: docUrl.substring(docUrl.lastIndexOf('/') + 1, docUrl.length),
    description: foundDocument.value.shortDescription,
  };
};
