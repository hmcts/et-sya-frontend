import { nextTick } from 'process';

import axios, { AxiosResponse } from 'axios';

import CitizenHubController from '../../../../main/controllers/citizen-hub/CitizenHubController';
import { getAllClaimantApplications } from '../../../../main/controllers/helpers/CitizenHubHelper';
import { CaseApiDataResponse } from '../../../../main/definitions/api/caseApiResponse';
import { CaseTransferInfoResponse } from '../../../../main/definitions/api/caseTransferInfoResponse';
import { Applicant, ErrorPages, PageUrls } from '../../../../main/definitions/constants';
import * as LaunchDarkly from '../../../../main/modules/featureFlag/launchDarkly';
import { CaseApi } from '../../../../main/services/CaseService';
import * as CaseService from '../../../../main/services/CaseService';
import { mockRequest } from '../../mocks/mockRequest';
import { mockResponse } from '../../mocks/mockResponse';

jest.mock('axios');
const caseApi = new CaseApi(axios as jest.Mocked<typeof axios>);

const mockClient = jest.spyOn(CaseService, 'getCaseApi');
mockClient.mockReturnValue(caseApi);
caseApi.getUserCase = jest.fn().mockResolvedValue(
  Promise.resolve({
    data: {
      created_date: '2022-08-19T09:19:25.79202',
      last_modified: '2022-08-19T09:19:25.817549',
    },
  } as AxiosResponse<CaseApiDataResponse>)
);
caseApi.getCaseTransferInfo = jest.fn();

const OLD_ENV = process.env;

describe('Citizen Hub Controller', () => {
  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV };
    caseApi.getCaseTransferInfo = jest.fn().mockRejectedValue(new Error('not transferred'));
  });
  afterAll(() => {
    process.env = OLD_ENV;
  });
  const mockLdClient = jest.spyOn(LaunchDarkly, 'getFlagValue');
  mockLdClient.mockResolvedValue(true);

  it('should redirect to not found with request.url when case api fails', async () => {
    const controller = new CitizenHubController();
    caseApi.getUserCase = jest.fn().mockRejectedValueOnce('error');
    const res = mockResponse();
    const req = mockRequest({});
    req.params.caseId = '1234';
    controller.get(req, res);
    await new Promise(nextTick);
    expect(caseApi.getCaseTransferInfo).not.toHaveBeenCalled();
    expect(res.redirect).toHaveBeenCalledWith(ErrorPages.NOT_FOUND + '?lng=en');
  });

  it('should redirect to not found without checking transfer info when case api fails with a server error', async () => {
    const controller = new CitizenHubController();
    caseApi.getUserCase = jest
      .fn()
      .mockRejectedValueOnce(new Error('Error getting user case: Request failed with status code 500'));
    const res = mockResponse();
    const req = mockRequest({});
    req.params.caseId = '1234';
    req.url = PageUrls.CITIZEN_HUB.replace(':caseId', '1234');
    controller.get(req, res);
    await new Promise(nextTick);
    expect(caseApi.getCaseTransferInfo).not.toHaveBeenCalled();
    expect(res.redirect).toHaveBeenCalledWith(ErrorPages.NOT_FOUND + '?lng=en');
  });

  it('should redirect to transferred page with case id when transfer info is available', async () => {
    const controller = new CitizenHubController();
    caseApi.getUserCase = jest
      .fn()
      .mockRejectedValueOnce(
        new Error('Error getting user case: Request failed with status code 404, CaseNotFoundException')
      );
    caseApi.getCaseTransferInfo = jest.fn().mockResolvedValueOnce({
      data: {
        transferred: true,
        transferType: 'ECM',
        originalCaseId: '1234',
        originalEthosCaseReference: '60000001/2022',
        newEthosCaseReference: '18850001/2020',
        transferComplete: true,
      } as CaseTransferInfoResponse,
    });
    const res = mockResponse();
    const req = mockRequest({});
    req.params.caseId = '1234';
    req.url = PageUrls.CITIZEN_HUB.replace(':caseId', '1234');
    controller.get(req, res);
    await new Promise(nextTick);
    expect(req.session.caseTransferInfo?.originalEthosCaseReference).toBe('60000001/2022');
    expect(res.redirect).toHaveBeenCalledWith(`${PageUrls.TRANSFERRED_CASE}?lng=en&caseId=1234`);
  });

  it('should render citizen hub when case loads successfully even if transfer info says transferred', async () => {
    const controller = new CitizenHubController();
    caseApi.getUserCase = jest.fn().mockResolvedValueOnce({
      data: {
        id: '1234',
        created_date: '2022-08-19T09:19:25.79202',
        last_modified: '2022-08-19T09:19:25.817549',
      },
    });
    caseApi.getCaseTransferInfo = jest.fn().mockResolvedValueOnce({
      data: {
        transferred: true,
        transferType: 'ECM',
        originalCaseId: '1234',
        originalEthosCaseReference: '60000001/2022',
        transferComplete: false,
      } as CaseTransferInfoResponse,
    });
    const res = mockResponse();
    const req = mockRequest({});
    req.params.caseId = '1234';
    req.url = PageUrls.CITIZEN_HUB.replace(':caseId', '1234');
    controller.get(req, res);
    await new Promise(nextTick);
    expect(caseApi.getCaseTransferInfo).not.toHaveBeenCalled();
    expect(res.redirect).not.toHaveBeenCalledWith(`${PageUrls.TRANSFERRED_CASE}?lng=en&caseId=1234`);
    expect(res.render).toHaveBeenCalled();
  });

  it('should redirect to transferred page when case is transferred to ECM', async () => {
    const controller = new CitizenHubController();
    caseApi.getUserCase = jest
      .fn()
      .mockRejectedValueOnce(
        new Error('Error getting user case: Request failed with status code 404, CaseNotFoundException')
      );
    caseApi.getCaseTransferInfo = jest.fn().mockResolvedValueOnce({
      data: {
        transferred: true,
        transferType: 'ECM',
        originalCaseId: '1234',
        transferComplete: false,
      } as CaseTransferInfoResponse,
    });
    const res = mockResponse();
    const req = mockRequest({});
    req.params.caseId = '1234';
    req.url = PageUrls.CITIZEN_HUB.replace(':caseId', '1234');
    controller.get(req, res);
    await new Promise(nextTick);
    expect(res.redirect).toHaveBeenCalledWith(`${PageUrls.TRANSFERRED_CASE}?lng=en&caseId=1234`);
  });

  it('should redirect to transferred page when case is not found in CCD', async () => {
    const controller = new CitizenHubController();
    caseApi.getUserCase = jest
      .fn()
      .mockRejectedValueOnce(
        new Error(
          'Error getting user case: Request failed with status code 404, [404 Not Found] CaseNotFoundException: No case found'
        )
      );
    caseApi.getCaseTransferInfo = jest.fn().mockResolvedValueOnce({
      data: {
        transferred: true,
        transferType: 'ECM',
        originalCaseId: '1234',
        transferComplete: false,
      } as CaseTransferInfoResponse,
    });
    const res = mockResponse();
    const req = mockRequest({});
    req.params.caseId = '1234';
    req.url = PageUrls.CITIZEN_HUB.replace(':caseId', '1234');
    controller.get(req, res);
    await new Promise(nextTick);
    expect(res.redirect).toHaveBeenCalledWith(`${PageUrls.TRANSFERRED_CASE}?lng=en&caseId=1234`);
  });

  it('should redirect to not found when transfer-info says case is not transferred', async () => {
    const controller = new CitizenHubController();
    caseApi.getUserCase = jest
      .fn()
      .mockRejectedValueOnce(
        new Error('Error getting user case: Request failed with status code 404, CaseNotFoundException')
      );
    caseApi.getCaseTransferInfo = jest.fn().mockResolvedValueOnce({
      data: {
        transferred: false,
        transferType: 'ECM',
        transferComplete: false,
      } as CaseTransferInfoResponse,
    });
    const res = mockResponse();
    const req = mockRequest({});
    req.params.caseId = '1234';
    req.url = PageUrls.CITIZEN_HUB.replace(':caseId', '1234');
    controller.get(req, res);
    await new Promise(nextTick);
    expect(res.redirect).toHaveBeenCalledWith(ErrorPages.NOT_FOUND + '?lng=en');
  });

  it('should assign mock user when in test', async () => {
    const controller = new CitizenHubController();
    caseApi.getUserCase = jest.fn().mockResolvedValue(
      Promise.resolve({
        data: {
          created_date: '2022-08-19T09:19:25.79202',
          last_modified: '2022-08-19T09:19:25.817549',
        },
      } as AxiosResponse<CaseApiDataResponse>)
    );
    const res = mockResponse();
    const req = mockRequest({});
    req.params.caseId = 'a11y';
    process.env.IN_TEST = 'true';
    controller.get(req, res);
    await new Promise(nextTick);
    expect(req.session.userCase).toBeDefined();
  });
});

describe('filterClaimantApplications', () => {
  const req = mockRequest({});
  const userCase = req.session.userCase;

  test('should filter claimant applications correctly', () => {
    const genericTseApplicationCollection = [
      { value: { applicant: Applicant.CLAIMANT } },
      { value: { applicant: Applicant.RESPONDENT } },
      { value: { applicant: Applicant.ADMIN } },
      { value: { applicant: Applicant.CLAIMANT } },
    ];

    userCase.genericTseApplicationCollection = genericTseApplicationCollection;
    const result = getAllClaimantApplications(userCase);

    expect(result).toHaveLength(2);
    expect(result[0].value.applicant).toBe(Applicant.CLAIMANT);
    expect(result[1].value.applicant).toBe(Applicant.CLAIMANT);
  });

  test('should return an empty array when no claimant applications found', () => {
    const genericTseApplicationCollection = [
      { value: { applicant: Applicant.RESPONDENT } },
      { value: { applicant: Applicant.ADMIN } },
    ];

    userCase.genericTseApplicationCollection = genericTseApplicationCollection;
    const result = getAllClaimantApplications(userCase);

    expect(result).toHaveLength(0);
  });
});
