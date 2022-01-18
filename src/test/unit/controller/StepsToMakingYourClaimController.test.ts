import sinon from 'sinon';
import { Response } from 'express';
import StepsToMakingYourClaimController from '../../../main/controllers/StepsToMakingYourClaimController';
import { mockRequest } from '../mocks/mockRequest';

const stepsToMakingYourClaimController = new StepsToMakingYourClaimController();

describe('Steps to Making your claim Controller', () => {
  const t = {
    'steps-to-making-your-claim': {},
  };

  it('should render single or multiple claim page', () => {
    const response = ({ render: () => '' } as unknown) as Response;
    const request = mockRequest(t);

    const responseMock = sinon.mock(response);

    responseMock
      .expects('render')
      .once()
      .withArgs('steps-to-making-your-claim', request.t('steps-to-making-your-claim', { returnObjects: true }));

    stepsToMakingYourClaimController.get(request, response);
    responseMock.verify();
  });
});
