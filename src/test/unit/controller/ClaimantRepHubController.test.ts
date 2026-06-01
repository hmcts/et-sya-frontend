import AxiosInstance from 'axios';

import ClaimantRepHubController from '../../../main/controllers/ClaimantRepHubController';
import { PageUrls, TranslationKeys } from '../../../main/definitions/constants';
import * as ApiFormatter from '../../../main/helper/ApiFormatter';
import { CaseApi } from '../../../main/services/CaseService';
import * as CaseService from '../../../main/services/CaseService';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

jest.mock('axios');
jest.spyOn(ApiFormatter, 'fromApiFormat').mockReturnValue({ id: 'case-123' } as any);

const mockCaseApi = {
  axios: AxiosInstance,
  getUserCase: jest.fn(),
};
const caseApi: CaseApi = mockCaseApi as unknown as CaseApi;
jest.spyOn(CaseService, 'getCaseApi').mockReturnValue(caseApi);

describe('ClaimantRepHubController', () => {
  let controller: ClaimantRepHubController;

  beforeEach(() => {
    controller = new ClaimantRepHubController();
    jest.clearAllMocks();
  });

  it('should render the claimant rep hub page on successful case load', async () => {
    const req = mockRequest({});
    const res = mockResponse();
    req.params = { caseId: 'case-123' };
    (caseApi.getUserCase as jest.Mock).mockResolvedValue({ data: { id: 'case-123' } });

    await controller.get(req, res);

    expect(res.render).toHaveBeenCalledWith(TranslationKeys.CLAIMANT_REP_HUB, expect.anything());
  });

  it('should redirect to CLAIMANT_APPLICATIONS when case load fails', async () => {
    const req = mockRequest({});
    const res = mockResponse();
    req.params = { caseId: 'case-123' };
    (caseApi.getUserCase as jest.Mock).mockRejectedValue(new Error('Not found'));

    await controller.get(req, res);

    expect(res.redirect).toHaveBeenCalledWith(PageUrls.CLAIMANT_APPLICATIONS);
  });
});
