import PayAfterTaxController from '../../../main/controllers/pay_after_tax/PayAfterTaxController';
import { StillWorking } from '../../../main/definitions/case';
import { TranslationKeys } from '../../../main/definitions/constants';
import { FormContent } from '../../../main/definitions/form';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Pay after tax Controller', () => {
  const mockFormContent = {
    fields: {},
  } as unknown as FormContent;

  const userCase = {
    isStillWorking: StillWorking.WORKING,
  };

  it('should render pay after tax page', () => {
    const payAfterTaxController = new PayAfterTaxController(mockFormContent);
    const response = mockResponse();
    const request = mockRequest({ userCase });

    payAfterTaxController.get(request, response);
    expect(response.render).toHaveBeenCalledWith(TranslationKeys.PAY_AFTER_TAX, expect.anything());
  });
});
