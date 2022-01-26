import sinon from 'sinon';
import { Response } from 'express';
import ClaimSavedController from '../../../main/controllers/claimSavedController';
import { mockRequest } from '../mocks/mockRequest';

const claimSavedController = new ClaimSavedController();

describe('Your Claim Has Been Saved Controller', () => {
  const t = {
    'you-claim-has-been-saved': {},
  };

  it('should render the \'your claim has been saved\' page', () => {
    const response = ({ render: () => '' } as unknown) as Response;
    const request = mockRequest(t);

    const responseMock = sinon.mock(response);

    responseMock
      .expects('render')
      .once()
      .withArgs('claim-saved', request.t('claim-saved', { returnObjects: true }));

    claimSavedController.get(request, response);
    responseMock.verify();
  });
});
