import ClaimSavedController from '../../../main/controllers/ClaimSavedController';
import { PageUrls, languages } from '../../../main/definitions/constants';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

const claimSavedController = new ClaimSavedController();

describe('Your Claim Has Been Saved Controller', () => {
  const t = {
    'claim-saved': {},
  };

  it("should render the 'your claim has been saved' page with correct properties", () => {
    const response = mockResponse();
    const request = mockRequest({ t });

    claimSavedController.get(request, response);

    expect(response.render).toHaveBeenCalledWith(
      'claim-saved',
      expect.objectContaining({
        PageUrls,
        languageParam: languages.ENGLISH_URL_PARAMETER,
      })
    );
  });

  it('should render the claim-saved page with Welsh language param when Welsh URL is used', () => {
    const response = mockResponse();
    const request = mockRequest({ t });
    request.url = '/claim-saved?lng=cy';

    claimSavedController.get(request, response);

    expect(response.render).toHaveBeenCalledWith(
      'claim-saved',
      expect.objectContaining({
        languageParam: languages.WELSH_URL_PARAMETER,
      })
    );
  });
});
