import CompensationController from '../../../main/controllers/CompensationController';
import { TranslationKeys } from '../../../main/definitions/constants';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Compensation Controller', () => {
  const t = {
    compensation: {},
    common: {},
  };

  it('should render the compensation page', () => {
    const controller = new CompensationController();
    const response = mockResponse();
    const request = mockRequest({ t });
    controller.get(request, response);
    expect(response.render).toHaveBeenCalledWith(TranslationKeys.COMPENSATION, expect.anything());
  });
});
