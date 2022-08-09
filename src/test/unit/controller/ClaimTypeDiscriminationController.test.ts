import ClaimTypeDiscriminationController from '../../../main/controllers/ClaimTypeDiscriminationController';
import { TranslationKeys } from '../../../main/definitions/constants';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Claim Type Discrimination Controller', () => {
  const t = {
    'claim-type-discrimination': {},
    common: {},
  };

  it('should render the claim type discrimination page', () => {
    const controller = new ClaimTypeDiscriminationController();
    const response = mockResponse();
    const request = mockRequest({ t });
    controller.get(request, response);
    expect(response.render).toHaveBeenCalledWith(TranslationKeys.CLAIM_TYPE_DISCRIMINATION, expect.anything());
  });
});
