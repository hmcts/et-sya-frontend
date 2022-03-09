import PayAfterTaxController from '../../../main/controllers/pay_after_tax/PayAfterTaxController';
import { TranslationKeys } from '../../../main/definitions/constants';
import { FormContent } from '../../../main/definitions/form';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Pay after tax Controller', () => {
  const t = {
    'pay-after-tax': {},
    common: {},
  };

  const mockFormContent = {
    fields: {},
  } as unknown as FormContent;

  it('should render pay after tax page', () => {
    const payAfterTaxController = new PayAfterTaxController(mockFormContent);
    const response = mockResponse();
    const request = mockRequest({ t });

    payAfterTaxController.get(request, response);
    expect(response.render).toHaveBeenCalledWith(TranslationKeys.PAY_AFTER_TAX, expect.anything());
  });
});
