import ContactTheTribunalCYANotSystemUserController from '../../../main/controllers/ContactTheTribunalCYANotSystemUserController';
import { ErrorPages } from '../../../main/definitions/constants';
import * as LaunchDarkly from '../../../main/modules/featureFlag/launchDarkly';
import contactTheTribunalCyaRaw from '../../../main/resources/locales/en/translation/contact-the-tribunal-cya.json';
import contactTheTribunalRaw from '../../../main/resources/locales/en/translation/contact-the-tribunal.json';
import { mockRequestWithTranslation } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Tribunal Response CYA for Non system user Controller', () => {
  const translationJsons = { ...contactTheTribunalRaw, ...contactTheTribunalCyaRaw };
  const mockLdClient = jest.spyOn(LaunchDarkly, 'getFlagValue');
  mockLdClient.mockResolvedValue(true);

  it('should render the Check your answers page', async () => {
    const controller = new ContactTheTribunalCYANotSystemUserController();
    const response = mockResponse();
    const request = mockRequestWithTranslation({}, translationJsons);
    request.session.userCase.selectedRequestOrOrder = { id: '1' };
    request.session.userCase.contactApplicationType = 'withdraw';

    await controller.get(request, response);

    expect(response.render).toHaveBeenCalledWith(
      'contact-the-tribunal-cya-not-system-user',
      expect.objectContaining({
        cancelPage: '/citizen-hub/1234',
        storedUrl: '/storeTribunalCya?lng=en',
      })
    );
  });

  it('should return error page when Selected application not found', async () => {
    const controller = new ContactTheTribunalCYANotSystemUserController();
    const response = mockResponse();
    const request = mockRequestWithTranslation({}, translationJsons);

    await controller.get(request, response);

    expect(response.redirect).toHaveBeenCalledWith(ErrorPages.NOT_FOUND + '?lng=en');
  });
});
