import {
  returnSafeCitizenHubUrl,
  returnSafeRedirectUrl,
  returnSafeTransferredCaseUrl,
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

describe('Router Helpers - returnSafeTransferredCaseUrl', () => {
  it('should build transferred-case url with English language by default', () => {
    const req = mockRequest({});
    req.url = PageUrls.CITIZEN_HUB.replace(':caseId', '20548') + languages.ENGLISH_URL_PARAMETER;

    expect(returnSafeTransferredCaseUrl('20548', req)).toBe(
      `${PageUrls.TRANSFERRED_CASE}${languages.ENGLISH_URL_PARAMETER}`
    );
  });

  it('should build transferred-case url with Welsh language', () => {
    const req = mockRequest({});
    req.url = PageUrls.CITIZEN_HUB.replace(':caseId', '20548') + languages.WELSH_URL_PARAMETER;

    expect(returnSafeTransferredCaseUrl('20548', req)).toBe(
      `${PageUrls.TRANSFERRED_CASE}${languages.WELSH_URL_PARAMETER}`
    );
  });

  it('should fall back to claimant applications when caseId is not numeric', () => {
    const req = mockRequest({});
    req.url = PageUrls.CITIZEN_HUB.replace(':caseId', 'abc') + languages.ENGLISH_URL_PARAMETER;

    expect(returnSafeTransferredCaseUrl('abc', req)).toBe(PageUrls.CLAIMANT_APPLICATIONS);
  });
});

describe('Router Helpers - returnSafeCitizenHubUrl', () => {
  it('should build citizen-hub url for numeric caseId', () => {
    const req = mockRequest({});
    req.url = PageUrls.SELECTED_APPLICATION.replace(':caseId', '12234') + languages.ENGLISH_URL_PARAMETER;

    expect(returnSafeCitizenHubUrl('12234', req)).toBe(
      `${PageUrls.CITIZEN_HUB_BASE}12234${languages.ENGLISH_URL_PARAMETER}`
    );
  });

  it('should fall back to claimant applications when caseId is not numeric', () => {
    const req = mockRequest({});
    req.url = PageUrls.SELECTED_APPLICATION.replace(':caseId', 'abc') + languages.ENGLISH_URL_PARAMETER;

    expect(returnSafeCitizenHubUrl('abc', req)).toBe(PageUrls.CLAIMANT_APPLICATIONS);
  });
});
