import ClaimSavedController from '../../../main/controllers/claimSavedController';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

const claimSavedController = new ClaimSavedController();

describe('Your Claim Has Been Saved Controller', () => {
  const t = {
    'you-claim-has-been-saved': {},
  };

  it("should render the 'your claim has been saved' page", () => {
    const response = mockResponse();
    const request = mockRequest({ t });

    claimSavedController.get(request, response);

    expect(response.render).toHaveBeenCalledWith('claim-saved', expect.anything());
  });
});
