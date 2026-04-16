import { getRepresentativeAddressTypes } from '../../../../main/controllers/helpers/RepresentativePostCodeHelper';
import { AppRequest } from '../../../../main/definitions/appRequest';
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
});
