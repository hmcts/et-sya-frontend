import PayAfterTaxController from '../../../main/controllers/PayAfterTaxController';
import { TranslationKeys } from '../../../main/definitions/constants';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Pay after tax Controller', () => {
  const t = {
    'pay-after-tax': {},
    common: {},
  };

  it('should render pay after tax page', () => {
    const payAfterTaxController = new PayAfterTaxController();
    const response = mockResponse();
    const request = mockRequest({ t });

    payAfterTaxController.get(request, response);
    expect(response.render).toHaveBeenCalledWith(TranslationKeys.PAY_AFTER_TAX, expect.anything());
  });
});
