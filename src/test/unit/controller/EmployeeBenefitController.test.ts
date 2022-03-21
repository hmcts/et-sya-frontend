import employeeBenefitController from '../../../main/controllers/employee_benefit/employeeBenefitController';
import { TranslationKeys } from '../../../main/definitions/constants';
import { FormContent } from '../../../main/definitions/form';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Employee benefit controller', () => {
  const t = {
    'employee-benefit': {},
    common: {},
  };

  const mockFormContent = {
    fields: {},
  } as unknown as FormContent;

  it('should render employee benefit page', () => {
    const employeeBenefitControllers = new employeeBenefitController(mockFormContent);
    const response = mockResponse();
    const request = mockRequest({ t });

    employeeBenefitControllers.get(request, response);
    expect(response.render).toHaveBeenCalledWith(TranslationKeys.EMPLOYEE_BENEFITS, expect.anything());
  });
});
