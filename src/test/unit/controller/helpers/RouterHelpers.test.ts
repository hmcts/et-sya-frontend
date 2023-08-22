import url from 'url';

import { returnSafeRedirectUrl } from '../../../../main/controllers/helpers/RouterHelpers';
import * as routerHelpers from '../../../../main/controllers/helpers/RouterHelpers';
import { PageUrls } from '../../../../main/definitions/constants';
import { getLogger } from '../../../../main/logger';
import { mockRequest } from '../../mocks/mockRequest';

describe('Router Helpers - returnSafeRedirectUrl', () => {
  const logger = getLogger('testLogger');
  const redirectUrl = '/page';
  const req = mockRequest({});
  it('should return home when no host does not match', () => {
    const urlMock = {
      host: 'http://dodgy.com',
      href: 'http://dodgy.com',
    } as url.UrlWithStringQuery;
    jest.spyOn(routerHelpers, 'getParsedUrl').mockReturnValue(urlMock);
    const result = returnSafeRedirectUrl(req, redirectUrl, logger);
    expect(result).toEqual(PageUrls.HOME);
  });

  it('should return redirect url when host matches', () => {
    const urlMock = {
      host: 'http://localhost:3001',
    } as url.UrlWithStringQuery;
    jest.spyOn(routerHelpers, 'getParsedUrl').mockReturnValue(urlMock);
    const result = returnSafeRedirectUrl(req, redirectUrl, logger);
    expect(result).toEqual(redirectUrl);
  });
});
