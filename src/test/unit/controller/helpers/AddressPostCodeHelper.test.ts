import { getAddressAddressTypes } from '../../../../main/controllers/helpers/AddressPostCodeHelper';
import { AppRequest } from '../../../../main/definitions/appRequest';
import commonJson from '../../../../main/resources/locales/en/translation/common.json';
import { mockRequestWithTranslation } from '../../mocks/mockRequest';

describe('getAddressAddressTypes', () => {
  const req: AppRequest = mockRequestWithTranslation({}, commonJson);

  it('returns default "none" address type when response is empty', () => {
    const response: Record<string, string>[] = [];
    const result = getAddressAddressTypes(response, req);
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      selected: true,
      label: 'No addresses found',
    });
  });

  it('returns default "none" address type when response is undefined', () => {
    const result = getAddressAddressTypes(undefined, req);
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      selected: true,
      label: 'No addresses found',
    });
  });

  it('returns default "single" address type when response has one item', () => {
    const response: Record<string, string>[] = [{ fullAddress: '123 Test St' }];
    const result = getAddressAddressTypes(response, req);
    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({
      selected: true,
      label: '1 address found',
    });
    expect(result[1]).toEqual({
      value: 0,
      label: '123 Test St',
    });
  });

  it('returns multiple address types when response has multiple items', () => {
    const response: Record<string, string>[] = [{ fullAddress: '123 Test St' }, { fullAddress: '456 Example Ave' }];
    const result = getAddressAddressTypes(response, req);
    expect(result).toHaveLength(3);
    expect(result[0]).toEqual({
      selected: true,
      label: 'Several addresses found',
    });
    expect(result[1]).toEqual({
      value: 0,
      label: '123 Test St',
    });
    expect(result[2]).toEqual({
      value: 1,
      label: '456 Example Ave',
    });
  });

  it('uses Welsh (cy) localization when req.url includes "lng=cy"', () => {
    const reqCy: AppRequest = mockRequestWithTranslation({}, commonJson);
    reqCy.url = 'https://example.com/?lng=cy';
    const response: Record<string, string>[] = [{ fullAddress: '123 Test St' }];
    const result = getAddressAddressTypes(response, reqCy);
    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({
      selected: true,
      label: 'Daethpwyd o hyd i 1 cyfeiriad',
    });
    expect(result[1]).toEqual({
      value: 0,
      label: '123 Test St',
    });
  });
});
