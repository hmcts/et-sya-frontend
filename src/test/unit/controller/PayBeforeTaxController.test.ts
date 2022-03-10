import PayBeforeTaxController from '../../../main/controllers/pay_before_tax/PayBeforeTaxController';
import { TranslationKeys } from '../../../main/definitions/constants';
import { FormContent } from '../../../main/definitions/form';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Pay before tax Controller', () => {
  const t = {
    'pay-before-tax': {},
    common: {},
  };

  const mockFormContent = {
    fields: {},
  } as unknown as FormContent;

  it('should render pay before tax page', () => {
    const payBeforeTaxController = new PayBeforeTaxController(mockFormContent);
    const response = mockResponse();
    const request = mockRequest({ t });

    payBeforeTaxController.get(request, response);
    expect(response.render).toHaveBeenCalledWith(TranslationKeys.PAY_BEFORE_TAX, expect.anything());
  });
});
