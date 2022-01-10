import sinon from 'sinon';
import { Response } from 'express';
import SingleOrMultipleController from '../../../main/controllers/SingleOrMultipleController';
import { mockRequest } from '../mocks/mockRequest';

const singleOrMultipleController = new SingleOrMultipleController();

describe('Single or Multiple Claim Controller', () => {
  const t = {
    'single-or-multiple-claim': {},
  };

  it('should render single or multiple claim page', () => {
    const response = ({ render: () => '' } as unknown) as Response;
    const request = mockRequest(t);

    const responseMock = sinon.mock(response);

    responseMock
      .expects('render')
      .once()
      .withArgs('single-or-multiple-claim', request.t('single-or-multiple-claim', { returnObjects: true }));

    singleOrMultipleController.get(request, response);
    responseMock.verify();
  });
});
