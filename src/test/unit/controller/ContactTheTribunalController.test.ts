import ContactTheTribunalController from '../../../main/controllers/ContactTheTribunalController';
import { TranslationKeys } from '../../../main/definitions/constants';
import contactTheTribunal from '../../../main/resources/locales/en/translation/contact-the-tribunal.json';
import { mockRequestWithTranslation } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Contact Application Controller', () => {
  it('should render contact application page', () => {
    const controller = new ContactTheTribunalController();
    const response = mockResponse();
    const request = mockRequestWithTranslation({}, contactTheTribunal);

    controller.get(request, response);
    expect(response.render).toHaveBeenCalledWith(TranslationKeys.CONTACT_THE_TRIBUNAL, expect.anything());
  });
});
