import NewAccountLandingController from '../../../main/controllers/new_account_landing/NewAccountLandingController';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

const newAccountLandingController = new NewAccountLandingController();

describe('New Account Landing Controller', () => {
  const t = {
    'new-account-landing': {},
  };

  it('should render the new account landing page', () => {
    const response = mockResponse();
    const request = mockRequest({ t });

    newAccountLandingController.get(request, response);

    expect(response.render).toHaveBeenCalledWith('new-account-landing', expect.anything());
  });
});
