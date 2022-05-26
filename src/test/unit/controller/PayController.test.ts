import PayController from '../../../main/controllers/PayController';
import { TranslationKeys } from '../../../main/definitions/constants';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Pay Controller', () => {
  const t = {
    pay: {},
    common: {},
  };

  it('should render pay page', () => {
    const payController = new PayController();
    const response = mockResponse();
    const request = mockRequest({ t });

    payController.get(request, response);
    expect(response.render).toHaveBeenCalledWith(TranslationKeys.PAY, expect.anything());
  });
});
