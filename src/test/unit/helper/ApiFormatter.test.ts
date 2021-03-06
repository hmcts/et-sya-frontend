import { CaseApiDataResponse } from '../../../main/definitions/api/caseApiResponse';
import { UserDetails } from '../../../main/definitions/appRequest';
import {
  CaseDataCacheKey,
  CaseType,
  CaseTypeId,
  CaseWithId,
  PayInterval,
  StillWorking,
  WeeksOrMonths,
  YesOrNo,
  YesOrNoOrNotSure,
} from '../../../main/definitions/case';
import { CaseState } from '../../../main/definitions/definition';
import { fromApiFormat, toApiFormat, toApiFormatCreate } from '../../../main/helper/ApiFormatter';
import { mockEt1DataModel, mockEt1DataModelUpdate } from '../mocks/mockEt1DataModel';

describe('Should return data in api format', () => {
  it('should transform triage and Idam credentials to api format', () => {
    const userDataMap: Map<CaseDataCacheKey, string> = new Map<CaseDataCacheKey, string>([
      [CaseDataCacheKey.CLAIMANT_REPRESENTED, 'Yes'],
      [CaseDataCacheKey.CASE_TYPE, 'Single'],
      [CaseDataCacheKey.TYPES_OF_CLAIM, JSON.stringify('discrimination')],
    ]);

    const mockUserDetails: UserDetails = {
      id: '1234',
      givenName: 'Bobby',
      familyName: 'Ryan',
      email: 'bobby@gmail.com',
      accessToken: 'xxxx',
      isCitizen: true,
    };
    const apiData = toApiFormatCreate(userDataMap, mockUserDetails);
    expect(apiData).toEqual(mockEt1DataModel);
  });

  it('should transform case date to api format', () => {
    const caseItem: CaseWithId = {
      id: '1234',
      caseTypeId: CaseTypeId.ENGLAND_WALES,
      caseType: CaseType.SINGLE,
      claimantRepresentedQuestion: YesOrNo.YES,
      state: CaseState.AWAITING_SUBMISSION_TO_HMCTS,
      dobDate: {
        year: '2010',
        month: '05',
        day: '11',
      },
      email: 'tester@test.com',
      firstName: 'John',
      lastName: 'Doe',
      avgWeeklyHrs: 5,
      claimantPensionContribution: YesOrNoOrNotSure.YES,
      claimantPensionWeeklyContribution: 15,
      employeeBenefits: YesOrNo.YES,
      benefitsCharCount: 'Some benefits',
      jobTitle: 'Developer',
      noticePeriod: YesOrNo.YES,
      noticePeriodLength: '1',
      noticePeriodUnit: WeeksOrMonths.WEEKS,
      payBeforeTax: 123,
      payAfterTax: 120,
      payInterval: PayInterval.WEEKLY,
      startDate: { year: '2010', month: '05', day: '11' },
      pastEmployer: YesOrNo.YES,
      isStillWorking: StillWorking.WORKING,
      personalDetailsCheck: YesOrNo.YES,
      reasonableAdjustments: YesOrNo.YES,
      reasonableAdjustmentsDetail: 'Adjustments detail test',
    };
    const apiData = toApiFormat(caseItem);
    expect(apiData).toEqual(mockEt1DataModelUpdate);
  });
});

describe('Format Case Data to Frontend Model', () => {
  it('should format Case Api Response`', () => {
    const mockedApiData: CaseApiDataResponse = {
      id: '1234',
      case_type_id: CaseTypeId.ENGLAND_WALES,
      state: CaseState.AWAITING_SUBMISSION_TO_HMCTS,
      case_data: {
        caseType: CaseType.SINGLE,
        claimantRepresentedQuestion: YesOrNo.YES,
        claimantIndType: {
          claimant_first_names: 'Jane',
          claimant_last_name: 'Doe',
          claimant_date_of_birth: '2022-10-05',
        },
        claimantType: {
          claimant_email_address: 'janedoe@exmaple.com',
        },
        claimantOtherType: {
          pastEmployer: YesOrNo.YES,
          stillWorking: StillWorking.WORKING,
          claimant_occupation: 'Developer',
          claimant_employed_from: '2010-05-11',
          claimant_notice_period: YesOrNo.YES,
          claimant_notice_period_unit: WeeksOrMonths.WEEKS,
          claimant_notice_period_duration: '1',
          claimant_average_weekly_hours: 5,
          claimant_pay_before_tax: 123,
          claimant_pay_after_tax: 120,
          claimant_pay_cycle: PayInterval.WEEKLY,
          claimant_pension_contribution: YesOrNoOrNotSure.YES,
          claimant_pension_weekly_contribution: 15,
          claimant_benefits: YesOrNo.YES,
          claimant_benefits_detail: 'Some benefits',
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
    const result = fromApiFormat(mockedApiData);
    expect(result).toStrictEqual({
      id: '1234',
      dobDate: {
        day: '05',
        month: '10',
        year: '2022',
      },
      email: 'janedoe@exmaple.com',
      firstName: 'Jane',
      lastName: 'Doe',
      state: CaseState.AWAITING_SUBMISSION_TO_HMCTS,
      caseType: 'Single',
      caseTypeId: CaseTypeId.ENGLAND_WALES,
      claimantRepresentedQuestion: 'Yes',
      avgWeeklyHrs: 5,
      claimantPensionContribution: YesOrNoOrNotSure.YES,
      claimantPensionWeeklyContribution: 15,
      employeeBenefits: YesOrNo.YES,
      jobTitle: 'Developer',
      noticePeriod: YesOrNo.YES,
      noticePeriodLength: '1',
      noticePeriodUnit: WeeksOrMonths.WEEKS,
      payBeforeTax: 123,
      payAfterTax: 120,
      payInterval: PayInterval.WEEKLY,
      startDate: { year: '2010', month: '05', day: '11' },
      benefitsCharCount: 'Some benefits',
      isStillWorking: StillWorking.WORKING,
      pastEmployer: YesOrNo.YES,
      personalDetailsCheck: YesOrNo.YES,
      reasonableAdjustments: YesOrNo.YES,
      reasonableAdjustmentsDetail: 'Adjustments detail test',
    });
  });

  it('should return undefined for empty field`', () => {
    const mockedApiData: CaseApiDataResponse = {
      id: '1234',
      state: CaseState.AWAITING_SUBMISSION_TO_HMCTS,
      case_data: {
        claimantRepresentedQuestion: YesOrNo.YES,
      },
    };
    const result = fromApiFormat(mockedApiData);
    expect(result).toStrictEqual({
      id: '1234',
      state: CaseState.AWAITING_SUBMISSION_TO_HMCTS,
      caseType: undefined,
      caseTypeId: undefined,
      claimantRepresentedQuestion: YesOrNo.YES,
      dobDate: undefined,
      email: undefined,
      firstName: undefined,
      lastName: undefined,
      avgWeeklyHrs: undefined,
      claimantPensionContribution: undefined,
      claimantPensionWeeklyContribution: undefined,
      employeeBenefits: undefined,
      jobTitle: undefined,
      noticePeriod: undefined,
      noticePeriodLength: undefined,
      noticePeriodUnit: undefined,
      payAfterTax: undefined,
      payBeforeTax: undefined,
      payInterval: undefined,
      startDate: undefined,
      benefitsCharCount: undefined,
      isStillWorking: undefined,
      pastEmployer: undefined,
      personalDetailsCheck: undefined,
      reasonableAdjustments: undefined,
      reasonableAdjustmentsDetail: undefined,
    });
  });

  it('date formatter should return null when input value is undefined', () => {
    const caseItem: CaseWithId = {
      id: '1234',
      state: CaseState.AWAITING_SUBMISSION_TO_HMCTS,
      dobDate: undefined,
      startDate: undefined,
    };
    const apiData = toApiFormat(caseItem);
    expect(apiData.case_data.claimantOtherType.claimant_employed_from).toEqual(null);
    expect(apiData.case_data.claimantIndType.claimant_date_of_birth).toEqual(null);
  });
});
