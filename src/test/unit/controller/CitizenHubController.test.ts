import { nextTick } from 'process';

import axios, { AxiosResponse } from 'axios';

import CitizenHubController from '../../../main/controllers/CitizenHubController';
import { CaseApiDataResponse } from '../../../main/definitions/api/caseApiResponse';
import { CaseApi } from '../../../main/services/CaseService';
import * as CaseService from '../../../main/services/CaseService';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

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

describe('Citizen Hub Controller', () => {
  it('should redirect to not found with request.url when case api fails', async () => {
    const controller = new CitizenHubController();
    caseApi.getUserCase = jest.fn().mockRejectedValueOnce('error');
    const res = mockResponse();
    const req = mockRequest({});
    controller.get(req, res);
    await new Promise(nextTick);
    expect(res.redirect).toHaveBeenCalledWith('/not-found');
  });
});
