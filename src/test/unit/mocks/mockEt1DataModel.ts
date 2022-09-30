import {
  EmailOrPost,
  HearingPreference,
  NoAcasNumberReason,
  Sex,
  StillWorking,
  YesOrNo,
} from '../../../main/definitions/case';
import { ClaimTypeDiscrimination, ClaimTypePay, TellUsWhatYouWant } from '../../../main/definitions/definition';
import { HubLinkStatus } from '../../../main/definitions/hub';

export const mockEt1DataModel = {
  post_code: 'SW1A 1AA',
  case_data: {
    caseType: 'Single',
    typeOfClaim: ['discrimination', 'payRelated'],
    claimantRepresentedQuestion: 'Yes',
    caseSource: 'ET1 Online',
    claimantIndType: {
      claimant_first_names: 'Bobby',
      claimant_last_name: 'Ryan',
    },
    claimantType: {
      claimant_email_address: 'bobby@gmail.com',
    },
    claimantRequests: {
      other_claim: 'other claim description',
    },
  },
};

export const mockEt1DataModelUpdate = {
  case_id: '1234',
  case_type_id: 'ET_EnglandWales',
  case_data: {
    caseType: 'Single',
    typeOfClaim: ['discrimination', 'payRelated'],
    ClaimantPcqId: '1234',
    claimantRepresentedQuestion: 'Yes',
    claimantWorkAddressQuestion: 'Yes',
    caseSource: 'ET1 Online',
    claimantIndType: {
      claimant_first_names: 'John',
      claimant_last_name: 'Doe',
      claimant_date_of_birth: '2010-05-11',
      claimant_sex: Sex.MALE,
      claimant_preferred_title: 'Mr',
    },
    claimantType: {
      claimant_email_address: 'tester@test.com',
      claimant_contact_preference: EmailOrPost.EMAIL,
      claimant_phone_number: '075',
      claimant_addressUK: {
        AddressLine1: 'address 1',
        AddressLine2: 'address 2',
        PostTown: 'Test',
        PostCode: 'TEST',
        Country: 'United',
      },
    },
    claimantOtherType: {
      pastEmployer: YesOrNo.YES,
      stillWorking: StillWorking.WORKING,
      claimant_occupation: 'Developer',
      claimant_employed_from: '2010-05-11',
      claimant_notice_period: 'Yes',
      claimant_notice_period_unit: 'Weeks',
      claimant_notice_period_duration: '1',
      claimant_average_weekly_hours: 5,
      claimant_pay_before_tax: 123,
      claimant_pay_after_tax: 120,
      claimant_pay_cycle: 'Weeks',
      claimant_pension_contribution: 'Yes',
      claimant_pension_weekly_contribution: 15,
      claimant_benefits: 'Yes',
      claimant_benefits_detail: 'Some benefits',
      claimant_employed_notice_period: '2022-08-11',
      claimant_employed_to: '2017-05-11',
    },
    newEmploymentType: {
      new_job: 'Yes',
      new_pay_before_tax: 4000,
      new_job_pay_interval: 'Months',
      newly_employed_from: '2022-08-11',
    },
    claimantHearingPreference: {
      reasonable_adjustments: YesOrNo.YES,
      reasonable_adjustments_detail: 'Adjustments detail test',
      hearing_preferences: [HearingPreference.PHONE],
      hearing_assistance: 'Hearing assistance test',
    },
    claimantRequests: {
      discrimination_claims: [ClaimTypeDiscrimination.RACE],
      pay_claims: [ClaimTypePay.REDUNDANCY_PAY],
      claim_description: 'Claim summary text',
      claim_outcome: [TellUsWhatYouWant.COMPENSATION_ONLY],
      claimant_compensation_text: 'Compensation outcome',
      claimant_compensation_amount: 123,
      claimant_tribunal_recommendation: 'Tribunal recommendation request',
      whistleblowing: YesOrNo.YES,
      whistleblowing_authority: 'Whistleblowing entity name',
      claim_description_document: {
        document_url: 'http://dm-store:8080/documents/a0c113ec-eede-472a-a59c-f2614b48177c',
        document_filename: 'document.pdf',
        document_binary_url: 'http://dm-store:8080/documents/a0c113ec-eede-472a-a59c-f2614b48177c/binary',
      },
      other_claim: 'other claim description',
    },
    claimantTaskListChecks: {
      personalDetailsCheck: YesOrNo.YES,
      employmentAndRespondentCheck: YesOrNo.YES,
      claimDetailsCheck: YesOrNo.YES,
    },
    claimantWorkAddress: {
      claimant_work_address: {
        AddressLine1: 'Respondent Address',
        AddressLine2: 'That Road',
        PostTown: 'Anytown',
        Country: 'England',
        PostCode: 'SW1H 9AQ',
      },
    },
    respondentCollection: [
      {
        value: {
          respondent_name: 'Globo Corp',
          respondent_ACAS_question: YesOrNo.YES,
          respondent_ACAS: 'R111111111111',
          respondent_ACAS_no: NoAcasNumberReason.ANOTHER,
          respondent_address: {
            AddressLine1: 'Respondent Address',
            AddressLine2: 'That Road',
            PostTown: 'Anytown',
            Country: 'England',
            PostCode: 'SW1H 9AQ',
          },
        },
        id: '3453xaa',
      },
    ],
  },
};

export const mockEt1DataModelSubmittedUpdate = {
  case_id: '1234',
  case_data: {
    hubLinksStatuses: {
      contactTribunal: HubLinkStatus.NOT_YET_AVAILABLE,
      documents: HubLinkStatus.NOT_YET_AVAILABLE,
      et1ClaimForm: HubLinkStatus.NOT_YET_AVAILABLE,
      hearingDetails: HubLinkStatus.NOT_YET_AVAILABLE,
      personalDetails: HubLinkStatus.NOT_YET_AVAILABLE,
      requestsAndApplications: HubLinkStatus.NOT_YET_AVAILABLE,
      respondentApplications: HubLinkStatus.NOT_YET_AVAILABLE,
      respondentResponse: HubLinkStatus.NOT_YET_AVAILABLE,
      tribunalJudgements: HubLinkStatus.NOT_YET_AVAILABLE,
      tribunalOrders: HubLinkStatus.NOT_YET_AVAILABLE,
    },
  },
};
