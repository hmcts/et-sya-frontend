import StoredResponseTribunalConfirmationController from '../../../main/controllers/StoredResponseTribunalConfirmationController';
import { ErrorPages, TranslationKeys } from '../../../main/definitions/constants';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Store response to Tribunal Order Complete Controller tests', () => {
  const t = {
    'stored-application-confirmation': {},
    common: {},
  };

  it('should render the Store application Complete page', async () => {
    const controller = new StoredResponseTribunalConfirmationController();
    const response = mockResponse();
    const request = mockRequest({ t });
    request.params.orderId = '246';

    await controller.get(request, response);

    expect(response.render).toHaveBeenCalledWith(
      TranslationKeys.STORED_APPLICATION_CONFIRMATION,
      expect.objectContaining({
        redirectUrl: '/citizen-hub/1234',
        viewThisCorrespondenceLink: '/notification-details/246?lng=en',
      })
    );
  });

  it('should return error page when orderId missing', async () => {
    const controller = new StoredResponseTribunalConfirmationController();
    const response = mockResponse();
    const request = mockRequest({ t });

    await controller.get(request, response);

    expect(response.redirect).toHaveBeenCalledWith(ErrorPages.NOT_FOUND + '?lng=en');
  });
});
