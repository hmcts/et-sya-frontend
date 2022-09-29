import { CaseApiDataResponse } from '../../../main/definitions/api/caseApiResponse';
import { DocumentUploadResponse } from '../../../main/definitions/api/documentApiResponse';
import { UserDetails } from '../../../main/definitions/appRequest';
import {
  CaseDataCacheKey,
  CaseType,
  CaseTypeId,
  CaseWithId,
  EmailOrPost,
  HearingPreference,
  NoAcasNumberReason,
  PayInterval,
  Sex,
  StillWorking,
  WeeksOrMonths,
  YesOrNo,
  YesOrNoOrNotSure,
} from '../../../main/definitions/case';
import { TYPE_OF_CLAIMANT } from '../../../main/definitions/constants';
import {
  CaseState,
  ClaimTypeDiscrimination,
  ClaimTypePay,
  TellUsWhatYouWant,
} from '../../../main/definitions/definition';
import { HubLinksStatuses } from '../../../main/definitions/hub';
import {
  formatDate,
  fromApiFormat,
  fromApiFormatDocument,
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

  it('should transform case data to api format', () => {
    const caseItem: CaseWithId = {
      id: '1234',
      caseTypeId: CaseTypeId.ENGLAND_WALES,
      caseType: CaseType.SINGLE,
      ClaimantPcqId: '1234',
      claimantRepresentedQuestion: YesOrNo.YES,
      claimantWorkAddressQuestion: YesOrNo.YES,
      state: CaseState.AWAITING_SUBMISSION_TO_HMCTS,
      typeOfClaim: ['discrimination', 'payRelated'],
      dobDate: {
        year: '2010',
        month: '05',
        day: '11',
      },
      email: 'tester@test.com',
      address1: 'address 1',
      address2: 'address 2',
      addressPostcode: 'TEST',
      addressCountry: 'United',
      addressTown: 'Test',
      telNumber: '075',
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
      claimTypeDiscrimination: [ClaimTypeDiscrimination.RACE],
      claimTypePay: [ClaimTypePay.REDUNDANCY_PAY],
      claimSummaryText: 'Claim summary text',
      tellUsWhatYouWant: [TellUsWhatYouWant.COMPENSATION_ONLY],
      compensationOutcome: 'Compensation outcome',
      compensationAmount: 123,
      tribunalRecommendationRequest: 'Tribunal recommendation request',
      whistleblowingClaim: YesOrNo.YES,
      whistleblowingEntityName: 'Whistleblowing entity name',
      claimDetailsCheck: YesOrNo.YES,
      workAddress1: 'Respondent Address',
      workAddress2: 'That Road',
      workAddressTown: 'Anytown',
      workAddressCountry: 'England',
      workAddressPostcode: 'SW1H 9AQ',
      respondents: [
        {
          respondentName: 'Globo Corp',
          acasCert: YesOrNo.YES,
          acasCertNum: 'R111111111111',
          noAcasReason: NoAcasNumberReason.ANOTHER,
          respondentAddress1: 'Respondent Address',
          respondentAddress2: 'That Road',
          respondentAddressTown: 'Anytown',
          respondentAddressCountry: 'England',
          respondentAddressPostcode: 'SW1H 9AQ',
          ccdId: '3453xaa',
        },
      ],
      createdDate: 'August 19, 2022',
      lastModified: 'August 19, 2022',
      et3IsThereAnEt3Response: YesOrNo.YES,
      claimSummaryFile: {
        document_url: 'http://dm-store:8080/documents/a0c113ec-eede-472a-a59c-f2614b48177c',
        document_filename: 'document.pdf',
        document_binary_url: 'http://dm-store:8080/documents/a0c113ec-eede-472a-a59c-f2614b48177c/binary',
      },
    };
    const apiData = toApiFormat(caseItem);
    expect(apiData).toEqual(mockEt1DataModelUpdate);
  });
});

describe('Format document model', () => {
  it('should format DocumentApiResponse', () => {
    const mockDocData: DocumentUploadResponse = {
      originalDocumentName: 'testname',
      uri: 'test.com',
      _links: {
        self: {
          href: 'test.com',
        },
        binary: {
          href: 'test.com',
        },
      },
      classification: '',
      size: '',
      mimeType: '',
      hashToken: '',
      createdOn: '',
      createdBy: '',
      lastModifiedBy: '',
      modifiedOn: '',
      ttl: '',
      metadata: {
        case_type_id: '',
        jurisdiction: '',
      },
    };
    const result = fromApiFormatDocument(mockDocData);
    expect(result).toStrictEqual({
      document_filename: 'testname',
      document_url: 'test.com',
      document_binary_url: 'test.com',
    });
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
        claimantWorkAddressQuestion: YesOrNo.YES,
        claimant_TypeOfClaimant: TYPE_OF_CLAIMANT,
        typesOfClaim: ['discrimination', 'payRelated'],
        ClaimantPcqId: '1234',
        et3IsThereAnEt3Response: YesOrNo.YES,
        claimantIndType: {
          claimant_first_names: 'Jane',
          claimant_last_name: 'Doe',
          claimant_date_of_birth: '2022-10-05',
          claimant_sex: Sex.MALE,
          claimant_preferred_title: 'Mr',
        },
        claimantType: {
          claimant_email_address: 'janedoe@exmaple.com',
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
        claimantRequests: {
          claim_outcome: [TellUsWhatYouWant.COMPENSATION_ONLY],
          claimant_compensation_text: 'Compensation outcome',
          claimant_compensation_amount: 123,
          claimant_tribunal_recommendation: 'Tribunal recommendation request',
          whistleblowing: YesOrNo.YES,
          whistleblowing_authority: 'Whistleblowing entity name',
          claim_description: 'Claim summary text',
          claim_description_document: {
            document_url: 'http://dm-store:8080/documents/a0c113ec-eede-472a-a59c-f2614b48177c',
            document_filename: 'document.pdf',
            document_binary_url: 'http://dm-store:8080/documents/a0c113ec-eede-472a-a59c-f2614b48177c/binary',
          },
          discrimination_claims: [ClaimTypeDiscrimination.RACE],
          pay_claims: [ClaimTypePay.REDUNDANCY_PAY],
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
        hubLinksStatuses: new HubLinksStatuses(),
        managingOffice: 'Leeds',
        tribunalCorrespondenceEmail: 'leedsoffice@gov.co.uk',
        tribunalCorrespondenceTelephone: '0300 123 1024',
        documentCollection: [
          {
            id: 'f78aa088-c223-4ca5-8e0a-42e7c33dffa5',
            value: {
              typeOfDocument: 'Notice of a claim',
              uploadedDocument: {
                document_binary_url: 'http://dm-store:8080/documents/3aa7dfc1-378b-4fa8-9a17-89126fae5673/binary',
                document_filename: 'ET1_CASE_DOCUMENT_Sunday_Ayeni.pdf',
                document_url: 'http://dm-store:8080/documents/3aa7dfc1-378b-4fa8-9a17-89126fae5673',
              },
              shortDescription: 'Case Details - Sunday Ayeni',
            },
          },
          {
            id: '3db71007-d42c-43d5-a51b-57957f78ced3',
            value: {
              typeOfDocument: 'ACAS Certificate',
              uploadedDocument: {
                document_binary_url: 'http://dm-store:8080/documents/10dbc31c-5bf6-4ecf-9ad7-6bbf58492afa/binary',
                document_filename: 'ET1_ACAS_CERTIFICATE_Sunday_Ayeni_R600227_21_75.pdf',
                document_url: 'http://dm-store:8080/documents/10dbc31c-5bf6-4ecf-9ad7-6bbf58492afa',
              },
              shortDescription: 'ACAS Certificate - Sunday Ayeni - R600227/21/75',
            },
          },
        ],
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
      ClaimantPcqId: '1234',
      claimantSex: Sex.MALE,
      preferredTitle: 'Mr',
      email: 'janedoe@exmaple.com',
      address1: 'address 1',
      address2: 'address 2',
      addressPostcode: 'TEST',
      addressCountry: 'United',
      addressTown: 'Test',
      telNumber: '075',
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
      claimTypeDiscrimination: [ClaimTypeDiscrimination.RACE],
      claimTypePay: [ClaimTypePay.REDUNDANCY_PAY],
      claimSummaryText: 'Claim summary text',
      tellUsWhatYouWant: [TellUsWhatYouWant.COMPENSATION_ONLY],
      compensationOutcome: 'Compensation outcome',
      compensationAmount: 123,
      tribunalRecommendationRequest: 'Tribunal recommendation request',
      whistleblowingClaim: YesOrNo.YES,
      whistleblowingEntityName: 'Whistleblowing entity name',
      claimDetailsCheck: YesOrNo.YES,
      claimantWorkAddressQuestion: YesOrNo.YES,
      workAddress1: 'Respondent Address',
      workAddress2: 'That Road',
      workAddressTown: 'Anytown',
      workAddressCountry: 'England',
      workAddressPostcode: 'SW1H 9AQ',

      respondents: [
        {
          respondentName: 'Globo Corp',
          acasCert: YesOrNo.YES,
          acasCertNum: 'R111111111111',
          noAcasReason: NoAcasNumberReason.ANOTHER,
          respondentAddress1: 'Respondent Address',
          respondentAddress2: 'That Road',
          respondentAddressTown: 'Anytown',
          respondentAddressCountry: 'England',
          respondentAddressPostcode: 'SW1H 9AQ',
          ccdId: '3453xaa',
        },
      ],
      et3IsThereAnEt3Response: YesOrNo.YES,
      claimSummaryFile: {
        document_url: 'http://dm-store:8080/documents/a0c113ec-eede-472a-a59c-f2614b48177c',
        document_filename: 'document.pdf',
        document_binary_url: 'http://dm-store:8080/documents/a0c113ec-eede-472a-a59c-f2614b48177c/binary',
      },
      hubLinksStatuses: new HubLinksStatuses(),
      managingOffice: 'Leeds',
      tribunalCorrespondenceEmail: 'leedsoffice@gov.co.uk',
      tribunalCorrespondenceTelephone: '0300 123 1024',
      et1SubmittedForm: {
        document_binary_url: 'http://dm-store:8080/documents/3aa7dfc1-378b-4fa8-9a17-89126fae5673/binary',
        document_filename: 'ET1_CASE_DOCUMENT_Sunday_Ayeni.pdf',
        document_url: 'http://dm-store:8080/documents/3aa7dfc1-378b-4fa8-9a17-89126fae5673',
      },
      documentCollection: [
        {
          id: 'f78aa088-c223-4ca5-8e0a-42e7c33dffa5',
          value: {
            typeOfDocument: 'Notice of a claim',
            uploadedDocument: {
              document_binary_url: 'http://dm-store:8080/documents/3aa7dfc1-378b-4fa8-9a17-89126fae5673/binary',
              document_filename: 'ET1_CASE_DOCUMENT_Sunday_Ayeni.pdf',
              document_url: 'http://dm-store:8080/documents/3aa7dfc1-378b-4fa8-9a17-89126fae5673',
            },
            shortDescription: 'Case Details - Sunday Ayeni',
          },
        },
        {
          id: '3db71007-d42c-43d5-a51b-57957f78ced3',
          value: {
            typeOfDocument: 'ACAS Certificate',
            uploadedDocument: {
              document_binary_url: 'http://dm-store:8080/documents/10dbc31c-5bf6-4ecf-9ad7-6bbf58492afa/binary',
              document_filename: 'ET1_ACAS_CERTIFICATE_Sunday_Ayeni_R600227_21_75.pdf',
              document_url: 'http://dm-store:8080/documents/10dbc31c-5bf6-4ecf-9ad7-6bbf58492afa',
            },
            shortDescription: 'ACAS Certificate - Sunday Ayeni - R600227/21/75',
          },
        },
      ],
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
      ClaimantPcqId: undefined,
      dobDate: undefined,
      claimantSex: undefined,
      preferredTitle: undefined,
      email: undefined,
      address1: undefined,
      address2: undefined,
      addressPostcode: undefined,
      addressCountry: undefined,
      addressTown: undefined,
      telNumber: undefined,
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
      claimSummaryText: undefined,
      claimTypeDiscrimination: undefined,
      claimTypePay: undefined,
      tellUsWhatYouWant: undefined,
      tribunalRecommendationRequest: undefined,
      compensationAmount: undefined,
      compensationOutcome: undefined,
      whistleblowingClaim: undefined,
      whistleblowingEntityName: undefined,
      respondents: undefined,
      claimantWorkAddressQuestion: undefined,
      workAddress1: undefined,
      workAddress2: undefined,
      workAddressTown: undefined,
      workAddressCountry: undefined,
      workAddressPostcode: undefined,
      et3IsThereAnEt3Response: undefined,
      claimSummaryFile: undefined,
      hubLinksStatuses: undefined,
      documentCollection: undefined,
      managingOffice: undefined,
      et1SubmittedForm: undefined,
      tribunalCorrespondenceEmail: undefined,
      tribunalCorrespondenceTelephone: undefined,
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
