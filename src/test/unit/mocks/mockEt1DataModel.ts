import { EmailOrPost, HearingPreference, Sex, StillWorking, YesOrNo } from '../../../main/definitions/case';
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
  },
};

export const mockEt1DataModelUpdate = {
  case_id: '1234',
  case_type_id: 'ET_EnglandWales',
  case_data: {
    caseType: 'Single',
    typeOfClaim: ['discrimination', 'payRelated'],
    claimantRepresentedQuestion: 'Yes',
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
    claimantTaskListChecks: {
      personalDetailsCheck: YesOrNo.YES,
      employmentAndRespondentCheck: YesOrNo.YES,
      claimDetailsCheck: YesOrNo.YES,
    },
    respondentCollection: [
      {
        value: {
          respondent_name: 'Globo Corp',
        },
      },
    ],
    hubLinks: {
      contactTribunal: {
        status: HubLinkStatus.NOT_YET_AVAILABLE,
      },
      documents: {
        status: HubLinkStatus.NOT_YET_AVAILABLE,
      },
      et1ClaimForm: {
        status: HubLinkStatus.NOT_YET_AVAILABLE,
      },
      hearingDetails: {
        status: HubLinkStatus.NOT_YET_AVAILABLE,
      },
      personalDetails: {
        status: HubLinkStatus.NOT_YET_AVAILABLE,
      },
      requestsAndApplications: {
        status: HubLinkStatus.NOT_YET_AVAILABLE,
      },
      respondentApplications: {
        status: HubLinkStatus.NOT_YET_AVAILABLE,
      },
      respondentResponse: {
        status: HubLinkStatus.NOT_YET_AVAILABLE,
      },
      tribunalJudgements: {
        status: HubLinkStatus.NOT_YET_AVAILABLE,
      },
      tribunalOrders: {
        status: HubLinkStatus.NOT_YET_AVAILABLE,
      },
    },
  },
};
