import StoredResponseAppConfirmationController from '../../../main/controllers/StoredResponseAppConfirmationController';
import { Applicant, TranslationKeys } from '../../../main/definitions/constants';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Store application Complete Controller tests', () => {
  const t = {
    'stored-application-confirmation': {},
    common: {},
  };

  it('should render the Store application Complete page', async () => {
    const controller = new StoredResponseAppConfirmationController();
    const response = mockResponse();
    const request = mockRequest({ t });
    request.params.appId = '246';
    request.session.userCase.genericTseApplicationCollection = [
      { id: '246', value: { applicant: Applicant.CLAIMANT } },
    ];

    await controller.get(request, response);

    expect(response.render).toHaveBeenCalledWith(
      TranslationKeys.STORED_APPLICATION_CONFIRMATION,
      expect.objectContaining({
        redirectUrl: '/citizen-hub/1234',
        viewThisCorrespondenceLink: '/application-details/246?lng=en',
      })
    );
  });
});
