import StoredApplicationConfirmationController from '../../../main/controllers/StoredApplicationConfirmationController';
import { Applicant, ErrorPages, TranslationKeys } from '../../../main/definitions/constants';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Store application Complete Controller tests', () => {
  const t = {
    'stored-application-confirmation': {},
    common: {},
  };

  it('should render the Store application Complete page', async () => {
    const controller = new StoredApplicationConfirmationController();
    const response = mockResponse();
    const request = mockRequest({ t });
    request.params.appId = '246';
    request.session.userCase.tseApplicationStoredCollection = [{ id: '246', value: { applicant: Applicant.CLAIMANT } }];

    await controller.get(request, response);

    expect(response.render).toHaveBeenCalledWith(
      TranslationKeys.STORED_APPLICATION_CONFIRMATION,
      expect.objectContaining({
        redirectUrl: '/citizen-hub/1234',
        viewThisCorrespondenceLink: '/application-details/246?lng=en',
        document: undefined,
        documentLink: '',
      })
    );
  });

  it('should return error page for Application ID not found', async () => {
    const controller = new StoredApplicationConfirmationController();
    const response = mockResponse();
    const request = mockRequest({ t });

    await controller.get(request, response);

    expect(response.redirect).toHaveBeenCalledWith(ErrorPages.NOT_FOUND + '?lng=en');
  });

  it('should return error page for Latest application not found', async () => {
    const controller = new StoredApplicationConfirmationController();
    const response = mockResponse();
    const request = mockRequest({ t });
    request.params.appId = '246';

    await controller.get(request, response);

    expect(response.redirect).toHaveBeenCalledWith(ErrorPages.NOT_FOUND + '?lng=en');
  });
});
