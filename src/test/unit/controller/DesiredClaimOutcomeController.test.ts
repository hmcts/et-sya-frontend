import DesiredClaimOutcomeController from '../../../main/controllers/DesiredClaimOutcomeController';
import { TranslationKeys } from '../../../main/definitions/constants';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Desired Claim Outcome Controller', () => {
  const t = {
    'desired-claim-outcome': {},
    common: {},
  };

  it('should render desired claim outcome page', () => {
    const genderDetailsController = new DesiredClaimOutcomeController();
    const response = mockResponse();
    const request = mockRequest({ t });

    genderDetailsController.get(request, response);
    expect(response.render).toHaveBeenCalledWith(TranslationKeys.DESIRED_CLAIM_OUTCOME, expect.anything());
  });
});
