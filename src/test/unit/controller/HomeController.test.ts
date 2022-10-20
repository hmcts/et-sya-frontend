import HomeController from '../../../main/controllers/HomeController';
import { setUrlLanguage } from '../../../main/controllers/helpers/LanguageHelper';
import { PageUrls } from '../../../main/definitions/constants';
import { AnyRecord } from '../../../main/definitions/util-types';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

const homeController = new HomeController();

describe('Onboarding Controller', () => {
  const t = {
    home: {},
  };

  it('should render the onboarding (home) page', () => {
    const response = mockResponse();
    const request = mockRequest({ t });
    const redirectUrl = setUrlLanguage(request, PageUrls.CHECKLIST);
    homeController.get(request, response);

    expect(response.render).toHaveBeenCalledWith('home', {
      ...(<AnyRecord>request.t('home', { returnObjects: true })),
      redirectUrl,
    });
  });
});
