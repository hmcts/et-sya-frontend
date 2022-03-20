import PayBeforeTaxController from '../../../main/controllers/PayBeforeTaxController';
import { TranslationKeys } from '../../../main/definitions/constants';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Pay before tax Controller', () => {
  const t = {
    'pay-before-tax': {},
    common: {},
  };

  it('should render pay before tax page', () => {
    const payBeforeTaxController = new PayBeforeTaxController();
    const response = mockResponse();
    const request = mockRequest({ t });

    payBeforeTaxController.get(request, response);
    expect(response.render).toHaveBeenCalledWith(TranslationKeys.PAY_BEFORE_TAX, expect.anything());
  });
});
