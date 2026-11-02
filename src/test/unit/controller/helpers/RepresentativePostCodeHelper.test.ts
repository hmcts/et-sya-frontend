import {
  getEnterTitle,
  getLink,
  getRepresentativeAddressTypes,
  getSelectTitle,
} from '../../../../main/controllers/helpers/RepresentativePostCodeHelper';
import { AppRequest } from '../../../../main/definitions/appRequest';
import { PageUrls, languages } from '../../../../main/definitions/constants';
import commonCyJson from '../../../../main/resources/locales/cy/translation/common.json';
import commonJson from '../../../../main/resources/locales/en/translation/common.json';
import { mockRequestWithTranslation } from '../../mocks/mockRequest';

describe('getRepresentativeAddressTypes', () => {
  const req: AppRequest = mockRequestWithTranslation({}, commonJson);

  it('returns default "none" address type when response is empty', () => {
    const result = getRepresentativeAddressTypes([], req);
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({ selected: true, label: 'No addresses found' });
  });

  it('returns default "none" address type when response is undefined', () => {
    const result = getRepresentativeAddressTypes(undefined, req);
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({ selected: true, label: 'No addresses found' });
  });

  it('returns default "single" address type when response has one item', () => {
    const response = [{ fullAddress: '1 Rep Street, London, EC1A 1BB' }];
    const result = getRepresentativeAddressTypes(response, req);
    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({ selected: true, label: '1 address found' });
    expect(result[1]).toEqual({ value: 0, label: '1 Rep Street, London, EC1A 1BB' });
  });

  it('returns default "several" address type when response has multiple items', () => {
    const response = [
      { fullAddress: '1 Rep Street, London, EC1A 1BB' },
      { fullAddress: '2 Rep Street, London, EC1A 1BC' },
    ];
    const result = getRepresentativeAddressTypes(response, req);
    expect(result).toHaveLength(3);
    expect(result[0]).toEqual({ selected: true, label: 'Several addresses found' });
  });

  it('uses Welsh (cy) localisation when req.url includes "lng=cy"', () => {
    const reqCy: AppRequest = mockRequestWithTranslation({}, commonJson);
    reqCy.url = 'https://example.com/?lng=cy';
    const response = [{ fullAddress: '1 Rep Street' }];
    const result = getRepresentativeAddressTypes(response, reqCy);
    expect(result[0].label).toEqual('Daethpwyd o hyd i 1 cyfeiriad');
  });

  it('uses Welsh "none" label when response is empty and URL is Welsh', () => {
    const reqCy: AppRequest = mockRequestWithTranslation({}, commonJson);
    reqCy.url = '/some-page?lng=cy';
    const result = getRepresentativeAddressTypes([], reqCy);
    expect(result[0].label).toEqual(commonCyJson.selectDefaultNone);
  });

  it('uses Welsh "several" label when response has multiple items and URL is Welsh', () => {
    const reqCy: AppRequest = mockRequestWithTranslation({}, commonJson);
    reqCy.url = '/some-page?lng=cy';
    const response = [{ fullAddress: 'A' }, { fullAddress: 'B' }];
    const result = getRepresentativeAddressTypes(response, reqCy);
    expect(result[0].label).toEqual(commonCyJson.selectDefaultSeveral);
  });
});

describe('getLink', () => {
  it('should return English address details link by default', () => {
    const req: AppRequest = mockRequestWithTranslation({}, commonJson);
    req.url = '/some-page?lng=en';
    const result = getLink(req);
    expect(result).toContain(PageUrls.REPRESENTATIVE_ADDRESS_DETAILS);
    expect(result).toContain(languages.ENGLISH_URL_PARAMETER);
  });

  it('should return Welsh address details link when URL includes lng=cy', () => {
    const req: AppRequest = mockRequestWithTranslation({}, commonJson);
    req.url = '/some-page?lng=cy';
    const result = getLink(req);
    expect(result).toContain(PageUrls.REPRESENTATIVE_ADDRESS_DETAILS);
    expect(result).toContain(languages.WELSH_URL_PARAMETER);
  });
});

describe('getEnterTitle', () => {
  it('should return English enter title by default', () => {
    const req: AppRequest = mockRequestWithTranslation({}, commonJson);
    req.url = '/some-page?lng=en';
    const result = getEnterTitle(req);
    expect(result).toEqual(commonJson.representativePostcodeEnterTitle);
  });

  it('should return Welsh enter title when URL includes lng=cy', () => {
    const req: AppRequest = mockRequestWithTranslation({}, commonJson);
    req.url = '/some-page?lng=cy';
    const result = getEnterTitle(req);
    expect(result).toEqual(commonCyJson.representativePostcodeEnterTitle);
  });
});

describe('getSelectTitle', () => {
  it('should return English select title by default', () => {
    const req: AppRequest = mockRequestWithTranslation({}, commonJson);
    req.url = '/some-page?lng=en';
    const result = getSelectTitle(req);
    expect(result).toEqual(commonJson.representativePostcodeSelectTitle);
  });

  it('should return Welsh select title when URL includes lng=cy', () => {
    const req: AppRequest = mockRequestWithTranslation({}, commonJson);
    req.url = '/some-page?lng=cy';
    const result = getSelectTitle(req);
    expect(result).toEqual(commonCyJson.representativePostcodeSelectTitle);
  });
});
