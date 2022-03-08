import GenderDetailsController from '../../../main/controllers/gender_details/GenderDetailsController';
import { TranslationKeys } from '../../../main/definitions/constants';
import { FormContent } from '../../../main/definitions/form';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Gender Details Controller', () => {
  const t = {
    'gender-details': {},
    common: {},
  };

  const mockFormContent = {
    fields: {},
  } as unknown as FormContent;

  it('should render gender details page', () => {
    const genderDetailsController = new GenderDetailsController(mockFormContent);
    const response = mockResponse();
    const request = mockRequest({ t });

    genderDetailsController.get(request, response);
    expect(response.render).toHaveBeenCalledWith(TranslationKeys.GENDER_DETAILS, expect.anything());
  });
});
