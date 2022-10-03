import axios, { AxiosResponse } from 'axios';

import { CaseApiDataResponse } from '../../../main/definitions/api/caseApiResponse';
import { CaseType, CaseWithId, YesOrNo } from '../../../main/definitions/case';
import { PageUrls } from '../../../main/definitions/constants';
import { CaseState } from '../../../main/definitions/definition';
import {
  getUserApplications,
  getUserCasesByLastModified,
  selectUserCase,
} from '../../../main/services/CaseSelectionService';
import { CaseApi } from '../../../main/services/CaseService';
import * as caseService from '../../../main/services/CaseService';
import { mockApplications } from '../mocks/mockApplications';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

jest.mock('axios');
const getCaseApiClientMock = jest.spyOn(caseService, 'getCaseApi');

describe('Case Selection Service using Case Api', () => {
  const mockApiClient = {
    createCase: jest.fn(),
    getUserCases: jest.fn(),
    downloadClaimPdf: jest.fn(),
    updateDraftCase: jest.fn(),
    getUserCase: jest.fn(),
  };

  afterEach(() => {
    mockApiClient.getUserCases.mockClear();
    mockApiClient.createCase.mockClear();
    mockApiClient.downloadClaimPdf.mockClear();
    mockApiClient.updateDraftCase.mockClear();
    mockApiClient.getUserCase.mockClear();
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
            typeOfClaim: ['discrimination', 'payRelated'],
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
            typeOfClaim: ['discrimination', 'payRelated'],
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
    expect(userCases[0].lastModified).toStrictEqual('February 13, 2019');
    expect(userCases[1].lastModified).toStrictEqual('February 12, 2019');
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

  test('Should hit error block and return empty array', async () => {
    const response = {
      data: [{ invalidData: 1234 }],
      status: 500,
      statusText: '',
    };

    const req = mockRequest({});
    const caseApi = new CaseApi(axios as jest.Mocked<typeof axios>);
    getCaseApiClientMock.mockReturnValue(caseApi);
    caseApi.getUserCases = jest.fn().mockResolvedValue(response);

    const result = await getUserCasesByLastModified(req);

    expect(result).toStrictEqual([]);
  });

  test('Should select User Case and redirect to Claim Steps', async () => {
    const response: AxiosResponse<CaseApiDataResponse> = {
      data: {
        id: '12234',
        state: CaseState.AWAITING_SUBMISSION_TO_HMCTS,
        last_modified: '2019-02-12T14:25:39.015',
        created_date: '2019-02-12T14:25:39.015',
        case_data: {
          caseType: CaseType.SINGLE,
          typeOfClaim: ['discrimination', 'payRelated'],
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
    const res = mockResponse();
    const caseApi = new CaseApi(axios as jest.Mocked<typeof axios>);
    getCaseApiClientMock.mockReturnValue(caseApi);
    caseApi.getUserCase = jest.fn().mockResolvedValue(response);

    await selectUserCase(req, res, '12234');

    expect(res.redirect).toHaveBeenCalledWith(PageUrls.CLAIM_STEPS);
  });

  test('Should redirect to new claim if undefined', async () => {
    const response: AxiosResponse<CaseApiDataResponse> = {
      data: undefined,
      status: 200,
      statusText: '',
      headers: undefined,
      config: undefined,
    };

    const req = mockRequest({});
    const res = mockResponse();
    const caseApi = new CaseApi(axios as jest.Mocked<typeof axios>);
    getCaseApiClientMock.mockReturnValue(caseApi);
    caseApi.getUserCase = jest.fn().mockResolvedValue(response);
    await selectUserCase(req, res, '12234');

    expect(res.redirect).toHaveBeenCalledWith(PageUrls.LIP_OR_REPRESENTATIVE);
  });

  test('Should redirect to new claim if null', async () => {
    const response: AxiosResponse<CaseApiDataResponse> = {
      data: null,
      status: 200,
      statusText: '',
      headers: undefined,
      config: undefined,
    };

    const req = mockRequest({});
    const res = mockResponse();
    const caseApi = new CaseApi(axios as jest.Mocked<typeof axios>);
    getCaseApiClientMock.mockReturnValue(caseApi);
    caseApi.getUserCase = jest.fn().mockResolvedValue(response);
    await selectUserCase(req, res, '12234');

    expect(res.redirect).toHaveBeenCalledWith(PageUrls.LIP_OR_REPRESENTATIVE);
  });

  test('Should redirect to home page on error', async () => {
    const response = {
      data: { invalidData: 'rytrfgb' },
      status: 200,
      statusText: '',
    };

    const req = mockRequest({});
    const res = mockResponse();
    const caseApi = new CaseApi(axios as jest.Mocked<typeof axios>);
    getCaseApiClientMock.mockReturnValue(caseApi);
    caseApi.getUserCase = jest.fn().mockResolvedValue(response);
    await selectUserCase(req, res, '12234');

    expect(res.redirect).toHaveBeenCalledWith(PageUrls.HOME);
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
      },
      {
        id: '1234567',
        state: CaseState.SUBMITTED,
        createdDate: 'September 1, 2022',
        lastModified: 'September 1, 2022',
        typeOfClaim: ['discrimination'],
        respondents: [
          {
            respondentName: 'Globo Corp',
          },
        ],
      },
    ];
    const result = getUserApplications(userCases);
    expect(result).toStrictEqual(mockApplications);
  });
});
