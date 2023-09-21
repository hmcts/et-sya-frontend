import { nextTick } from 'process';

import axios, { AxiosResponse } from 'axios';

import { storeClaimantTse } from '../../../../main/controllers/helpers/StoreTseCaseHelpers';
import { CaseApiDataResponse } from '../../../../main/definitions/api/caseApiResponse';
import { CaseState } from '../../../../main/definitions/definition';
import { CaseApi } from '../../../../main/services/CaseService';
import * as CaseService from '../../../../main/services/CaseService';
import { mockSession } from '../../mocks/mockApp';
import { mockLogger } from '../../mocks/mockLogger';
import { mockRequest } from '../../mocks/mockRequest';

jest.mock('axios');
const caseApi = new CaseApi(axios as jest.Mocked<typeof axios>);
caseApi.getUserCase = jest.fn().mockResolvedValue(
  Promise.resolve({
    data: {
      created_date: '2022-08-19T09:19:25.79202',
      last_modified: '2022-08-19T09:19:25.817549',
    },
  } as AxiosResponse<CaseApiDataResponse>)
);

const mockClient = jest.spyOn(CaseService, 'getCaseApi');

mockClient.mockReturnValue(caseApi);

describe('handle store application storeClaimantTse', () => {
  it('should successfully store application', () => {
    caseApi.storeClaimantTse = jest.fn().mockResolvedValueOnce(
      Promise.resolve({
        data: {
          created_date: '2022-08-19T09:19:25.79202',
          last_modified: '2022-08-19T09:19:25.817549',
          state: CaseState.SUBMITTED,
          case_data: {},
        },
      } as AxiosResponse<CaseApiDataResponse>)
    );
    const req = mockRequest({ userCase: undefined, session: mockSession([], [], []) });
    storeClaimantTse(req, mockLogger);
    expect(req.session.userCase).toBeDefined();
  });

  it('should catch failure to store application', async () => {
    caseApi.storeClaimantTse = jest.fn().mockRejectedValueOnce({ message: 'test error' });

    const req = mockRequest({ userCase: undefined, session: mockSession([], [], []) });
    storeClaimantTse(req, mockLogger);
    await new Promise(nextTick);

    expect(mockLogger.error).toHaveBeenCalledWith('test error');
  });
});
