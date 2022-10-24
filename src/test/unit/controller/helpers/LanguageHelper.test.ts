import { setUrlLanguage } from '../../../../main/controllers/helpers/LanguageHelper';
import { mockSession } from '../../mocks/mockApp';
import { mockRequest } from '../../mocks/mockRequest';

describe('setUrlLanguageForRedirectPage', () => {
  it('should add welsh parameters to redirected url', () => {
    const req = mockRequest({
      session: mockSession([], [], []),
      body: { saveForLater: true, testFormField: 'test value' },
    });
    req.url = '/testPageUrl?lng=cy';
    const redirectUrl = setUrlLanguage(req, '/redirectTestPage');
    expect(redirectUrl).toEqual('/redirectTestPage?lng=cy');
  });

  it('should add english parameters to redirected url', () => {
    const req = mockRequest({
      session: mockSession([], [], []),
      body: { saveForLater: true, testFormField: 'test value' },
    });
    req.url = '/testPageUrl';
    const redirectUrl = setUrlLanguage(req, '/redirectTestPage');
    expect(redirectUrl).toEqual('/redirectTestPage?lng=en');
  });
});
