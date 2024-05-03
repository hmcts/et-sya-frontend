import TribunalResponseCYANotSystemUserController from '../../../main/controllers/TribunalResponseCYANotSystemUserController';
import * as LaunchDarkly from '../../../main/modules/featureFlag/launchDarkly';
import tribunalResponseRaw from '../../../main/resources/locales/en/translation/tribunal-response-cya.json';
import { mockRequestWithTranslation } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Tribunal Response CYA for Non system user Controller', () => {
  const translationJsons = { ...tribunalResponseRaw };
  const mockLdClient = jest.spyOn(LaunchDarkly, 'getFlagValue');
  mockLdClient.mockResolvedValue(true);

  it('should render the Check your answers page', async () => {
    const controller = new TribunalResponseCYANotSystemUserController();
    const response = mockResponse();
    const request = mockRequestWithTranslation({}, translationJsons);
    request.session.userCase.selectedRequestOrOrder = { id: '1' };
    await controller.get(request, response);
    // tribunal-response-cya.njk is redirect to contact-the-tribunal-cya.njk
    // So it is valid to display contact-the-tribunal-cya-not-system-user.njk here
    expect(response.render).toHaveBeenCalledWith(
      'contact-the-tribunal-cya-not-system-user',
      expect.objectContaining({
        cancelPage: '/citizen-hub/1234',
        storedUrl: '/tribunalResponseStoreCya?lng=en',
      })
    );
  });

  it('should set isRespondingToRequestOrOrder to true when responding to a request within application', async () => {
    const controller = new TribunalResponseCYANotSystemUserController();
    const response = mockResponse();
    const request = mockRequestWithTranslation({}, translationJsons);
    request.session.userCase.selectedGenericTseApplication = { id: '1' };
    await controller.get(request, response);
    expect(request.session.userCase.isRespondingToRequestOrOrder).toBe(true);
  });
});
