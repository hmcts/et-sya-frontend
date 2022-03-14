import DesiredClaimOutcomeController from '../../../main/controllers/desired_claim_outcome/DesiredClaimOutcomeController';
import { TranslationKeys } from '../../../main/definitions/constants';
import { FormContent } from '../../../main/definitions/form';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Desired Claim Outcome Controller', () => {
  const t = {
    'desired-claim-outcome': {},
    common: {},
  };

  const mockFormContent = {
    fields: {},
  } as unknown as FormContent;

  it('should render desired claim outcome page', () => {
    const genderDetailsController = new DesiredClaimOutcomeController(mockFormContent);
    const response = mockResponse();
    const request = mockRequest({ t });

    genderDetailsController.get(request, response);
    expect(response.render).toHaveBeenCalledWith(TranslationKeys.DESIRED_CLAIM_OUTCOME, expect.anything());
  });
});
