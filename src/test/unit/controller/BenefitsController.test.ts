import BenefitsController from '../../../main/controllers/benefits/BenefitsController';
import { TranslationKeys } from '../../../main/definitions/constants';
import { FormContent } from '../../../main/definitions/form';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Benefits Controller', () => {
  const t = {
    benefits: {},
    common: {},
  };

  const mockFormContent = {
    fields: {},
  } as unknown as FormContent;

  it('should render benefits page', () => {
    const benefitsController = new BenefitsController(mockFormContent);
    const response = mockResponse();
    const request = mockRequest({ t });

    benefitsController.get(request, response);
    expect(response.render).toHaveBeenCalledWith(TranslationKeys.BENEFITS, expect.anything());
  });
});
