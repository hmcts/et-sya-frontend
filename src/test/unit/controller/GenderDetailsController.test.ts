import GenderDetailsController from '../../../main/controllers/gender_details/GenderDetailsController';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

const genderDetailsController = new GenderDetailsController();

describe('Gender Details Controller', () => {
  const t = {
    'gender-details': {},
    common: {},
  };

  it('should render gender details page', () => {
    const response = mockResponse();
    const request = mockRequest({ t });

    genderDetailsController.get(request, response);

    expect(response.render).toHaveBeenCalledWith('gender-details', expect.anything());
  });
});
