import sinon from 'sinon';
import NewAccountLandingController from '../../../main/controllers/NewAccountLandingController';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

const newAccountLandingController = new NewAccountLandingController();

describe('New Account Landing Controller', () => {
  const t = {
    'new-account-landing': {},
  };

  it('should render the new account landing page', () => {
    const response = mockResponse();
    const request = mockRequest(t);
    const responseMock = sinon.mock(response);
    responseMock.expects('render').once().withArgs('new-account-landing', request.t('new-account-landing', { returnObjects: true }));
    newAccountLandingController.get(request, response);
    responseMock.verify();
  });
});