import ContactTheTribunalController from '../../../main/controllers/ContactTheTribunalController';
import { TranslationKeys } from '../../../main/definitions/constants';
import * as LaunchDarkly from '../../../main/modules/featureFlag/launchDarkly';
import contactTheTribunal from '../../../main/resources/locales/en/translation/contact-the-tribunal.json';
import { mockRequestWithTranslation } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Contact Application Controller', () => {
  const mockLdClient = jest.spyOn(LaunchDarkly, 'getFlagValue');
  mockLdClient.mockResolvedValue(true);

  it('should render contact application page', async () => {
    const controller = new ContactTheTribunalController();
    const response = mockResponse();
    const request = mockRequestWithTranslation({}, contactTheTribunal);

    await controller.get(request, response);
    expect(response.render).toHaveBeenCalledWith(TranslationKeys.CONTACT_THE_TRIBUNAL, expect.anything());
  });
});
