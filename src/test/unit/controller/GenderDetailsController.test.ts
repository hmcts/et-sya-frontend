import sinon from 'sinon';
import { mockRequest } from '../mocks/mockRequest';
import GenderDetailsController from '../../../main/controllers/gender_details/GenderDetailsController';
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

    const responseMock = sinon.mock(response);

    responseMock.expects('render').once().withArgs('gender-details');

    genderDetailsController.get(request, response);

    responseMock.verify();
  });
});
