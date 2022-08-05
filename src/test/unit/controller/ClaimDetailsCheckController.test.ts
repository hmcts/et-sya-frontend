import ClaimDetailsCheckController from '../../../main/controllers/ClaimDetailsCheckController';
import { TranslationKeys } from '../../../main/definitions/constants';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Test claim details check controller', () => {
  const t = {
    claimDetailsCheck: {},
    common: {},
  };

  it('should render the claim details check page', () => {
    const controller = new ClaimDetailsCheckController();
    const response = mockResponse();
    const request = mockRequest({ t });
    controller.get(request, response);
    expect(response.render).toHaveBeenCalledWith(TranslationKeys.CLAIM_DETAILS_CHECK, expect.anything());
  });

  describe('Correct validation', () => {
    it('should require claimDetailsCheck', () => {
      const req = mockRequest({ body: {} });
      new ClaimDetailsCheckController().post(req, mockResponse());

      expect(req.session.errors).toEqual([{ propertyName: 'claimDetailsCheck', errorType: 'required' }]);
    });
  });
});
