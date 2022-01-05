import HomeController from '../../../main/controllers/HomeController';
import { Response } from 'express';
import sinon from 'sinon';
import { mockRequest } from '../mocks/mockRequest';

const homeController = new HomeController();

describe('Home Controller', () => {
  const t = {
    home: {},
  };

  it('should render the HomeController page', () => {
    const response = { render: () => '' } as unknown as Response;
    const request = mockRequest(t);

    const responseMock = sinon.mock(response);

    responseMock.expects('render').once().withArgs('home');

    homeController.get(request, response);
    responseMock.verify();
  });
});
