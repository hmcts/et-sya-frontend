import {
  getLanguageCode,
  getLanguageParam,
  returnSafeRedirectUrl,
} from '../../../../main/controllers/helpers/RouterHelpers';
import * as routerHelpers from '../../../../main/controllers/helpers/RouterHelpers';
import { PageUrls, languages } from '../../../../main/definitions/constants';
import { getLogger } from '../../../../main/logger';
import { mockRequest } from '../../mocks/mockRequest';
import { dodgyUrlMock, safeUrlMock } from '../../mocks/mockUrl';

describe('Router Helpers - returnSafeRedirectUrl', () => {
  const logger = getLogger('testLogger');
  const redirectUrl = '/page';
  const req = mockRequest({});
  it('should return home when no host does not match', () => {
    const urlMock = dodgyUrlMock;
    jest.spyOn(routerHelpers, 'getParsedUrl').mockReturnValue(urlMock);
    const result = returnSafeRedirectUrl(req, redirectUrl, logger);
    expect(result).toEqual(PageUrls.HOME);
  });

  it('should return redirect url when host matches', () => {
    const urlMock = safeUrlMock;
    jest.spyOn(routerHelpers, 'getParsedUrl').mockReturnValue(urlMock);
    const result = returnSafeRedirectUrl(req, redirectUrl, logger);
    expect(result).toEqual(redirectUrl);
  });
});

describe('Router Helpers - language helpers', () => {
  it('should return the Welsh language code when the url has a Welsh language parameter', () => {
    expect(getLanguageCode('/your-support?lng=cy')).toEqual(languages.WELSH);
  });

  it('should return the English language code when the url has no valid language parameter', () => {
    expect(getLanguageCode('/your-support')).toEqual(languages.ENGLISH);
    expect(getLanguageCode('/your-support?lng=fr')).toEqual(languages.ENGLISH);
  });

  it('should return the existing language url parameter format', () => {
    expect(getLanguageParam('/your-support?lng=cy')).toEqual(languages.WELSH_URL_PARAMETER);
    expect(getLanguageParam('/your-support')).toEqual(languages.ENGLISH_URL_PARAMETER);
  });
});
