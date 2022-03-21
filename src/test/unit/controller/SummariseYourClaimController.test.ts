import SummariseYourClaimController from '../../../main/controllers/SummariseYourClaimController';
import { TranslationKeys } from '../../../main/definitions/constants';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Summarise Your Claim Controller', () => {
  const t = {
    'summarise-your-claim': {},
    common: {},
  };

  it('should render summarise your claim page', () => {
    const genderDetailsController = new SummariseYourClaimController();
    const response = mockResponse();
    const request = mockRequest({ t });

    genderDetailsController.get(request, response);
    expect(response.render).toHaveBeenCalledWith(TranslationKeys.SUMMARISE_YOUR_CLAIM, expect.anything());
  });
});
