import AxiosInstance, { AxiosResponse } from 'axios';

import { removeClaimantRepresentative } from '../../../../main/controllers/helpers/CaseRoleHelper';
import { CaseApiDataResponse } from '../../../../main/definitions/api/caseApiResponse';
import { AppRequest } from '../../../../main/definitions/appRequest';
import * as CaseService from '../../../../main/services/CaseService';
import { CaseApi } from '../../../../main/services/CaseService';
import { mockRequest } from '../../mocks/mockRequest';

const caseApiMock = {
  axios: AxiosInstance,
  removeClaimantRepresentative: jest.fn(),
};
const caseApi: CaseApi = caseApiMock as unknown as CaseApi;
jest.spyOn(CaseService, 'getCaseApi').mockReturnValue(caseApi);
caseApi.removeClaimantRepresentative = jest.fn().mockResolvedValue(
  Promise.resolve({
    data: {
      id: '1234',
      created_date: '2022-08-19T09:19:25.79202',
      last_modified: '2022-08-19T09:19:25.817549',
    },
  } as AxiosResponse<CaseApiDataResponse>)
);

describe('Case role Helpers', () => {
  it('should return home when no host does not match', async () => {
    const userCase = { id: '1234567890123456' };
    const request = <AppRequest>mockRequest({ userCase });
    request.url = '/some-other-url';
    const actualUrl = await removeClaimantRepresentative(request);
    expect(actualUrl).toEqual('/citizen-hub/1234567890123456?lng=en');
  });
});
