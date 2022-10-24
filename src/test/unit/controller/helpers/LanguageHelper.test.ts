import { setUrlLanguage } from '../../../../main/controllers/helpers/LanguageHelper';
import { mockSession } from '../../mocks/mockApp';
import { mockRequest } from '../../mocks/mockRequest';

describe('setUrlLanguageForRedirectPage', () => {
  it('should add welsh parameters to the redirected url if the request url has welsh parameters', () => {
    const req = mockRequest({
      session: mockSession([], [], []),
      body: { saveForLater: true, testFormField: 'test value' },
    });
    req.url = '/testPageUrl?lng=cy';
    const redirectUrl = setUrlLanguage(req, '/redirectTestPage');
    expect(redirectUrl).toEqual('/redirectTestPage?lng=cy');
  });

  it('should add english parameters to the redirected url if the request url has english parameters', () => {
    const req = mockRequest({
      session: mockSession([], [], []),
      body: { saveForLater: true, testFormField: 'test value' },
    });
    req.url = '/testPageUrl?lng=en';
    const redirectUrl = setUrlLanguage(req, '/redirectTestPage');
    expect(redirectUrl).toEqual('/redirectTestPage?lng=en');
  });

  it('should keep the redirect page without any parameters if the request url does not contain them', () => {
    const req = mockRequest({
      session: mockSession([], [], []),
      body: { saveForLater: true, testFormField: 'test value' },
    });
    req.url = '/testPageUrl';
    const redirectUrl = setUrlLanguage(req, '/redirectTestPage');
    expect(redirectUrl).toEqual('/redirectTestPage');
  });
});
