import ClaimTypePayController from '../../../main/controllers/ClaimTypePayController';
import { TranslationKeys } from '../../../main/definitions/constants';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Claim Type Pay Controller', () => {
  const t = {
    'claim-type-pay': {},
    common: {},
  };

  it('should render the claim type pay page', () => {
    const controller = new ClaimTypePayController();
    const response = mockResponse();
    const request = mockRequest({ t });
    controller.get(request, response);
    expect(response.render).toHaveBeenCalledWith(TranslationKeys.CLAIM_TYPE_PAY, expect.anything());
  });
});
