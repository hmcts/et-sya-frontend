import axios, { AxiosResponse } from 'axios';

import { CaseApiDataResponse } from '../../../main/definitions/api/caseApiResponse';
import { CaseType, CaseWithId, YesOrNo } from '../../../main/definitions/case';
import { ErrorPages, PageUrls, languages } from '../../../main/definitions/constants';
import { CaseState } from '../../../main/definitions/definition';
import {
  getOverallStatus,
  getRedirectUrl,
  getUserApplications,
  getUserCasesByLastModified,
  selectUserCase,
} from '../../../main/services/CaseSelectionService';
import { CaseApi } from '../../../main/services/CaseService';
import * as caseService from '../../../main/services/CaseService';
import { mockApplications } from '../mocks/mockApplications';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';
import { mockEnglishClaimTypesTranslations } from '../mocks/mockTranslations';

jest.mock('axios');
const getCaseApiClientMock = jest.spyOn(caseService, 'getCaseApi');

describe('Case Selection Service using Case Api', () => {
  const mockApiClient = {
    createCase: jest.fn(),
    getUserCases: jest.fn(),
    downloadClaimPdf: jest.fn(),
    updateDraftCase: jest.fn(),
    getUserCase: jest.fn(),
    getCaseTransferInfo: jest.fn(),
  };

  beforeEach(() => {
    mockApiClient.getCaseTransferInfo.mockRejectedValue(new Error('not transferred'));
  });

  afterEach(() => {
    mockApiClient.getUserCases.mockClear();
    mockApiClient.createCase.mockClear();
    mockApiClient.downloadClaimPdf.mockClear();
    mockApiClient.updateDraftCase.mockClear();
    mockApiClient.getUserCase.mockClear();
    mockApiClient.getCaseTransferInfo.mockClear();
  });

  test('Should Return user cases by last modified date', async () => {
    const response: AxiosResponse<CaseApiDataResponse[]> = {
      data: [
        {
          id: '12234',
          state: CaseState.AWAITING_SUBMISSION_TO_HMCTS,
          last_modified: '2019-02-12T14:25:39.015',
          created_date: '2019-02-12T14:25:39.015',
          case_data: {
            caseType: CaseType.SINGLE,
            typesOfClaim: ['discrimination', 'payRelated'],
            claimantRepresentedQuestion: YesOrNo.YES,
            caseSource: 'ET1 Online',
          },
        },
        {
          id: '122345',
          state: CaseState.AWAITING_SUBMISSION_TO_HMCTS,
          last_modified: '2019-02-13T14:25:39.015',
          created_date: '2019-02-12T14:25:39.015',
          case_data: {
            caseType: CaseType.SINGLE,
            typesOfClaim: ['discrimination', 'payRelated'],
            claimantRepresentedQuestion: YesOrNo.YES,
            caseSource: 'ET1 Online',
          },
        },
      ],
      status: 200,
      statusText: '',
      headers: undefined,
      config: undefined,
    };
    const req = mockRequest({});
    const caseApi = new CaseApi(axios as jest.Mocked<typeof axios>);
    getCaseApiClientMock.mockReturnValue(caseApi);
    caseApi.getUserCases = jest.fn().mockResolvedValue(response);

    mockApiClient.getUserCases.mockResolvedValue(response);
    const userCases = await getUserCasesByLastModified(req);

    expect(userCases).toHaveLength(2);
    expect(userCases[0].lastModified).toStrictEqual('13 February 2019');
    expect(userCases[1].lastModified).toStrictEqual('12 February 2019');
  });

  test('Should Return user cases by last modified date and filter out deleted cases', async () => {
    const response: AxiosResponse<CaseApiDataResponse[]> = {
      data: [
        {
          id: '12234',
          state: CaseState.AWAITING_SUBMISSION_TO_HMCTS,
          last_modified: '2019-02-12T14:25:39.015',
          created_date: '2019-02-12T14:25:39.015',
          case_data: {
            caseType: CaseType.SINGLE,
            typesOfClaim: ['discrimination', 'payRelated'],
            claimantRepresentedQuestion: YesOrNo.YES,
            caseSource: 'ET1 Online',
          },
        },
        {
          id: '122345',
          state: CaseState.AWAITING_SUBMISSION_TO_HMCTS,
          last_modified: '2019-02-13T14:25:39.015',
          created_date: '2019-02-12T14:25:39.015',
          case_data: {
            caseType: CaseType.SINGLE,
            typesOfClaim: ['discrimination', 'payRelated'],
            claimantRepresentedQuestion: YesOrNo.YES,
            caseSource: 'ET1 Online',
          },
        },
      ],
      status: 200,
      statusText: '',
      headers: undefined,
      config: undefined,
    };
    const req = mockRequest({ session: { deletedCaseIds: ['12234'] } });
    const caseApi = new CaseApi(axios as jest.Mocked<typeof axios>);
    getCaseApiClientMock.mockReturnValue(caseApi);
    caseApi.getUserCases = jest.fn().mockResolvedValue(response);

    mockApiClient.getUserCases.mockResolvedValue(response);
    const userCases = await getUserCasesByLastModified(req);

    expect(userCases).toHaveLength(1);
    expect(userCases[0].id).toStrictEqual('122345');
    expect(userCases[0].lastModified).toStrictEqual('13 February 2019');
  });

  test('Should return empty array', async () => {
    const response: AxiosResponse<CaseApiDataResponse[]> = {
      data: [],
      status: 200,
      statusText: '',
      headers: undefined,
      config: undefined,
    };

    const req = mockRequest({});
    const caseApi = new CaseApi(axios as jest.Mocked<typeof axios>);
    getCaseApiClientMock.mockReturnValue(caseApi);
    caseApi.getUserCases = jest.fn().mockResolvedValue(response);

    const result = await getUserCasesByLastModified(req);

    expect(result).toStrictEqual([]);
  });

  test('Should return empty array when getUserCases throws', async () => {
    const req = mockRequest({});
    const caseApi = new CaseApi(axios as jest.Mocked<typeof axios>);
    getCaseApiClientMock.mockReturnValue(caseApi);
    caseApi.getUserCases = jest.fn().mockRejectedValue(new Error('api unavailable'));

    const result = await getUserCasesByLastModified(req);

    expect(result).toStrictEqual([]);
  });

  test('Should hit error block and return empty array', async () => {
    const req = mockRequest({});
    const caseApi = new CaseApi(axios as jest.Mocked<typeof axios>);
    getCaseApiClientMock.mockReturnValue(caseApi);
    caseApi.getUserCases = jest.fn().mockRejectedValue(new Error('Failed to retrieve cases'));

    const result = await getUserCasesByLastModified(req);

    expect(result).toStrictEqual([]);
  });

  test('Should select represented User Case and redirect to non-HMCTS Claim Steps in English language', async () => {
    const response: AxiosResponse<CaseApiDataResponse> = {
      data: {
        id: '12234',
        state: CaseState.AWAITING_SUBMISSION_TO_HMCTS,
        last_modified: '2019-02-12T14:25:39.015',
        created_date: '2019-02-12T14:25:39.015',
        case_data: {
          caseType: CaseType.SINGLE,
          typesOfClaim: ['discrimination', 'payRelated'],
          claimantRepresentedQuestion: YesOrNo.YES,
          caseSource: 'ET1 Online',
        },
      },
      status: 200,
      statusText: '',
      headers: undefined,
      config: undefined,
    };

    const req = mockRequest({});
    req.url = PageUrls.CLAIM_STEPS + languages.ENGLISH_URL_PARAMETER;
    const res = mockResponse();
    const caseApi = new CaseApi(axios as jest.Mocked<typeof axios>);
    getCaseApiClientMock.mockReturnValue(caseApi);
    caseApi.getUserCase = jest.fn().mockResolvedValue(response);
    caseApi.getCaseTransferInfo = jest.fn().mockRejectedValue(new Error('not transferred'));

    await selectUserCase(req, res, '12234');

    expect(res.redirect).toHaveBeenCalledWith(PageUrls.CLAIM_STEPS_NON_HMCTS + languages.ENGLISH_URL_PARAMETER);
  });

  test('Should select submitted User Case and redirect to Citizen Hub in English language', async () => {
    const response: AxiosResponse<CaseApiDataResponse> = {
      data: {
        id: '12234',
        state: CaseState.SUBMITTED,
        last_modified: '2019-02-12T14:25:39.015',
        created_date: '2019-02-12T14:25:39.015',
        case_data: {
          caseType: CaseType.SINGLE,
          typesOfClaim: ['discrimination', 'payRelated'],
          claimantRepresentedQuestion: YesOrNo.YES,
          caseSource: 'ET1 Online',
        },
      },
      status: 200,
      statusText: '',
      headers: undefined,
      config: undefined,
    };

    const req = mockRequest({});
    req.url = PageUrls.SELECTED_APPLICATION.replace(':caseId', '12234') + languages.ENGLISH_URL_PARAMETER;
    const res = mockResponse();
    const caseApi = new CaseApi(axios as jest.Mocked<typeof axios>);
    getCaseApiClientMock.mockReturnValue(caseApi);
    caseApi.getUserCase = jest.fn().mockResolvedValue(response);
    caseApi.getCaseTransferInfo = jest.fn().mockRejectedValue(new Error('not transferred'));

    await selectUserCase(req, res, '12234');

    expect(res.redirect).toHaveBeenCalledWith('/citizen-hub/12234?lng=en');
  });

  test('Should redirect to claimant applications when submitted case has a non-numeric id', async () => {
    const response: AxiosResponse<CaseApiDataResponse> = {
      data: {
        id: 'not-a-number',
        state: CaseState.SUBMITTED,
        last_modified: '2019-02-12T14:25:39.015',
        created_date: '2019-02-12T14:25:39.015',
        case_data: {
          caseType: CaseType.SINGLE,
          typesOfClaim: ['discrimination', 'payRelated'],
          claimantRepresentedQuestion: YesOrNo.YES,
          caseSource: 'ET1 Online',
        },
      },
      status: 200,
      statusText: '',
      headers: undefined,
      config: undefined,
    };

    const req = mockRequest({});
    req.url = PageUrls.SELECTED_APPLICATION.replace(':caseId', 'not-a-number') + languages.ENGLISH_URL_PARAMETER;
    const res = mockResponse();
    const caseApi = new CaseApi(axios as jest.Mocked<typeof axios>);
    getCaseApiClientMock.mockReturnValue(caseApi);
    caseApi.getUserCase = jest.fn().mockResolvedValue(response);
    caseApi.getCaseTransferInfo = jest.fn().mockRejectedValue(new Error('not transferred'));

    await selectUserCase(req, res, 'not-a-number');

    expect(res.redirect).toHaveBeenCalledWith(PageUrls.CLAIMANT_APPLICATIONS);
  });

  test('Should select submitted User Case and redirect to Citizen Hub in Welsh language', async () => {
    const response: AxiosResponse<CaseApiDataResponse> = {
      data: {
        id: '12234',
        state: CaseState.SUBMITTED,
        last_modified: '2019-02-12T14:25:39.015',
        created_date: '2019-02-12T14:25:39.015',
        case_data: {
          caseType: CaseType.SINGLE,
          typesOfClaim: ['discrimination', 'payRelated'],
          claimantRepresentedQuestion: YesOrNo.YES,
          caseSource: 'ET1 Online',
        },
      },
      status: 200,
      statusText: '',
      headers: undefined,
      config: undefined,
    };

    const req = mockRequest({});
    req.url = PageUrls.SELECTED_APPLICATION.replace(':caseId', '12234') + languages.WELSH_URL_PARAMETER;
    const res = mockResponse();
    const caseApi = new CaseApi(axios as jest.Mocked<typeof axios>);
    getCaseApiClientMock.mockReturnValue(caseApi);
    caseApi.getUserCase = jest.fn().mockResolvedValue(response);
    caseApi.getCaseTransferInfo = jest.fn().mockRejectedValue(new Error('not transferred'));

    await selectUserCase(req, res, '12234');

    expect(res.redirect).toHaveBeenCalledWith('/citizen-hub/12234?lng=cy');
  });

  test('Should redirect to citizen hub when submitted case loads successfully', async () => {
    const response: AxiosResponse<CaseApiDataResponse> = {
      data: {
        id: '12234',
        state: CaseState.SUBMITTED,
        last_modified: '2019-02-12T14:25:39.015',
        created_date: '2019-02-12T14:25:39.015',
        case_data: {
          caseType: CaseType.SINGLE,
          typesOfClaim: ['discrimination', 'payRelated'],
          claimantRepresentedQuestion: YesOrNo.YES,
          caseSource: 'ET1 Online',
        },
      },
      status: 200,
      statusText: '',
      headers: undefined,
      config: undefined,
    };

    const req = mockRequest({});
    req.url = PageUrls.SELECTED_APPLICATION.replace(':caseId', '12234') + languages.ENGLISH_URL_PARAMETER;
    const res = mockResponse();
    const caseApi = new CaseApi(axios as jest.Mocked<typeof axios>);
    getCaseApiClientMock.mockReturnValue(caseApi);
    caseApi.getUserCase = jest.fn().mockResolvedValue(response);
    caseApi.getCaseTransferInfo = jest.fn().mockResolvedValue({
      data: {
        transferred: true,
        transferType: 'ECM',
        originalCaseId: '12234',
        transferComplete: false,
      },
    });

    await selectUserCase(req, res, '12234');

    expect(caseApi.getCaseTransferInfo).not.toHaveBeenCalled();
    expect(res.redirect).toHaveBeenCalledWith('/citizen-hub/12234?lng=en');
  });

  test('Should redirect to transferred page when getUserCase fails and transfer-info confirms transfer', async () => {
    const req = mockRequest({});
    req.url = PageUrls.SELECTED_APPLICATION.replace(':caseId', '12234') + languages.ENGLISH_URL_PARAMETER;
    const res = mockResponse();
    const caseApi = new CaseApi(axios as jest.Mocked<typeof axios>);
    getCaseApiClientMock.mockReturnValue(caseApi);
    caseApi.getUserCase = jest
      .fn()
      .mockRejectedValue(
        new Error('Error getting user case: Request failed with status code 404, CaseNotFoundException')
      );
    caseApi.getCaseTransferInfo = jest.fn().mockResolvedValue({
      data: {
        transferred: true,
        transferType: 'ECM',
        originalCaseId: '12234',
        transferComplete: false,
      },
    });

    await selectUserCase(req, res, '12234');

    expect(res.redirect).toHaveBeenCalledWith(`${PageUrls.TRANSFERRED_CASE}?lng=en&caseId=12234`);
  });

  test('Should redirect to not found when getUserCase fails and transfer-info says not transferred', async () => {
    const req = mockRequest({});
    req.url = PageUrls.SELECTED_APPLICATION.replace(':caseId', '12234') + languages.ENGLISH_URL_PARAMETER;
    const res = mockResponse();
    const caseApi = new CaseApi(axios as jest.Mocked<typeof axios>);
    getCaseApiClientMock.mockReturnValue(caseApi);
    caseApi.getUserCase = jest
      .fn()
      .mockRejectedValue(
        new Error('Error getting user case: Request failed with status code 404, CaseNotFoundException')
      );
    caseApi.getCaseTransferInfo = jest.fn().mockResolvedValue({
      data: {
        transferred: false,
        transferType: 'ECM',
        transferComplete: false,
      },
    });

    await selectUserCase(req, res, '12234');

    expect(res.redirect).toHaveBeenCalledWith(ErrorPages.NOT_FOUND + languages.ENGLISH_URL_PARAMETER);
  });

  test('Should redirect to not found when getUserCase fails and transfer-info is unavailable', async () => {
    const req = mockRequest({});
    req.url = PageUrls.SELECTED_APPLICATION.replace(':caseId', '12234') + languages.ENGLISH_URL_PARAMETER;
    const res = mockResponse();
    const caseApi = new CaseApi(axios as jest.Mocked<typeof axios>);
    getCaseApiClientMock.mockReturnValue(caseApi);
    caseApi.getUserCase = jest
      .fn()
      .mockRejectedValue(
        new Error('Error getting user case: Request failed with status code 404, CaseNotFoundException')
      );
    caseApi.getCaseTransferInfo = jest.fn().mockRejectedValue(new Error('not transferred'));

    await selectUserCase(req, res, '12234');

    expect(res.redirect).toHaveBeenCalledWith(ErrorPages.NOT_FOUND + languages.ENGLISH_URL_PARAMETER);
  });

  test('Should redirect to not found without checking transfer info when getUserCase fails with a server error', async () => {
    const req = mockRequest({});
    req.url = PageUrls.SELECTED_APPLICATION.replace(':caseId', '12234') + languages.ENGLISH_URL_PARAMETER;
    const res = mockResponse();
    const caseApi = new CaseApi(axios as jest.Mocked<typeof axios>);
    getCaseApiClientMock.mockReturnValue(caseApi);
    caseApi.getUserCase = jest
      .fn()
      .mockRejectedValue(new Error('Error getting user case: Request failed with status code 500'));
    caseApi.getCaseTransferInfo = jest.fn().mockResolvedValue({
      data: {
        transferred: true,
        transferType: 'ECM',
        originalCaseId: '12234',
        transferComplete: false,
      },
    });

    await selectUserCase(req, res, '12234');

    expect(caseApi.getCaseTransferInfo).not.toHaveBeenCalled();
    expect(res.redirect).toHaveBeenCalledWith(ErrorPages.NOT_FOUND + languages.ENGLISH_URL_PARAMETER);
  });

  test('Should select represented User Case and redirect to non-HMCTS Claim Steps in Welsh language', async () => {
    const response: AxiosResponse<CaseApiDataResponse> = {
      data: {
        id: '12234',
        state: CaseState.AWAITING_SUBMISSION_TO_HMCTS,
        last_modified: '2019-02-12T14:25:39.015',
        created_date: '2019-02-12T14:25:39.015',
        case_data: {
          caseType: CaseType.SINGLE,
          typesOfClaim: ['discrimination', 'payRelated'],
          claimantRepresentedQuestion: YesOrNo.YES,
          caseSource: 'ET1 Online',
        },
      },
      status: 200,
      statusText: '',
      headers: undefined,
      config: undefined,
    };

    const req = mockRequest({});
    req.url = PageUrls.CLAIM_STEPS + languages.WELSH_URL_PARAMETER;
    const res = mockResponse();
    const caseApi = new CaseApi(axios as jest.Mocked<typeof axios>);
    getCaseApiClientMock.mockReturnValue(caseApi);
    caseApi.getUserCase = jest.fn().mockResolvedValue(response);
    caseApi.getCaseTransferInfo = jest.fn().mockRejectedValue(new Error('not transferred'));

    await selectUserCase(req, res, '12234');

    expect(res.redirect).toHaveBeenCalledWith(PageUrls.CLAIM_STEPS_NON_HMCTS + languages.WELSH_URL_PARAMETER);
  });

  test('Should redirect to new claim in English language if undefined and current language is English', async () => {
    const response: AxiosResponse<CaseApiDataResponse> = {
      data: undefined,
      status: 200,
      statusText: '',
      headers: undefined,
      config: undefined,
    };

    const req = mockRequest({});
    req.url = PageUrls.CLAIM_STEPS + languages.ENGLISH_URL_PARAMETER;
    const res = mockResponse();
    const caseApi = new CaseApi(axios as jest.Mocked<typeof axios>);
    getCaseApiClientMock.mockReturnValue(caseApi);
    caseApi.getUserCase = jest.fn().mockResolvedValue(response);
    await selectUserCase(req, res, '12234');

    expect(res.redirect).toHaveBeenCalledWith(PageUrls.LIP_OR_REPRESENTATIVE + languages.ENGLISH_URL_PARAMETER);
  });

  test('Should redirect to new claim in Welsh language if undefined and current language is Welsh', async () => {
    const response: AxiosResponse<CaseApiDataResponse> = {
      data: undefined,
      status: 200,
      statusText: '',
      headers: undefined,
      config: undefined,
    };

    const req = mockRequest({});
    req.url = PageUrls.CLAIM_STEPS + languages.WELSH_URL_PARAMETER;
    const res = mockResponse();
    const caseApi = new CaseApi(axios as jest.Mocked<typeof axios>);
    getCaseApiClientMock.mockReturnValue(caseApi);
    caseApi.getUserCase = jest.fn().mockResolvedValue(response);
    await selectUserCase(req, res, '12234');

    expect(res.redirect).toHaveBeenCalledWith(PageUrls.LIP_OR_REPRESENTATIVE + languages.WELSH_URL_PARAMETER);
  });

  test('Should redirect to new claim in English language if null and current language is English', async () => {
    const response: AxiosResponse<CaseApiDataResponse> = {
      data: null,
      status: 200,
      statusText: '',
      headers: undefined,
      config: undefined,
    };

    const req = mockRequest({});
    req.url = PageUrls.CLAIM_STEPS + languages.ENGLISH_URL_PARAMETER;
    const res = mockResponse();
    const caseApi = new CaseApi(axios as jest.Mocked<typeof axios>);
    getCaseApiClientMock.mockReturnValue(caseApi);
    caseApi.getUserCase = jest.fn().mockResolvedValue(response);
    await selectUserCase(req, res, '12234');

    expect(res.redirect).toHaveBeenCalledWith(PageUrls.LIP_OR_REPRESENTATIVE + languages.ENGLISH_URL_PARAMETER);
  });

  test('Should redirect to new claim in Welsh language if null and current language is Welsh', async () => {
    const response: AxiosResponse<CaseApiDataResponse> = {
      data: null,
      status: 200,
      statusText: '',
      headers: undefined,
      config: undefined,
    };

    const req = mockRequest({});
    req.url = PageUrls.CLAIM_STEPS + languages.WELSH_URL_PARAMETER;
    const res = mockResponse();
    const caseApi = new CaseApi(axios as jest.Mocked<typeof axios>);
    getCaseApiClientMock.mockReturnValue(caseApi);
    caseApi.getUserCase = jest.fn().mockResolvedValue(response);
    await selectUserCase(req, res, '12234');

    expect(res.redirect).toHaveBeenCalledWith(PageUrls.LIP_OR_REPRESENTATIVE + languages.WELSH_URL_PARAMETER);
  });

  test('Should redirect to not found in English language on error if current language is English', async () => {
    const req = mockRequest({});
    req.url = PageUrls.CLAIM_STEPS + languages.ENGLISH_URL_PARAMETER;
    const res = mockResponse();
    const caseApi = new CaseApi(axios as jest.Mocked<typeof axios>);
    getCaseApiClientMock.mockReturnValue(caseApi);
    caseApi.getUserCase = jest.fn().mockRejectedValue(new Error('Failed to retrieve case'));
    caseApi.getCaseTransferInfo = jest.fn().mockRejectedValue(new Error('not transferred'));
    await selectUserCase(req, res, '12234');

    expect(res.redirect).toHaveBeenCalledWith(ErrorPages.NOT_FOUND + languages.ENGLISH_URL_PARAMETER);
  });

  test('Should redirect to not found in Welsh on error if current language is Welsh', async () => {
    const req = mockRequest({});
    req.url = PageUrls.CLAIM_STEPS + languages.WELSH_URL_PARAMETER;
    const res = mockResponse();
    const caseApi = new CaseApi(axios as jest.Mocked<typeof axios>);
    getCaseApiClientMock.mockReturnValue(caseApi);
    caseApi.getUserCase = jest.fn().mockRejectedValue(new Error('Failed to retrieve case'));
    caseApi.getCaseTransferInfo = jest.fn().mockRejectedValue(new Error('not transferred'));
    await selectUserCase(req, res, '12234');

    expect(res.redirect).toHaveBeenCalledWith(ErrorPages.NOT_FOUND + languages.WELSH_URL_PARAMETER);
  });
});

describe('get User applications', () => {
  it('should retrieve user cases and return in desired format', () => {
    const userCases: CaseWithId[] = [
      {
        id: '12345',
        state: CaseState.AWAITING_SUBMISSION_TO_HMCTS,
        personalDetailsCheck: YesOrNo.YES,
        employmentAndRespondentCheck: YesOrNo.YES,
        claimDetailsCheck: YesOrNo.YES,
        createdDate: 'September 1, 2022',
        lastModified: 'September 1, 2022',
        submittedDate: { year: '2022', month: '09', day: '01' },
        typeOfClaim: ['discrimination'],
        respondents: [
          {
            respondentName: 'Globo Corp',
          },
          {
            respondentName: 'Mega Globo Corp',
          },
        ],
      },
      {
        id: '123456',
        state: CaseState.AWAITING_SUBMISSION_TO_HMCTS,
        typeOfClaim: ['discrimination'],
        createdDate: 'September 1, 2022',
        lastModified: 'September 1, 2022',
        submittedDate: { year: '2022', month: '09', day: '01' },
      },
      {
        id: '1234567',
        state: CaseState.SUBMITTED,
        createdDate: 'September 1, 2022',
        lastModified: 'September 1, 2022',
        submittedDate: { year: '2022', month: '09', day: '01' },
        typeOfClaim: ['discrimination'],
        ethosCaseReference: '654321/2022',
        respondents: [
          {
            respondentName: 'Globo Corp',
          },
        ],
        et1SubmittedForm: {
          id: '3aa7dfc1-378b-4fa8-9a17-89126fae5673',
          description: 'Test',
          type: 'ET1',
        },
      },
    ];
    const result = getUserApplications(userCases, mockEnglishClaimTypesTranslations, '?lng=en');
    expect(result).toStrictEqual(mockApplications);
  });
});

describe('getOverallStatus', () => {
  const draft = (overrides: Partial<CaseWithId>): CaseWithId =>
    ({ id: '12345', state: CaseState.AWAITING_SUBMISSION_TO_HMCTS, ...overrides } as CaseWithId);

  it('should count four tasks for a claimant making their own claim', () => {
    expect(getOverallStatus(draft({}), mockEnglishClaimTypesTranslations)).toBe('0 of 4 tasks completed');
  });

  it('should count the claimant sections as they are completed', () => {
    const userCase = draft({ personalDetailsCheck: YesOrNo.YES, claimDetailsCheck: YesOrNo.YES });
    expect(getOverallStatus(userCase, mockEnglishClaimTypesTranslations)).toBe('2 of 4 tasks completed');
  });

  it('should count five tasks for a represented claim', () => {
    const userCase = draft({ claimantRepresentedQuestion: YesOrNo.YES });
    expect(getOverallStatus(userCase, mockEnglishClaimTypesTranslations)).toBe('0 of 5 tasks completed');
  });

  it('should count the representative sections as they are completed', () => {
    const userCase = draft({
      claimantRepresentedQuestion: YesOrNo.YES,
      representativeDetailsCheck: YesOrNo.YES,
      representedClaimantDetailsCheck: YesOrNo.YES,
    });
    expect(getOverallStatus(userCase, mockEnglishClaimTypesTranslations)).toBe('2 of 5 tasks completed');
  });

  it('should not count the claimant-only section for a represented claim', () => {
    const userCase = draft({ claimantRepresentedQuestion: YesOrNo.YES, personalDetailsCheck: YesOrNo.YES });
    expect(getOverallStatus(userCase, mockEnglishClaimTypesTranslations)).toBe('0 of 5 tasks completed');
  });

  it('should award the final task once every represented section is complete', () => {
    const userCase = draft({
      claimantRepresentedQuestion: YesOrNo.YES,
      representativeDetailsCheck: YesOrNo.YES,
      representedClaimantDetailsCheck: YesOrNo.YES,
      employmentAndRespondentCheck: YesOrNo.YES,
      claimDetailsCheck: YesOrNo.YES,
    });
    expect(getOverallStatus(userCase, mockEnglishClaimTypesTranslations)).toBe('5 of 5 tasks completed');
  });
});

describe('getRedirectUrl', () => {
  it('should redirect draft claims to the claimant-application page', () => {
    const userCase = { id: '12345', state: CaseState.AWAITING_SUBMISSION_TO_HMCTS } as CaseWithId;
    expect(getRedirectUrl(userCase, '?lng=en')).toBe('/claimant-application/12345?lng=en');
  });

  it('should redirect submitted claims to the citizen-hub by default', () => {
    const userCase = { id: '12345', state: CaseState.SUBMITTED } as CaseWithId;
    expect(getRedirectUrl(userCase, '?lng=en')).toBe('/citizen-hub/12345?lng=en');
  });

  it('should redirect submitted representing claims to the claimant-rep-hub', () => {
    const userCase = { id: '12345', state: CaseState.SUBMITTED } as CaseWithId;
    expect(getRedirectUrl(userCase, '?lng=en', true)).toBe('/claimant-rep-hub/12345?lng=en');
  });

  it('should redirect draft representing claims to the claimant-application page', () => {
    const userCase = { id: '12345', state: CaseState.AWAITING_SUBMISSION_TO_HMCTS } as CaseWithId;
    expect(getRedirectUrl(userCase, '?lng=en', true)).toBe('/claimant-application/12345?lng=en');
  });
});
