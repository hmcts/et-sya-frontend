import i18next from 'i18next';

import { isDateEmpty } from '../components/form/dateValidators';
import { combineDocuments } from '../controllers/helpers/DocumentHelpers';
import { CreateCaseBody, RespondentRequestBody, UpdateCaseBody } from '../definitions/api/caseApiBody';
import { CaseApiDataResponse, DocumentApiModel, RespondentApiModel } from '../definitions/api/caseApiResponse';
import { DocumentUploadResponse } from '../definitions/api/documentApiResponse';
import { UserDetails } from '../definitions/appRequest';
import { CaseDataCacheKey, CaseDate, CaseWithId, Document, Respondent, ccdPreferredTitle } from '../definitions/case';
import {
  CcdDataModel,
  acceptanceDocTypes,
  et1DocTypes,
  et3FormDocTypes,
  rejectionDocTypes,
  responseAcceptedDocTypes,
  responseRejectedDocTypes,
} from '../definitions/constants';
import { DocumentDetail } from '../definitions/definition';

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
    ClaimantPcqId: fromApiCaseData.case_data?.ClaimantPcqId,
    ethosCaseReference: fromApiCaseData.case_data?.ethosCaseReference,
    managingOffice: fromApiCaseData.case_data?.managingOffice,
    tribunalCorrespondenceEmail: fromApiCaseData.case_data?.tribunalCorrespondenceEmail,
    tribunalCorrespondenceTelephone: fromApiCaseData.case_data?.tribunalCorrespondenceTelephone,
    state: fromApiCaseData.state,
    caseTypeId: fromApiCaseData.case_type_id,
    claimantRepresentedQuestion: fromApiCaseData.case_data?.claimantRepresentedQuestion,
    caseType: fromApiCaseData.case_data?.caseType,
    firstName: fromApiCaseData.case_data?.claimantIndType?.claimant_first_names,
    lastName: fromApiCaseData.case_data?.claimantIndType?.claimant_last_name,
    email: fromApiCaseData.case_data?.claimantType?.claimant_email_address,
    telNumber: fromApiCaseData.case_data?.claimantType?.claimant_phone_number,
    address1: fromApiCaseData.case_data?.claimantType?.claimant_addressUK?.AddressLine1,
    address2: fromApiCaseData.case_data?.claimantType?.claimant_addressUK?.AddressLine2,
    addressTown: fromApiCaseData.case_data?.claimantType?.claimant_addressUK?.PostTown,
    addressPostcode: fromApiCaseData.case_data?.claimantType?.claimant_addressUK?.PostCode,
    addressCountry: fromApiCaseData.case_data?.claimantType?.claimant_addressUK?.Country,
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
    claimTypeDiscrimination: fromApiCaseData.case_data?.claimantRequests?.discrimination_claims,
    claimTypePay: fromApiCaseData.case_data?.claimantRequests?.pay_claims,
    claimSummaryText: fromApiCaseData.case_data?.claimantRequests?.claim_description,
    claimSummaryFile: fromApiCaseData.case_data?.claimantRequests?.claim_description_document,
    tellUsWhatYouWant: fromApiCaseData.case_data?.claimantRequests?.claim_outcome,
    tribunalRecommendationRequest: fromApiCaseData.case_data?.claimantRequests?.claimant_tribunal_recommendation,
    whistleblowingClaim: fromApiCaseData.case_data?.claimantRequests?.whistleblowing,
    whistleblowingEntityName: fromApiCaseData.case_data?.claimantRequests?.whistleblowing_authority,
    compensationOutcome: fromApiCaseData.case_data?.claimantRequests?.claimant_compensation_text,
    compensationAmount: fromApiCaseData.case_data?.claimantRequests?.claimant_compensation_amount,
    employmentAndRespondentCheck: fromApiCaseData.case_data?.claimantTaskListChecks?.employmentAndRespondentCheck,
    claimDetailsCheck: fromApiCaseData.case_data?.claimantTaskListChecks?.claimDetailsCheck,
    createdDate: convertFromTimestampString(fromApiCaseData.created_date),
    lastModified: convertFromTimestampString(fromApiCaseData.last_modified),
    respondents: mapRespondents(fromApiCaseData.case_data?.respondentCollection),
    claimantWorkAddressQuestion: fromApiCaseData.case_data?.claimantWorkAddressQuestion,
    workAddress1: fromApiCaseData.case_data?.claimantWorkAddress?.claimant_work_address?.AddressLine1,
    workAddress2: fromApiCaseData.case_data?.claimantWorkAddress?.claimant_work_address?.AddressLine2,
    workAddressTown: fromApiCaseData.case_data?.claimantWorkAddress?.claimant_work_address?.PostTown,
    workAddressCountry: fromApiCaseData.case_data?.claimantWorkAddress?.claimant_work_address?.Country,
    workAddressPostcode: fromApiCaseData.case_data?.claimantWorkAddress?.claimant_work_address?.PostCode,
    et3IsThereAnEt3Response: fromApiCaseData?.case_data?.et3IsThereAnEt3Response,
    hubLinksStatuses: fromApiCaseData?.case_data?.hubLinksStatuses,
    et1FormDetails: setDocumentValues(fromApiCaseData?.case_data?.documentCollection, et1DocTypes),
    acknowledgementOfClaimLetterDetail: setDocumentValues(
      fromApiCaseData?.case_data?.servingDocumentCollection,
      acceptanceDocTypes
    ),
    rejectionOfClaimDocumentDetail: setDocumentValues(
      fromApiCaseData?.case_data?.documentCollection,
      rejectionDocTypes
    ),
    responseAcknowledgementDocumentDetail: setDocumentValues(
      fromApiCaseData?.case_data?.et3NotificationDocCollection,
      responseAcceptedDocTypes
    ),
    responseRejectionDocumentDetail: setDocumentValues(
      fromApiCaseData?.case_data?.et3NotificationDocCollection,
      responseRejectedDocTypes
    ),
    respondentResponseDeadline: convertClaimServedDateToRespondentDeadline(fromApiCaseData.case_data?.claimServedDate),
    responseEt3FormDocumentDetail: [
      ...combineDocuments(
        setDocumentValues(fromApiCaseData?.case_data?.et3NotificationDocCollection, responseAcceptedDocTypes),
        setDocumentValues(fromApiCaseData?.case_data?.et3NotificationDocCollection, responseRejectedDocTypes),
        setDocumentValues(fromApiCaseData?.case_data?.documentCollection, et3FormDocTypes),
        setDocumentValues(fromApiCaseData?.case_data?.et3ResponseContestClaimDocument, undefined, true)
      ),
    ],
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
      ClaimantPcqId: caseItem.ClaimantPcqId,
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
        claimant_phone_number: caseItem.telNumber,
        claimant_contact_preference: caseItem.claimantContactPreference,
        claimant_addressUK: {
          AddressLine1: caseItem.address1,
          AddressLine2: caseItem.address2,
          PostTown: caseItem.addressTown,
          PostCode: caseItem.addressPostcode,
          Country: caseItem.addressCountry,
        },
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
      claimantRequests: {
        discrimination_claims: caseItem.claimTypeDiscrimination,
        pay_claims: caseItem.claimTypePay,
        claim_description: caseItem.claimSummaryText,
        claim_outcome: caseItem.tellUsWhatYouWant,
        claimant_compensation_text: caseItem.compensationOutcome,
        claimant_compensation_amount: formatToCcdAcceptedNumber(caseItem.compensationAmount),
        claimant_tribunal_recommendation: caseItem.tribunalRecommendationRequest,
        whistleblowing: caseItem.whistleblowingClaim,
        whistleblowing_authority: caseItem.whistleblowingEntityName,
        claim_description_document: caseItem.claimSummaryFile,
      },
      claimantTaskListChecks: {
        personalDetailsCheck: caseItem.personalDetailsCheck,
        employmentAndRespondentCheck: caseItem.employmentAndRespondentCheck,
        claimDetailsCheck: caseItem.claimDetailsCheck,
      },
      claimantWorkAddress: {
        claimant_work_address: {
          AddressLine1: caseItem.workAddress1,
          AddressLine2: caseItem.workAddress2,
          PostTown: caseItem.workAddressTown,
          Country: caseItem.workAddressCountry,
          PostCode: caseItem.workAddressPostcode,
        },
      },
      respondentCollection: setRespondentApiFormat(caseItem.respondents),
      claimantWorkAddressQuestion: caseItem.claimantWorkAddressQuestion,
      hubLinksStatuses: caseItem.hubLinksStatuses,
    },
  };
}

export function fromApiFormatDocument(document: DocumentUploadResponse): Document {
  return {
    document_url: document.uri,
    document_filename: document.originalDocumentName,
    document_binary_url: document._links.binary.href,
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

export const convertClaimServedDateToRespondentDeadline = (date: string): string => {
  if (!date) {
    return;
  }
  const deadline = new Date(date);
  if (deadline instanceof Date && !isNaN(deadline.getTime())) {
    deadline.setDate(deadline.getDate() + 28);
    return new Intl.DateTimeFormat('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(new Date(deadline));
  }
};

export const mapRespondents = (respondents: RespondentApiModel[]): Respondent[] => {
  if (respondents === undefined) {
    return;
  }
  return respondents.map(respondent => {
    return {
      respondentName: respondent.value?.respondent_name,
      respondentAddress1: respondent.value.respondent_address?.AddressLine1,
      respondentAddress2: respondent.value.respondent_address?.AddressLine2,
      respondentAddressTown: respondent.value.respondent_address?.PostTown,
      respondentAddressCountry: respondent.value.respondent_address?.Country,
      respondentAddressPostcode: respondent.value.respondent_address?.PostCode,
      acasCert: respondent.value?.respondent_ACAS_question,
      acasCertNum: respondent.value?.respondent_ACAS,
      noAcasReason: respondent.value?.respondent_ACAS_no,
      ccdId: respondent?.id,
    };
  });
};

export const setRespondentApiFormat = (respondents: Respondent[]): RespondentRequestBody[] => {
  if (respondents === undefined) {
    return;
  }
  return respondents.map(respondent => {
    return {
      value: {
        respondent_name: respondent.respondentName,
        respondent_address: {
          AddressLine1: respondent.respondentAddress1,
          AddressLine2: respondent.respondentAddress2,
          PostTown: respondent.respondentAddressTown,
          Country: respondent.respondentAddressCountry,
          PostCode: respondent.respondentAddressPostcode,
        },
        respondent_ACAS_question: respondent.acasCert,
        respondent_ACAS: respondent.acasCertNum,
        respondent_ACAS_no: respondent.noAcasReason,
      },
      id: respondent.ccdId,
    };
  });
};

export const setDocumentValues = (
  documentCollection: DocumentApiModel[],
  docType?: string[],
  isEt3Supporting?: boolean
): DocumentDetail[] => {
  if (!documentCollection) {
    return;
  }

  const foundDocuments = documentCollection
    .filter(doc => !docType || docType.includes(doc.value.typeOfDocument))
    .map(doc => {
      return {
        id: getDocId(doc.value?.uploadedDocument?.document_url),
        description: !docType ? '' : doc.value?.shortDescription,
        type: isEt3Supporting ? 'et3Supporting' : doc.value.typeOfDocument,
      };
    });
  return foundDocuments.length ? foundDocuments : undefined;
};

export const getDocId = (url: string): string => {
  return url.substring(url.lastIndexOf('/') + 1, url.length);
};
