import HomeController from '../../../main/controllers/HomeController';
import { setUrlLanguage } from '../../../main/controllers/helpers/LanguageHelper';
import { FEATURE_FLAGS, PageUrls } from '../../../main/definitions/constants';
import { AnyRecord } from '../../../main/definitions/util-types';
import * as LaunchDarkly from '../../../main/modules/featureFlag/launchDarkly';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

const homeController = new HomeController();

describe('Onboarding Controller', () => {
  const t = {
    home: {},
  };

  beforeEach(() => {
    jest.spyOn(LaunchDarkly, 'getFlagValue').mockResolvedValue(true);
  });

  it('should render the onboarding (home) page with eraOctober2026Enabled as true', async () => {
    const response = mockResponse();
    const request = mockRequest({ t });
    const redirectUrl = setUrlLanguage(request, PageUrls.CHECKLIST);
    const returnToExistingUrl = setUrlLanguage(request, PageUrls.RETURN_TO_EXISTING);
    await homeController.get(request, response);

    expect(response.render).toHaveBeenCalledWith('home', {
      ...(<AnyRecord>request.t('home', { returnObjects: true })),
      PageUrls,
      redirectUrl,
      returnToExistingUrl,
      languageParam: '?lng=en',
      eraOctober2026Enabled: true,
    });
  });

  it('should render the onboarding (home) page with eraOctober2026Enabled as false when flag is off', async () => {
    jest.spyOn(LaunchDarkly, 'getFlagValue').mockResolvedValue(false);
    const response = mockResponse();
    const request = mockRequest({ t });
    const redirectUrl = setUrlLanguage(request, PageUrls.CHECKLIST);
    const returnToExistingUrl = setUrlLanguage(request, PageUrls.RETURN_TO_EXISTING);
    await homeController.get(request, response);

    expect(LaunchDarkly.getFlagValue).toHaveBeenCalledWith(FEATURE_FLAGS.ERA_OCTOBER_2026, null);
    expect(response.render).toHaveBeenCalledWith('home', {
      ...(<AnyRecord>request.t('home', { returnObjects: true })),
      PageUrls,
      redirectUrl,
      returnToExistingUrl,
      languageParam: '?lng=en',
      eraOctober2026Enabled: false,
    });
  });
});
