import * as urlModule from 'url';

import {
  addParameterToUrl,
  conditionalRedirect,
  getClaimStepsUrl,
  getLanguageParam,
  handleSaveAsDraft,
  isReturnUrlIsCheckAnswers,
  returnNextPage,
  returnSafeRedirectUrl,
  returnValidUrl,
  validateLanguageParam,
} from '../../../../main/controllers/helpers/RouterHelpers';
import * as routerHelpers from '../../../../main/controllers/helpers/RouterHelpers';
import { YesOrNo } from '../../../../main/definitions/case';
import { ErrorPages, PageUrls } from '../../../../main/definitions/constants';
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

  it('should return redirectUrl when parsed host is null (same-origin)', () => {
    jest.spyOn(routerHelpers, 'getParsedUrl').mockReturnValue({ host: null } as urlModule.UrlWithStringQuery);
    const result = returnSafeRedirectUrl(req, redirectUrl, logger);
    expect(result).toEqual(redirectUrl);
  });
});

describe('Router Helpers - handleSaveAsDraft', () => {
  it('should redirect to CLAIM_SAVED', () => {
    const res = { redirect: jest.fn() } as any;
    handleSaveAsDraft(res);
    expect(res.redirect).toHaveBeenCalledWith(PageUrls.CLAIM_SAVED);
  });
});

describe('Router Helpers - validateLanguageParam', () => {
  it('should return true for Welsh language code', () => {
    expect(validateLanguageParam('cy')).toBe(true);
  });

  it('should return true for English language code', () => {
    expect(validateLanguageParam('en')).toBe(true);
  });

  it('should return false for invalid language code', () => {
    expect(validateLanguageParam('fr')).toBe(false);
  });
});

describe('Router Helpers - getLanguageParam', () => {
  it('should return English URL parameter when URL has no query string', () => {
    const result = getLanguageParam('/some-page');
    expect(result).toContain('lng=en');
  });

  it('should return Welsh URL parameter when URL contains lng=cy', () => {
    const result = getLanguageParam('/some-page?lng=cy');
    expect(result).toContain('lng=cy');
  });

  it('should return English URL parameter when URL contains lng=en', () => {
    const result = getLanguageParam('/some-page?lng=en');
    expect(result).toContain('lng=en');
  });

  it('should return English URL parameter for invalid lng value', () => {
    const result = getLanguageParam('/some-page?lng=fr');
    expect(result).toContain('lng=en');
  });
});

describe('Router Helpers - isReturnUrlIsCheckAnswers', () => {
  it('should return true when returnUrl includes CHECK_ANSWERS', () => {
    const request = mockRequest({});
    request.session.returnUrl = PageUrls.CHECK_ANSWERS;
    expect(isReturnUrlIsCheckAnswers(request)).toBe(true);
  });

  it('should return false when returnUrl does not include CHECK_ANSWERS', () => {
    const request = mockRequest({});
    request.session.returnUrl = PageUrls.CLAIM_SAVED;
    expect(isReturnUrlIsCheckAnswers(request)).toBe(false);
  });

  it('should return false when returnUrl is undefined', () => {
    const request = mockRequest({});
    request.session.returnUrl = undefined;
    expect(isReturnUrlIsCheckAnswers(request)).toBeFalsy();
  });
});

describe('Router Helpers - getClaimStepsUrl', () => {
  it('should return CLAIM_STEPS_NON_HMCTS when claimantRepresentedQuestion is YES', () => {
    const request = mockRequest({ userCase: { claimantRepresentedQuestion: YesOrNo.YES } });
    expect(getClaimStepsUrl(request)).toEqual(PageUrls.CLAIM_STEPS_NON_HMCTS);
  });

  it('should return CLAIM_STEPS when claimantRepresentedQuestion is NO', () => {
    const request = mockRequest({ userCase: { claimantRepresentedQuestion: YesOrNo.NO } });
    expect(getClaimStepsUrl(request)).toEqual(PageUrls.CLAIM_STEPS);
  });

  it('should return CLAIM_STEPS when claimantRepresentedQuestion is undefined', () => {
    const request = mockRequest({});
    expect(getClaimStepsUrl(request)).toEqual(PageUrls.CLAIM_STEPS);
  });
});

describe('Router Helpers - returnNextPage', () => {
  it('should redirect to redirectUrl when no returnUrl in session', () => {
    const request = mockRequest({});
    const res = { redirect: jest.fn() } as any;
    returnNextPage(request, res, PageUrls.CLAIM_SAVED);
    expect(res.redirect).toHaveBeenCalledWith(PageUrls.CLAIM_SAVED);
  });

  it('should redirect to returnUrl and clear it when present in session', () => {
    const request = mockRequest({});
    request.session.returnUrl = PageUrls.CHECK_ANSWERS;
    const res = { redirect: jest.fn() } as any;
    returnNextPage(request, res, PageUrls.CLAIM_SAVED);
    expect(res.redirect).toHaveBeenCalledWith(PageUrls.CHECK_ANSWERS);
    expect(request.session.returnUrl).toBeUndefined();
  });
});

describe('Router Helpers - addParameterToUrl', () => {
  it('should return empty string when url is blank', () => {
    expect(addParameterToUrl('', 'lng=en')).toEqual('');
  });

  it('should return url unchanged when parameter is blank', () => {
    expect(addParameterToUrl('/page', '')).toEqual('/page');
  });

  it('should append parameter with ? when url has no query string', () => {
    expect(addParameterToUrl('/page', 'lng=en')).toEqual('/page?lng=en');
  });

  it('should append parameter with & when url already has query string', () => {
    expect(addParameterToUrl('/page?foo=bar', 'lng=en')).toEqual('/page?foo=bar&lng=en');
  });

  it('should not duplicate parameter if already present', () => {
    expect(addParameterToUrl('/page?lng=en', 'lng=en')).toEqual('/page?lng=en');
  });
});

describe('Router Helpers - returnValidUrl', () => {
  it('should return NOT_FOUND for an unrecognised URL', () => {
    const result = returnValidUrl('/this-does-not-exist-anywhere');
    expect(result).toEqual(ErrorPages.NOT_FOUND);
  });

  it('should return the static URL for a known PageUrl', () => {
    const result = returnValidUrl(PageUrls.CLAIM_SAVED);
    expect(result).toEqual(PageUrls.CLAIM_SAVED);
  });

  it('should preserve query parameters on a valid static URL', () => {
    const result = returnValidUrl(PageUrls.CLAIM_SAVED + '?lng=en');
    expect(result).toContain(PageUrls.CLAIM_SAVED);
    expect(result).toContain('lng=en');
  });
});

describe('Router Helpers - conditionalRedirect', () => {
  it('should return true when form field value matches string condition', () => {
    const request = mockRequest({ body: { myField: 'yes' } });
    const formFields = { myField: {} } as any;
    expect(conditionalRedirect(request, formFields, 'yes')).toBe(true);
  });

  it('should return false when form field value does not match condition', () => {
    const request = mockRequest({ body: { myField: 'no' } });
    const formFields = { myField: {} } as any;
    expect(conditionalRedirect(request, formFields, 'yes')).toBe(false);
  });

  it('should return true when form field value matches one of array conditions', () => {
    const request = mockRequest({ body: { myField: ['optionA', 'optionB'] } });
    const formFields = { myField: {} } as any;
    expect(conditionalRedirect(request, formFields, ['optionA', 'optionC'])).toBe(true);
  });

  it('should return false when no form field in body matches formFields keys', () => {
    const request = mockRequest({ body: { otherField: 'yes' } });
    const formFields = { myField: {} } as any;
    expect(conditionalRedirect(request, formFields, 'yes')).toBeFalsy();
  });
});
