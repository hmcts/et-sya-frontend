import sinon from 'sinon';
import { Response } from 'express';
import OnboardingController from '../../../main/controllers/OnboardingController';
import { mockRequest } from '../mocks/mockRequest';

const onboardingController = new OnboardingController();

describe('Onboarding Controller', () => {
  const t = {
    onboarding: {},
  };

  it('should render onboarding page', () => {
    const response = ({ render: () => '' } as unknown) as Response;
    const request = mockRequest(t);

    const responseMock = sinon.mock(response);

    responseMock
      .expects('render')
      .once()
      .withArgs('onboarding', request.t('onboarding', { returnObjects: true }));

    onboardingController.get(request, response);
    responseMock.verify();
  });
});
