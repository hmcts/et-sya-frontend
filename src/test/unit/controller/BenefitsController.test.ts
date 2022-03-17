import BenefitsController from '../../../main/controllers/BenefitsController';
import { TranslationKeys } from '../../../main/definitions/constants';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Benefits Controller', () => {
  const t = {
    benefits: {},
    common: {},
  };

  it('should render benefits page', () => {
    const benefitsController = new BenefitsController();
    const response = mockResponse();
    const request = mockRequest({ t });

    benefitsController.get(request, response);
    expect(response.render).toHaveBeenCalledWith(TranslationKeys.BENEFITS, expect.anything());
  });
});
