import AxiosInstance from 'axios';

import ClaimantContactDetailsController from '../../../main/controllers/ClaimantContactDetailsController';
import { TranslationKeys } from '../../../main/definitions/constants';
import * as ApiFormatter from '../../../main/helper/ApiFormatter';
import { CaseApi } from '../../../main/services/CaseService';
import * as CaseService from '../../../main/services/CaseService';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

jest.mock('axios');

const mockCaseApi = {
  axios: AxiosInstance,
  getUserCase: jest.fn(),
};
const caseApi: CaseApi = mockCaseApi as unknown as CaseApi;

describe('ClaimantContactDetailsController', () => {
  let controller: ClaimantContactDetailsController;

  beforeEach(() => {
    controller = new ClaimantContactDetailsController();
    jest.clearAllMocks();
    jest.spyOn(CaseService, 'getCaseApi').mockReturnValue(caseApi);
    jest.spyOn(ApiFormatter, 'fromApiFormat').mockReturnValue({
      id: 'case-123',
      representedClaimantFirstName: 'Jane',
      representedClaimantLastName: 'Doe',
    } as never);
  });

  it('should render the read-only claimant contact details page with detail rows', async () => {
    const req = mockRequest({});
    const res = mockResponse();
    req.params = { caseId: 'case-123' };
    (caseApi.getUserCase as jest.Mock).mockResolvedValue({ data: { id: 'case-123' } });

    await controller.get(req, res);

    expect(res.render).toHaveBeenCalledWith(
      TranslationKeys.CLAIMANT_CONTACT_DETAILS,
      expect.objectContaining({ contactDetails: expect.any(Array), hideContactUs: true })
    );
  });

  it('should redirect to /not-found when the case cannot be loaded', async () => {
    const req = mockRequest({});
    const res = mockResponse();
    req.params = { caseId: 'case-123' };
    (caseApi.getUserCase as jest.Mock).mockRejectedValue(new Error('Not found'));

    await controller.get(req, res);

    expect(res.redirect).toHaveBeenCalledWith('/not-found');
    expect(res.render).not.toHaveBeenCalled();
  });
});
