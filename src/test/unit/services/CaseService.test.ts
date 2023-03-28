import axios from 'axios';
import config from 'config';

import { UserDetails } from '../../../main/definitions/appRequest';
import {
  CaseType,
  CaseTypeId,
  CaseWithId,
  EmailOrPost,
  EnglishOrWelsh,
  HearingPreference,
  NoAcasNumberReason,
  PayInterval,
  Sex,
  StillWorking,
  WeeksOrMonths,
  YesOrNo,
  YesOrNoOrNotSure,
} from '../../../main/definitions/case';
import { CcdDataModel, JavaApiUrls, TYPE_OF_CLAIMANT } from '../../../main/definitions/constants';
import {
  CaseState,
  ClaimTypeDiscrimination,
  ClaimTypePay,
  TellUsWhatYouWant,
} from '../../../main/definitions/definition';
import { HubLinksStatuses } from '../../../main/definitions/hub';
import { CaseApi, UploadedFile, getCaseApi } from '../../../main/services/CaseService';
import { mockClaimantTseRequest } from '../mocks/mockClaimantTseRequest';
import { mockEt1DataModelUpdate, mockHubLinkStatusesRequest } from '../mocks/mockEt1DataModel';

const token = 'testToken';

jest.mock('config');
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;
const api = new CaseApi(mockedAxios);

const mockFile = { buffer: Buffer.alloc(10, 1), originalname: 'a-new-file.txt' } as UploadedFile;
const mockType = 'ET_EnglandWales';

const caseData =
  '[["workPostcode", "SW1A 1AA"],["claimantRepresentedQuestion","Yes"],["caseType","Single"],["typeOfClaim","[\\"breachOfContract\\",\\"discrimination\\",\\"payRelated\\",\\"unfairDismissal\\",\\"whistleBlowing\\"]"]]';
const mockUserDetails: UserDetails = {
  id: '1234',
  givenName: 'Bobby',
  familyName: 'Ryan',
  email: 'bobby@gmail.com',
  accessToken: 'xxxx',
  isCitizen: true,
};

const error = { message: 'error message' };

describe('createCase', () => {
  it('should send post request to the correct api endpoint with the case type passed', async () => {
    await api.createCase(caseData, mockUserDetails);

    expect(mockedAxios.post).toHaveBeenCalledWith(
      JavaApiUrls.INITIATE_CASE_DRAFT,
      expect.objectContaining({
        post_code: 'SW1A 1AA',
        case_data: {
          typesOfClaim: ['breachOfContract', 'discrimination', 'payRelated', 'unfairDismissal', 'whistleBlowing'],
          caseSource: CcdDataModel.CASE_SOURCE,
          caseType: 'Single',
          claimantRepresentedQuestion: 'Yes',
          claimant_TypeOfClaimant: TYPE_OF_CLAIMANT,
          triageQuestions: {
            acasMultiple: undefined,
            caseType: 'Single',
            claimantRepresentedQuestion: 'Yes',
            postcode: 'SW1A 1AA',
            typesOfClaim: ['breachOfContract', 'discrimination', 'payRelated', 'unfairDismissal', 'whistleBlowing'],
          },
          claimantIndType: {
            claimant_first_names: 'Bobby',
            claimant_last_name: 'Ryan',
          },
          claimantType: {
            claimant_email_address: 'bobby@gmail.com',
          },
          claimantRequests: {
            other_claim: undefined,
          },
        },
      })
    );
  });
});

describe('Retrieve individual case', () => {
  it('Should call java api for case id', async () => {
    const caseId = '12334578';
    await api.getUserCase(caseId);
    expect(mockedAxios.post).toHaveBeenCalledWith(
      JavaApiUrls.GET_CASE,
      expect.objectContaining({
        case_id: caseId,
      })
    );
  });
});

describe('Axios get to retrieve draft cases', () => {
  it('should send get request to the correct api endpoint and return an array of draft cases', async () => {
    await api.getUserCases();

    expect(mockedAxios.get).toHaveBeenCalledWith('cases/user-cases');
  });
});

describe('getCaseApi', () => {
  beforeAll(() => {
    config.get('services.etSyaApi.host');
    return 'http://randomurl';
  });
  test('should create a CaseApi', () => {
    expect(getCaseApi(token)).toBeInstanceOf(CaseApi);
  });
});

describe('update case', () => {
  beforeEach(() => {
    mockedAxios.put.mockClear();
  });

  it('should update draft case data', async () => {
    const caseItem: CaseWithId = {
      id: '1234',
      caseType: CaseType.SINGLE,
      caseTypeId: CaseTypeId.ENGLAND_WALES,
      claimantRepresentedQuestion: YesOrNo.YES,
      claimantWorkAddressQuestion: YesOrNo.YES,
      state: CaseState.AWAITING_SUBMISSION_TO_HMCTS,
      typeOfClaim: ['discrimination', 'payRelated'],
      ClaimantPcqId: '1234',
      dobDate: {
        year: '2010',
        month: '05',
        day: '11',
      },
      claimantSex: Sex.MALE,
      preferredTitle: 'Mr',
      email: 'tester@test.com',
      address1: 'address 1',
      address2: 'address 2',
      addressPostcode: 'TEST',
      addressCountry: 'United',
      addressTown: 'Test',
      telNumber: '075',
      firstName: 'John',
      lastName: 'Doe',
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
      newJob: YesOrNo.YES,
      newJobStartDate: { year: '2022', month: '08', day: '11' },
      newJobPay: 4000,
      newJobPayInterval: PayInterval.MONTHLY,
      benefitsCharCount: 'Some benefits',
      pastEmployer: YesOrNo.YES,
      isStillWorking: StillWorking.WORKING,
      personalDetailsCheck: YesOrNo.YES,
      reasonableAdjustments: YesOrNo.YES,
      reasonableAdjustmentsDetail: 'Adjustments detail test',
      noticeEnds: { year: '2022', month: '08', day: '11' },
      hearingPreferences: [HearingPreference.PHONE],
      hearingAssistance: 'Hearing assistance test',
      claimantContactPreference: EmailOrPost.EMAIL,
      claimantContactLanguagePreference: EnglishOrWelsh.ENGLISH,
      claimantHearingLanguagePreference: EnglishOrWelsh.ENGLISH,
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
          workAddress1: 'Respondent Address',
          workAddress2: 'That Road',
          workAddressTown: 'Anytown',
          workAddressCountry: 'England',
          workAddressPostcode: 'SW1H 9AQ',
          ccdId: '3453xaa',
        },
      ],
      claimSummaryFile: {
        document_url: 'http://dm-store:8080/documents/a0c113ec-eede-472a-a59c-f2614b48177c',
        document_filename: 'document.pdf',
        document_binary_url: 'http://dm-store:8080/documents/a0c113ec-eede-472a-a59c-f2614b48177c/binary',
      },
      createdDate: 'August 19, 2022',
      lastModified: 'August 19, 2022',
      otherClaim: 'other claim description',
    };
    await api.updateDraftCase(caseItem);

    expect(mockedAxios.put).toHaveBeenCalledWith(
      JavaApiUrls.UPDATE_CASE_DRAFT,
      expect.objectContaining(mockEt1DataModelUpdate)
    );
  });

  it('should submit Claimant TSE application', async () => {
    const caseItem: CaseWithId = {
      id: '1234',
      caseTypeId: CaseTypeId.ENGLAND_WALES,
      state: CaseState.SUBMITTED,
      createdDate: 'August 19, 2022',
      lastModified: 'August 19, 2022',
      hubLinksStatuses: new HubLinksStatuses(),
      contactApplicationType: 'witness',
      contactApplicationText: 'Change claim',
      contactApplicationFile: {
        document_url: '12345',
        document_filename: 'test.pdf',
        document_binary_url: '',
        document_size: 1000,
        document_mime_type: 'pdf',
      },
      copyToOtherPartyYesOrNo: YesOrNo.NO,
      copyToOtherPartyText: "Don't copy",
    };

    await api.submitClaimantTse(caseItem);
    expect(mockedAxios.put.mock.calls[0][0]).toBe(JavaApiUrls.SUBMIT_CLAIMANT_APPLICATION);
    expect(mockedAxios.put.mock.calls[0][1]).toMatchObject(mockClaimantTseRequest);
  });

  it('should update hub links statuses', async () => {
    const caseItem: CaseWithId = {
      id: '1234',
      state: CaseState.SUBMITTED,
      createdDate: 'August 19, 2022',
      lastModified: 'August 19, 2022',
      hubLinksStatuses: new HubLinksStatuses(),
    };
    await api.updateHubLinksStatuses(caseItem);

    expect(mockedAxios.put.mock.calls[0][0]).toBe(JavaApiUrls.UPDATE_CASE_SUBMITTED);
    expect(mockedAxios.put.mock.calls[0][1]).toMatchObject(mockHubLinkStatusesRequest);
  });
});

describe('submitCase', () => {
  it('should submit draft case data', async () => {
    const caseItem: CaseWithId = {
      id: '1234',
      caseType: CaseType.SINGLE,
      caseTypeId: CaseTypeId.ENGLAND_WALES,
      claimantRepresentedQuestion: YesOrNo.YES,
      state: CaseState.AWAITING_SUBMISSION_TO_HMCTS,
      typeOfClaim: ['discrimination', 'payRelated'],
      ClaimantPcqId: '1234',
      dobDate: {
        year: '2010',
        month: '05',
        day: '11',
      },
      claimantSex: Sex.MALE,
      preferredTitle: 'Mr',
      email: 'tester@test.com',
      address1: 'address 1',
      address2: 'address 2',
      addressPostcode: 'TEST',
      addressCountry: 'United',
      addressTown: 'Test',
      telNumber: '075',
      firstName: 'John',
      lastName: 'Doe',
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
      newJob: YesOrNo.YES,
      newJobStartDate: { year: '2022', month: '08', day: '11' },
      newJobPay: 4000,
      newJobPayInterval: PayInterval.MONTHLY,
      benefitsCharCount: 'Some benefits',
      pastEmployer: YesOrNo.YES,
      isStillWorking: StillWorking.WORKING,
      personalDetailsCheck: YesOrNo.YES,
      reasonableAdjustments: YesOrNo.YES,
      reasonableAdjustmentsDetail: 'Adjustments detail test',
      noticeEnds: { year: '2022', month: '08', day: '11' },
      hearingPreferences: [HearingPreference.PHONE],
      hearingAssistance: 'Hearing assistance test',
      claimantContactPreference: EmailOrPost.EMAIL,
      claimantContactLanguagePreference: EnglishOrWelsh.ENGLISH,
      claimantHearingLanguagePreference: EnglishOrWelsh.ENGLISH,
      employmentAndRespondentCheck: YesOrNo.YES,
      claimDetailsCheck: YesOrNo.YES,
      claimTypeDiscrimination: [ClaimTypeDiscrimination.RACE],
      claimTypePay: [ClaimTypePay.REDUNDANCY_PAY],
      claimSummaryText: 'Claim summary text',
      tellUsWhatYouWant: [TellUsWhatYouWant.COMPENSATION_ONLY],
      compensationOutcome: 'Compensation outcome',
      compensationAmount: 123,
      tribunalRecommendationRequest: 'Tribunal recommendation request',
      whistleblowingClaim: YesOrNo.YES,
      whistleblowingEntityName: 'Whistleblowing entity name',
      otherClaim: 'other claim description',
      hubLinksStatuses: undefined,
      claimSummaryFile: {
        document_url: 'http://dm-store:8080/documents/a0c113ec-eede-472a-a59c-f2614b48177c',
        document_filename: 'document.pdf',
        document_binary_url: 'http://dm-store:8080/documents/a0c113ec-eede-472a-a59c-f2614b48177c/binary',
      },
      workAddress1: 'Respondent Address',
      workAddress2: 'That Road',
      workAddressTown: 'Anytown',
      workAddressCountry: 'England',
      workAddressPostcode: 'SW1H 9AQ',
      claimantWorkAddressQuestion: YesOrNo.YES,
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
          workAddress1: 'Respondent Address',
          workAddress2: 'That Road',
          workAddressTown: 'Anytown',
          workAddressCountry: 'England',
          workAddressPostcode: 'SW1H 9AQ',
          ccdId: '3453xaa',
        },
      ],
      createdDate: 'August 19, 2022',
      lastModified: 'August 19, 2022',
    };
    await api.submitCase(caseItem);
    expect(mockedAxios.put).toHaveBeenCalledWith(
      JavaApiUrls.SUBMIT_CASE,
      expect.objectContaining(mockEt1DataModelUpdate)
    );
  });
});

describe('Axios post to retrieve pdf', () => {
  it('should send post request to the correct api endpoint with the case id passed in the request body', async () => {
    await api.downloadClaimPdf(mockUserDetails.id);

    expect(mockedAxios.post).toHaveBeenCalledWith(
      JavaApiUrls.DOWNLOAD_CLAIM_PDF,
      expect.objectContaining({
        caseId: '1234',
      }),
      expect.objectContaining({
        headers: expect.objectContaining({ 'Content-Type': 'application/pdf' }),
        responseType: 'arraybuffer',
      })
    );
  });

  describe('Axios post to upload document', () => {
    it('should send file to api endpoint', () => {
      api.uploadDocument(mockFile, mockType);
      expect(mockedAxios.post).toHaveBeenCalled();
    });
  });

  describe('Axios get to download case document', () => {
    it('should send get request to the correct api endpoint with the document id passed in the param', () => {
      api.getCaseDocument('docId');
      expect(mockedAxios.get).toHaveBeenCalled();
    });
  });

  describe('Axios get to get case document details', () => {
    it('should send get request to the correct api endpoint with the document id passed in the param', () => {
      api.getDocumentDetails('docId');
      expect(mockedAxios.get).toHaveBeenCalled();
    });
  });
});

describe('Rethrowing errors when axios requests fail', () => {
  const caseItem = { id: 123 };

  beforeAll(() => {
    mockedAxios.get.mockRejectedValue(error);
    mockedAxios.post.mockRejectedValue(error);
    mockedAxios.put.mockRejectedValue(error);
  });

  afterAll(() => {
    mockedAxios.get.mockReset();
    mockedAxios.post.mockReset();
    mockedAxios.put.mockReset();
  });

  it.each([
    {
      serviceMethod: api.createCase,
      parameters: [caseData, mockUserDetails],
      errorMessage: 'Error creating case: ' + error.message,
    },
    {
      serviceMethod: api.getUserCases,
      errorMessage: 'Error getting user cases: ' + error.message,
    },
    {
      serviceMethod: api.downloadClaimPdf,
      errorMessage: 'Error downloading claim pdf: ' + error.message,
    },
    {
      serviceMethod: api.getCaseDocument,
      errorMessage: 'Error fetching document: ' + error.message,
    },
    {
      serviceMethod: api.getDocumentDetails,
      errorMessage: 'Error fetching document details: ' + error.message,
    },
    {
      serviceMethod: api.updateDraftCase,
      parameters: [caseItem],
      errorMessage: 'Error updating draft case: ' + error.message,
    },
    {
      serviceMethod: api.updateHubLinksStatuses,
      parameters: [caseItem],
      errorMessage: 'Error updating hub links statuses: ' + error.message,
    },
    {
      serviceMethod: api.getUserCase,
      errorMessage: 'Error getting user case: ' + error.message,
    },
    {
      serviceMethod: api.submitCase,
      parameters: [caseItem],
      errorMessage: 'Error submitting case: ' + error.message,
    },
    {
      serviceMethod: api.uploadDocument,
      parameters: [mockFile, mockType],
      errorMessage: 'Error uploading document: ' + error.message,
    },
  ])('should rethrow error if service method number $# fails', async ({ serviceMethod, parameters, errorMessage }) => {
    await expect(serviceMethod.apply(this, parameters)).rejects.toThrow(errorMessage);
  });
});
