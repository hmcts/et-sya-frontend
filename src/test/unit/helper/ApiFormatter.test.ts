import { CaseApiDataResponse } from '../../../main/definitions/api/caseApiResponse';
import { UserDetails } from '../../../main/definitions/appRequest';
import {
  CaseDataCacheKey,
  CaseType,
  CaseTypeId,
  CaseWithId,
  EmailOrPost,
  HearingPreference,
  PayInterval,
  Sex,
  StillWorking,
  WeeksOrMonths,
  YesOrNo,
  YesOrNoOrNotSure,
} from '../../../main/definitions/case';
import { CaseState } from '../../../main/definitions/definition';
import { HubLinks } from '../../../main/definitions/hub';
import {
  formatDate,
  fromApiFormat,
  isOtherTitle,
  isValidPreferredTitle,
  parseDateFromString,
  returnPreferredTitle,
  toApiFormat,
  toApiFormatCreate,
} from '../../../main/helper/ApiFormatter';
import { mockEt1DataModel, mockEt1DataModelUpdate } from '../mocks/mockEt1DataModel';

describe('Should return data in api format', () => {
  it('should transform triage and Idam credentials to api format', () => {
    const userDataMap: Map<CaseDataCacheKey, string> = new Map<CaseDataCacheKey, string>([
      [CaseDataCacheKey.POSTCODE, 'SW1A 1AA'],
      [CaseDataCacheKey.CLAIMANT_REPRESENTED, 'Yes'],
      [CaseDataCacheKey.CASE_TYPE, 'Single'],
      [CaseDataCacheKey.TYPES_OF_CLAIM, JSON.stringify(['discrimination', 'payRelated'])],
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
      typeOfClaim: ['discrimination', 'payRelated'],
      dobDate: {
        year: '2010',
        month: '05',
        day: '11',
      },
      email: 'tester@test.com',
      firstName: 'John',
      lastName: 'Doe',
      claimantSex: Sex.MALE,
      preferredTitle: 'Mr',
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
      endDate: { year: '2017', month: '05', day: '11' },
      newJob: YesOrNo.YES,
      newJobPay: 4000.0,
      newJobPayInterval: PayInterval.MONTHLY,
      newJobStartDate: { year: '2022', month: '08', day: '11' },
      pastEmployer: YesOrNo.YES,
      isStillWorking: StillWorking.WORKING,
      personalDetailsCheck: YesOrNo.YES,
      reasonableAdjustments: YesOrNo.YES,
      reasonableAdjustmentsDetail: 'Adjustments detail test',
      noticeEnds: { year: '2022', month: '08', day: '11' },
      hearingPreferences: [HearingPreference.PHONE],
      hearingAssistance: 'Hearing assistance test',
      claimantContactPreference: EmailOrPost.EMAIL,
      employmentAndRespondentCheck: YesOrNo.YES,
      claimDetailsCheck: YesOrNo.YES,
      respondents: [
        {
          respondentName: 'Globo Corp',
        },
      ],
      createdDate: 'August 19, 2022',
      lastModified: 'August 19, 2022',
      et3IsThereAnEt3Response: YesOrNo.YES,
      hubLinks: new HubLinks(),
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
      created_date: '2022-08-19T09:19:25.79202',
      last_modified: '2022-08-19T09:19:25.817549',
      case_data: {
        ethosCaseReference: '123456/2022',
        caseType: CaseType.SINGLE,
        claimantRepresentedQuestion: YesOrNo.YES,
        typeOfClaim: ['discrimination', 'payRelated'],
        et3IsThereAnEt3Response: YesOrNo.YES,
        claimantIndType: {
          claimant_first_names: 'Jane',
          claimant_last_name: 'Doe',
          claimant_date_of_birth: '2022-10-05',
          claimant_sex: Sex.MALE,
          claimant_preferred_title: 'Other',
          claimant_title_other: 'Captain',
        },
        claimantType: {
          claimant_email_address: 'janedoe@exmaple.com',
          claimant_contact_preference: EmailOrPost.EMAIL,
        },
        claimantOtherType: {
          pastEmployer: YesOrNo.YES,
          stillWorking: StillWorking.WORKING,
          claimant_occupation: 'Developer',
          claimant_employed_from: '2010-05-11',
          claimant_employed_to: '2017-05-11',
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
          claimant_employed_notice_period: '2022-08-11',
        },
        newEmploymentType: {
          new_job: YesOrNo.YES,
          newly_employed_from: '2010-05-12',
          new_pay_before_tax: 4000,
          new_job_pay_interval: PayInterval.MONTHLY,
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
        hubLinks: new HubLinks(),
      },
    };
    const result = fromApiFormat(mockedApiData);
    expect(result).toStrictEqual({
      id: '1234',
      createdDate: 'August 19, 2022',
      lastModified: 'August 19, 2022',
      typeOfClaim: ['discrimination', 'payRelated'],
      dobDate: {
        day: '05',
        month: '10',
        year: '2022',
      },
      ethosCaseReference: '123456/2022',
      claimantSex: Sex.MALE,
      preferredTitle: 'Captain',
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
      endDate: { year: '2017', month: '05', day: '11' },
      benefitsCharCount: 'Some benefits',
      newJob: YesOrNo.YES,
      newJobStartDate: { year: '2010', month: '05', day: '12' },
      newJobPay: 4000,
      newJobPayInterval: PayInterval.MONTHLY,
      isStillWorking: StillWorking.WORKING,
      pastEmployer: YesOrNo.YES,
      personalDetailsCheck: YesOrNo.YES,
      reasonableAdjustments: YesOrNo.YES,
      reasonableAdjustmentsDetail: 'Adjustments detail test',
      noticeEnds: { year: '2022', month: '08', day: '11' },
      hearingPreferences: [HearingPreference.PHONE],
      hearingAssistance: 'Hearing assistance test',
      claimantContactPreference: EmailOrPost.EMAIL,
      employmentAndRespondentCheck: YesOrNo.YES,
      claimDetailsCheck: YesOrNo.YES,
      respondents: [
        {
          respondentName: 'Globo Corp',
        },
      ],
      et3IsThereAnEt3Response: YesOrNo.YES,
      hubLinks: new HubLinks(),
    });
  });

  it('should return undefined for empty field`', () => {
    const mockedApiData: CaseApiDataResponse = {
      id: '1234',
      state: CaseState.AWAITING_SUBMISSION_TO_HMCTS,
      created_date: '2022-08-19T09:19:25.817549',
      last_modified: '2022-08-19T09:19:25.817549',
      case_data: {
        claimantRepresentedQuestion: YesOrNo.YES,
      },
    };
    const result = fromApiFormat(mockedApiData);
    expect(result).toStrictEqual({
      id: '1234',
      ethosCaseReference: undefined,
      createdDate: 'August 19, 2022',
      lastModified: 'August 19, 2022',
      state: CaseState.AWAITING_SUBMISSION_TO_HMCTS,
      caseType: undefined,
      typeOfClaim: undefined,
      caseTypeId: undefined,
      claimantRepresentedQuestion: YesOrNo.YES,
      dobDate: undefined,
      claimantSex: undefined,
      preferredTitle: undefined,
      email: undefined,
      firstName: undefined,
      lastName: undefined,
      claimantPensionContribution: undefined,
      claimantPensionWeeklyContribution: undefined,
      employeeBenefits: undefined,
      endDate: undefined,
      newJob: undefined,
      newJobPay: undefined,
      newJobPayInterval: undefined,
      newJobStartDate: undefined,
      avgWeeklyHrs: undefined,
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
      noticeEnds: undefined,
      hearingPreferences: undefined,
      hearingAssistance: undefined,
      claimantContactPreference: undefined,
      employmentAndRespondentCheck: undefined,
      claimDetailsCheck: undefined,
      respondents: undefined,
      et3IsThereAnEt3Response: undefined,
      hubLinks: undefined,
    });
  });

  it('date formatter should return null when date is empty', () => {
    const caseItem: CaseWithId = {
      id: '1234',
      state: CaseState.AWAITING_SUBMISSION_TO_HMCTS,
      dobDate: { day: '', month: '', year: '' },
      startDate: { day: '', month: '', year: '' },
      noticeEnds: { day: '', month: '', year: '' },
      createdDate: 'August 19, 2022',
      lastModified: 'August 19, 2022',
    };
    const apiData = toApiFormat(caseItem);
    expect(apiData.case_data.claimantIndType.claimant_date_of_birth).toEqual(null);
    expect(apiData.case_data.claimantOtherType.claimant_employed_from).toEqual(null);
    expect(apiData.case_data.claimantOtherType.claimant_employed_notice_period).toEqual(null);
  });
});

describe('formatDate()', () => {
  it.each([
    { date: { day: '30', month: '10', year: '2000' }, expected: '2000-10-30' },
    { date: { day: '5', month: '10', year: '2000' }, expected: '2000-10-05' },
    { date: { day: '30', month: '4', year: '2000' }, expected: '2000-04-30' },
    { date: { day: '5', month: '4', year: '2000' }, expected: '2000-04-05' },
    { date: { day: '05', month: '04', year: '2000' }, expected: '2000-04-05' },
    { date: { day: '', month: '', year: '' }, expected: null },
    { date: undefined, expected: null },
  ])('Correct formatting of date to string: %o', ({ date, expected }) => {
    expect(formatDate(date)).toBe(expected);
  });
});

describe('isValidPreferredTitle()', () => {
  it.each([
    { title: 'Mr', expected: 'Mr' },
    { title: 'mr', expected: 'Mr' },
    { title: 'mR', expected: 'Mr' },
    { title: 'Ms', expected: 'Ms' },
    { title: 'Miss', expected: 'Miss' },
    { title: 'Mrs', expected: 'Mrs' },
    { title: 'Missus', expected: 'Other' },
    { title: 'Captain', expected: 'Other' },
    { title: '', expected: undefined },
    { title: undefined, expected: undefined },
  ])('Correctly retuns valid preferred title: %o', ({ title, expected }) => {
    expect(isValidPreferredTitle(title)).toBe(expected);
  });
});

describe('isOtherTitle()', () => {
  it.each([
    { title: 'Mr', expected: undefined },
    { title: 'mr', expected: undefined },
    { title: 'mR', expected: undefined },
    { title: 'Ms', expected: undefined },
    { title: 'Miss', expected: undefined },
    { title: 'Mrs', expected: undefined },
    { title: 'Missus', expected: 'Missus' },
    { title: 'Captain', expected: 'Captain' },
    { title: '', expected: undefined },
    { title: undefined, expected: undefined },
  ])('Correctly retuns valid other title: %o', ({ title, expected }) => {
    expect(isOtherTitle(title)).toBe(expected);
  });
});

describe('returnPreferredTitle()', () => {
  it.each([
    { preferredTitle: 'Mr', otherTitle: undefined, expected: 'Mr' },
    { preferredTitle: 'Ms', otherTitle: undefined, expected: 'Ms' },
    { preferredTitle: 'Other', otherTitle: 'Sir', expected: 'Sir' },
    { preferredTitle: undefined, otherTitle: 'Doctor', expected: 'Doctor' },
    { preferredTitle: undefined, otherTitle: undefined, expected: undefined },
  ])('Returns the correct title: %o', ({ preferredTitle, otherTitle, expected }) => {
    expect(returnPreferredTitle(preferredTitle, otherTitle)).toBe(expected);
  });
});

describe('parseDateFromString()', () => {
  it.each([
    { date: '2000-10-30', expected: { day: '30', month: '10', year: '2000' } },
    { date: '2000-10-05', expected: { day: '05', month: '10', year: '2000' } },
    { date: '2000-04-30', expected: { day: '30', month: '04', year: '2000' } },
    { date: '2000-04-05', expected: { day: '05', month: '04', year: '2000' } },
    { date: null, expected: undefined },
  ])('Correct parsing of date from string: %o', ({ date, expected }) => {
    expect(parseDateFromString(date)).toStrictEqual(expected);
  });
});
