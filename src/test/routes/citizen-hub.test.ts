import axios, { AxiosResponse } from 'axios';
import request from 'supertest';

import { CaseApiDataResponse } from '../../main/definitions/api/caseApiResponse';
import { PageUrls } from '../../main/definitions/constants';
import * as LaunchDarkly from '../../main/modules/featureFlag/launchDarkly';
import * as CaseService from '../../main/services/CaseService';
import { CaseApi } from '../../main/services/CaseService';
import { mockApp } from '../unit/mocks/mockApp';

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

describe('GET CITIZEN_HUB', () => {
  const mockLdClient = jest.spyOn(LaunchDarkly, 'getFlagValue');
  mockLdClient.mockResolvedValue(true);
  it('should return the citizen hub page', async () => {
    const res = await request(mockApp({})).get(PageUrls.CITIZEN_HUB.replace(':caseId', '1111222233334444'));

    expect(res.type).toStrictEqual('text/html');
    expect(res.status).toStrictEqual(200);
    expect(caseApi.getUserCase).toHaveBeenCalledWith('1111222233334444');
  });
});
