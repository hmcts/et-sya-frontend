import CookiePreferencesController from '../../../main/controllers/CookiePreferencesController';
import { TranslationKeys } from '../../../main/definitions/constants';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

const cookiePreferencesController = new CookiePreferencesController();

describe('Cookie preferences controller', () => {
  const t = {
    'cookie-preferences': {},
  };

  it('should render the cookie preferences page', () => {
    const response = mockResponse();
    const request = mockRequest({ t });

    cookiePreferencesController.get(request, response);

    expect(response.render).toHaveBeenCalledWith(TranslationKeys.COOKIE_PREFERENCES, expect.anything());
  });
});
