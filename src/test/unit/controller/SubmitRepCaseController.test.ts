import AxiosInstance from 'axios';

import SubmitRepCaseController from '../../../main/controllers/SubmitRepCaseController';
import { PageUrls } from '../../../main/definitions/constants';
import * as ApiFormatter from '../../../main/helper/ApiFormatter';
import { CaseApi } from '../../../main/services/CaseService';
import * as CaseService from '../../../main/services/CaseService';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

jest.mock('axios');
jest.spyOn(ApiFormatter, 'fromApiFormat').mockReturnValue({ id: 'case-123' } as any);

const mockCaseApi = {
  axios: AxiosInstance,
  submitCase: jest.fn(),
};
const caseApi: CaseApi = mockCaseApi as unknown as CaseApi;
jest.spyOn(CaseService, 'getCaseApi').mockReturnValue(caseApi);

describe('SubmitRepCaseController', () => {
  let controller: SubmitRepCaseController;

  beforeEach(() => {
    controller = new SubmitRepCaseController();
    jest.clearAllMocks();
  });

  it('should redirect to CLAIMANT_REP_CLAIM_SUBMITTED on successful submission', async () => {
    const req = mockRequest({});
    const res = mockResponse();
    (caseApi.submitCase as jest.Mock).mockResolvedValue({ data: { id: 'case-123' } });

    await controller.get(req, res);

    expect(res.redirect).toHaveBeenCalledWith(PageUrls.CLAIMANT_REP_CLAIM_SUBMITTED);
    expect(req.session.errors).toEqual([]);
  });

  it('should redirect to CLAIMANT_REP_CHECK_ANSWERS and set error on API failure', async () => {
    const req = mockRequest({});
    const res = mockResponse();
    (caseApi.submitCase as jest.Mock).mockRejectedValue(new Error('API error'));

    await controller.get(req, res);

    expect(res.redirect).toHaveBeenCalledWith(PageUrls.CLAIMANT_REP_CHECK_ANSWERS);
    expect(req.session.errors).toEqual([{ errorType: 'api', propertyName: 'hiddenErrorField' }]);
  });
});
