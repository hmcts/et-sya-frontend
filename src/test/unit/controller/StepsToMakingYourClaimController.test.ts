import StepsToMakingYourClaimController from '../../../main/controllers/StepsToMakingYourClaimController';
import { TranslationKeys } from '../../../main/definitions/constants';
import { TypesOfClaim } from '../../../main/definitions/definition';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

const stepsToMakingYourClaimController = new StepsToMakingYourClaimController();

describe('Steps to Making your claim Controller', () => {
  const t = {
    'steps-to-making-your-claim': {},
  };

  it('should render single or multiple claim page', () => {
    const userCase = {
      typeOfClaim: [
        TypesOfClaim.BREACH_OF_CONTRACT,
        TypesOfClaim.DISCRIMINATION,
        TypesOfClaim.OTHER_TYPES,
        TypesOfClaim.PAY_RELATED_CLAIM,
      ],
    };
    const response = mockResponse();
    const request = mockRequest({ userCase, t });

    stepsToMakingYourClaimController.get(request, response);
    expect(response.render).toHaveBeenCalledWith(TranslationKeys.STEPS_TO_MAKING_YOUR_CLAIM, expect.anything());
  });
});
