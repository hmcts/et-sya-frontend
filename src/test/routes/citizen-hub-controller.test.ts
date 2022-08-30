import axios, { AxiosResponse } from 'axios';
import request from 'supertest';

import { CaseApiDataResponse } from '../../main/definitions/api/caseApiResponse';
import { PageUrls } from '../../main/definitions/constants';
import * as CaseService from '../../main/services/CaseService';
import { CaseApi } from '../../main/services/CaseService';
import { mockApp } from '../unit/mocks/mockApp';

jest.mock('axios');
const mockClient = jest.spyOn(CaseService, 'getCaseApi');
const caseApi = new CaseApi(axios as jest.Mocked<typeof axios>);

describe(`GET ${PageUrls.CITIZEN_HUB}`, () => {
  beforeAll(() => {
    mockClient.mockReturnValue(caseApi);
    caseApi.getCase = jest.fn().mockResolvedValue(
      Promise.resolve({
        data: {},
      } as AxiosResponse<CaseApiDataResponse>)
    );
  });

  it('should return the citizen hub page', async () => {
    const res = await request(mockApp({})).get(PageUrls.CITIZEN_HUB.replace(':caseId', '1111222233334444'));

    expect(res.type).toStrictEqual('text/html');
    expect(res.status).toStrictEqual(200);
    expect(caseApi.getCase).toBeCalledWith('1111222233334444');
  });
});
