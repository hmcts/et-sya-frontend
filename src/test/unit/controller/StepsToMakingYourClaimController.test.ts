import StepsToMakingYourClaimController from '../../../main/controllers/StepsToMakingYourClaimController';
import { TranslationKeys } from '../../../main/definitions/constants';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

const stepsToMakingYourClaimController = new StepsToMakingYourClaimController();

describe('Steps to Making your claim Controller', () => {
  const t = {
    'steps-to-making-your-claim': {},
  };

  it('should render single or multiple claim page', () => {
    const response = mockResponse();
    const request = mockRequest({ t });

    stepsToMakingYourClaimController.get(request, response);
    expect(response.render).toHaveBeenCalledWith(TranslationKeys.STEPS_TO_MAKING_YOUR_CLAIM, expect.anything());
  });
});
