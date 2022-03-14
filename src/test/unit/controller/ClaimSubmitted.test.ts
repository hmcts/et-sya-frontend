import ClaimSubmittedController from '../../../main/controllers/ClaimSubmittedController';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Claim Submitted Controller', () => {
  const t = {
    'claim-submitted': {},
    common: {},
  };

  it('should render the Claim Submitted page', () => {
    const controller = new ClaimSubmittedController();
    const response = mockResponse();
    const request = mockRequest({ t });
    controller.get(request, response);
    expect(response.render).toHaveBeenCalledWith('claim-submitted', expect.anything());
  });
});
