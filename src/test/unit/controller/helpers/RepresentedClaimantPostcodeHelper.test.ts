import { getRepresentedClaimantAddressTypes } from '../../../../main/controllers/helpers/RepresentedClaimantPostcodeHelper';
import { AppRequest } from '../../../../main/definitions/appRequest';
import commonJson from '../../../../main/resources/locales/en/translation/common.json';
import { mockRequestWithTranslation } from '../../mocks/mockRequest';

describe('getRepresentedClaimantAddressTypes', () => {
  const req: AppRequest = mockRequestWithTranslation({}, commonJson);

  it('returns default "none" address type when response is empty', () => {
    const result = getRepresentedClaimantAddressTypes([], req);
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({ selected: true, label: 'No addresses found' });
  });

  it('returns default "none" address type when response is undefined', () => {
    const result = getRepresentedClaimantAddressTypes(undefined, req);
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({ selected: true, label: 'No addresses found' });
  });

  it('returns default "single" address type when response has one item', () => {
    const response = [{ fullAddress: '1 Rep Street, London, LE5 5HD' }];
    const result = getRepresentedClaimantAddressTypes(response, req);
    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({ selected: true, label: '1 address found' });
    expect(result[1]).toEqual({ value: 0, label: '1 Rep Street, London, LE5 5HD' });
  });

  it('returns default "several" address type when response has multiple items', () => {
    const response = [
      { fullAddress: '1 Rep Street, London, LE5 5HD' },
      { fullAddress: '2 Rep Street, London, LE5 6HD' },
    ];
    const result = getRepresentedClaimantAddressTypes(response, req);
    expect(result).toHaveLength(3);
    expect(result[0]).toEqual({ selected: true, label: 'Several addresses found' });
  });

  it('uses Welsh (cy) localisation when req.url includes "lng=cy"', () => {
    const reqCy: AppRequest = mockRequestWithTranslation({}, commonJson);
    reqCy.url = 'https://example.com/?lng=cy';
    const response = [{ fullAddress: '1 Rep Street' }];
    const result = getRepresentedClaimantAddressTypes(response, reqCy);
    expect(result[0].label).toEqual('Daethpwyd o hyd i 1 cyfeiriad');
  });
});
