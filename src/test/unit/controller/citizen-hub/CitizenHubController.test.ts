import { nextTick } from 'process';

import axios, { AxiosResponse } from 'axios';

import CitizenHubController from '../../../../main/controllers/citizen-hub/CitizenHubController';
import { getAllClaimantApplications } from '../../../../main/controllers/helpers/CitizenHubHelper';
import { CaseApiDataResponse } from '../../../../main/definitions/api/caseApiResponse';
import { Applicant } from '../../../../main/definitions/constants';
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

const OLD_ENV = process.env;

describe('Citizen Hub Controller', () => {
  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV };
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
    controller.get(req, res);
    await new Promise(nextTick);
    expect(res.redirect).toHaveBeenCalledWith('/not-found');
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
