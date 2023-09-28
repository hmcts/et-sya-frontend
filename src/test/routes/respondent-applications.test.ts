import axios, { AxiosResponse } from 'axios';
import request from 'supertest';

import { CaseApiDataResponse } from '../../main/definitions/api/caseApiResponse';
import { PageUrls } from '../../main/definitions/constants';
import * as LaunchDarkly from '../../main/modules/featureFlag/launchDarkly';
import { CaseApi } from '../../main/services/CaseService';
import * as CaseService from '../../main/services/CaseService';
import { mockApp } from '../unit/mocks/mockApp';

const pageUrl = PageUrls.RESPONDENT_APPLICATIONS;

describe(`GET ${pageUrl}`, () => {
  const mockLdClient = jest.spyOn(LaunchDarkly, 'getFlagValue');
  mockLdClient.mockResolvedValue(true);
  it('should return the respondent applications page', async () => {
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

    const res = await request(mockApp({})).get(pageUrl);
    expect(res.type).toStrictEqual('text/html');
    expect(res.status).toStrictEqual(200);
  });
});
