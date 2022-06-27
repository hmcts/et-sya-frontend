import { YesOrNo } from '../../../main/definitions/case';

export const mockEt1DataModel = {
  post_code: 'SW1A 1AA',
  case_data: {
    caseType: 'Single',
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
    claimantRepresentedQuestion: 'Yes',
    caseSource: 'ET1 Online',
    claimantIndType: {
      claimant_first_names: 'John',
      claimant_last_name: 'Doe',
      claimant_date_of_birth: '2010-05-11',
    },
    claimantType: {
      claimant_email_address: 'tester@test.com',
    },
    claimantHearingPreference: {
      reasonable_adjustments: YesOrNo.YES,
      reasonable_adjustments_detail: 'Adjustments detail test',
    },
    claimantTaskListChecks: {
      personalDetailsCheck: YesOrNo.YES,
    },
  },
};
