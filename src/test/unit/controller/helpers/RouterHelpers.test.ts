import {
  getSafeLanguageParam,
  returnSafeCitizenHubUrl,
  returnSafePageUrl,
  returnSafeRedirectUrl,
  returnSafeTransferredCaseUrl,
} from '../../../../main/controllers/helpers/RouterHelpers';
import * as routerHelpers from '../../../../main/controllers/helpers/RouterHelpers';
import { ErrorPages, PageUrls, languages } from '../../../../main/definitions/constants';
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

describe('Router Helpers - returnSafeTransferredCaseUrl', () => {
  it('should build transferred-case url with English language by default', () => {
    const req = mockRequest({});
    req.url = PageUrls.CITIZEN_HUB.replace(':caseId', '1234567890123456') + languages.ENGLISH_URL_PARAMETER;

    expect(returnSafeTransferredCaseUrl('1234567890123456', req)).toBe(
      `${PageUrls.TRANSFERRED_CASE}${languages.ENGLISH_URL_PARAMETER}&caseId=1234567890123456`
    );
  });

  it('should build transferred-case url with Welsh language', () => {
    const req = mockRequest({});
    req.url = PageUrls.CITIZEN_HUB.replace(':caseId', '1234567890123456') + languages.WELSH_URL_PARAMETER;

    expect(returnSafeTransferredCaseUrl('1234567890123456', req)).toBe(
      `${PageUrls.TRANSFERRED_CASE}${languages.WELSH_URL_PARAMETER}&caseId=1234567890123456`
    );
  });

  it('should fall back to claimant applications when caseId is not numeric', () => {
    const req = mockRequest({});
    req.url = PageUrls.CITIZEN_HUB.replace(':caseId', 'abc') + languages.ENGLISH_URL_PARAMETER;

    expect(returnSafeTransferredCaseUrl('abc', req)).toBe(PageUrls.CLAIMANT_APPLICATIONS);
  });

  it('should build transferred-case url when caseId is a number from the API', () => {
    const req = mockRequest({});
    req.url = PageUrls.CITIZEN_HUB.replace(':caseId', '1786637776090539') + languages.ENGLISH_URL_PARAMETER;

    expect(returnSafeTransferredCaseUrl(1786637776090539, req)).toBe(
      `${PageUrls.TRANSFERRED_CASE}${languages.ENGLISH_URL_PARAMETER}&caseId=1786637776090539`
    );
  });

  it('should reject scientific notation and hex case ids', () => {
    const req = mockRequest({});
    req.url = PageUrls.CITIZEN_HUB.replace(':caseId', '1') + languages.ENGLISH_URL_PARAMETER;

    expect(returnSafeTransferredCaseUrl('1e10', req)).toBe(PageUrls.CLAIMANT_APPLICATIONS);
    expect(returnSafeTransferredCaseUrl('0x12', req)).toBe(PageUrls.CLAIMANT_APPLICATIONS);
    expect(returnSafeTransferredCaseUrl('20548', req)).toBe(PageUrls.CLAIMANT_APPLICATIONS);
  });
});

describe('Router Helpers - returnSafeCitizenHubUrl', () => {
  it('should build citizen-hub url for numeric caseId', () => {
    const req = mockRequest({});
    req.url = PageUrls.SELECTED_APPLICATION.replace(':caseId', '1234567890123456') + languages.ENGLISH_URL_PARAMETER;

    expect(returnSafeCitizenHubUrl('1234567890123456', req)).toBe(
      `${PageUrls.CITIZEN_HUB_BASE}1234567890123456${languages.ENGLISH_URL_PARAMETER}`
    );
  });

  it('should build citizen-hub url when caseId is a number from the API', () => {
    const req = mockRequest({});
    req.url = PageUrls.SELECTED_APPLICATION.replace(':caseId', '1786637776090539') + languages.ENGLISH_URL_PARAMETER;

    expect(returnSafeCitizenHubUrl(1786637776090539, req)).toBe(
      `${PageUrls.CITIZEN_HUB_BASE}1786637776090539${languages.ENGLISH_URL_PARAMETER}`
    );
  });

  it('should strip hyphenated 16-digit CCD case ids before embedding in the url', () => {
    const req = mockRequest({});
    req.url = PageUrls.SELECTED_APPLICATION.replace(':caseId', '1111222233334444') + languages.ENGLISH_URL_PARAMETER;

    expect(returnSafeCitizenHubUrl('1111-2222-3333-4444', req)).toBe(
      `${PageUrls.CITIZEN_HUB_BASE}1111222233334444${languages.ENGLISH_URL_PARAMETER}`
    );
  });

  it('should fall back to claimant applications when caseId is not numeric', () => {
    const req = mockRequest({});
    req.url = PageUrls.SELECTED_APPLICATION.replace(':caseId', 'abc') + languages.ENGLISH_URL_PARAMETER;

    expect(returnSafeCitizenHubUrl('abc', req)).toBe(PageUrls.CLAIMANT_APPLICATIONS);
  });

  it('should reject scientific notation and hex case ids', () => {
    const req = mockRequest({});
    req.url = PageUrls.SELECTED_APPLICATION.replace(':caseId', '1') + languages.ENGLISH_URL_PARAMETER;

    expect(returnSafeCitizenHubUrl('1e10', req)).toBe(PageUrls.CLAIMANT_APPLICATIONS);
    expect(returnSafeCitizenHubUrl('0x12', req)).toBe(PageUrls.CLAIMANT_APPLICATIONS);
    expect(returnSafeCitizenHubUrl('Infinity', req)).toBe(PageUrls.CLAIMANT_APPLICATIONS);
    expect(returnSafeCitizenHubUrl('12234', req)).toBe(PageUrls.CLAIMANT_APPLICATIONS);
    expect(returnSafeCitizenHubUrl('12345678901234567', req)).toBe(PageUrls.CLAIMANT_APPLICATIONS);
  });
});

describe('Router Helpers - getSafeLanguageParam', () => {
  it('should return Welsh parameter when url contains lng=cy', () => {
    const req = mockRequest({});
    req.url = `${PageUrls.CLAIMANT_APPLICATIONS}${languages.WELSH_URL_PARAMETER}`;

    expect(getSafeLanguageParam(req)).toBe(languages.WELSH_URL_PARAMETER);
  });

  it('should return English parameter by default', () => {
    const req = mockRequest({});
    req.url = `${PageUrls.CLAIMANT_APPLICATIONS}${languages.ENGLISH_URL_PARAMETER}`;

    expect(getSafeLanguageParam(req)).toBe(languages.ENGLISH_URL_PARAMETER);
  });
});

describe('Router Helpers - returnSafePageUrl', () => {
  it('should append English language parameter to a known-safe page path', () => {
    const req = mockRequest({});
    req.url = `${PageUrls.CLAIMANT_APPLICATIONS}${languages.ENGLISH_URL_PARAMETER}`;

    expect(returnSafePageUrl(PageUrls.CHECKLIST, req)).toBe(`${PageUrls.CHECKLIST}${languages.ENGLISH_URL_PARAMETER}`);
  });

  it('should append Welsh language parameter to a known-safe page path', () => {
    const req = mockRequest({});
    req.url = `${PageUrls.CLAIMANT_APPLICATIONS}${languages.WELSH_URL_PARAMETER}`;

    expect(returnSafePageUrl(ErrorPages.NOT_FOUND, req)).toBe(
      `${ErrorPages.NOT_FOUND}${languages.WELSH_URL_PARAMETER}`
    );
  });
});
