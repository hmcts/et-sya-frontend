import HomeController from '../../../main/controllers/HomeController';
import { LegacyUrls, PageUrls } from '../../../main/definitions/constants';
import { AnyRecord } from '../../../main/definitions/util-types';
import getLegacyUrl from '../../../main/utils/getLegacyUrlFromLng';
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
    const redirectUrl = getLegacyUrl(LegacyUrls.ET1_APPLY + LegacyUrls.ET1_PATH, request.language);

    homeController.get(request, response);

    expect(response.render).toHaveBeenCalledWith('home', {
      ...(<AnyRecord>request.t('home', { returnObjects: true })),
      PageUrls,
      redirectUrl,
      languageParam: '?lng=en',
    });
  });
});
