import sinon from 'sinon';
import { Response } from 'express';
import HomeController from '../../../main/controllers/HomeController';
import { mockRequest } from '../mocks/mockRequest';

const homeController = new HomeController();

describe('Onboarding Controller', () => {
  const t = {
    home: {},
  };

  it('should render the onboarding (home) page', () => {
    const response = { render: () => '' } as unknown as Response;
    const request = mockRequest({ t });
    const responseMock = sinon.mock(response);
    responseMock.expects('render').once().withArgs('home', request.t('home', { returnObjects: true }));
    homeController.get(request, response);
    responseMock.verify();
  });
});