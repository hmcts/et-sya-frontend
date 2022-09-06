import * as app from '../../../main/address/index';
import AddressLookupController from '../../../main/controllers/AddressLookupController';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';
import { addressLookupResponse } from '../mocks/mockedAddressLookupResponse';
const mockGetAddressesFromPostcode = jest.spyOn(app, 'getAddressesForPostcode');

describe('Address Lookup Controller', () => {
  afterEach(() => {
    mockGetAddressesFromPostcode.mockClear();
  });

  it('should have empty response body json value when saveForLater selected and no post code entered', () => {
    const body = { saveForLater: true };

    const controller = new AddressLookupController();

    const req = mockRequest({ body });
    const res = mockResponse();

    controller.post(req, res);
    expect(JSON.stringify(res.json)).toEqual(undefined);
  });

  it('should have postcode response body json value when saveForLater selected and no post code entered', () => {
    const body = { postcode: 'SL6 3NY', saveForLater: true };

    const controller = new AddressLookupController();

    const req = mockRequest({ body });
    const res = mockResponse();

    controller.post(req, res);
    expect(JSON.stringify(res.json)).toEqual(undefined);
  });

  it('calls getAddressesFromPostcode and returns json', async () => {
    const controller = new AddressLookupController();
    const mockReq = mockRequest({ body: { postcode: 'TEST POSTCODE' } });
    const mockRes = mockResponse();

    mockGetAddressesFromPostcode.mockImplementation(() => Promise.resolve(addressLookupResponse));
    await controller.post(mockReq, mockRes);

    expect(mockGetAddressesFromPostcode).toBeCalledWith('TEST POSTCODE');
    expect(mockRes.json).toBeCalledWith(addressLookupResponse);
  });

  it.each([
    { postcode: 'ZZ00 0ZZ', expected: [] },
    { postcode: 'SW1H 9AJ', expected: [{ street1: '102 MINISTRY OF JUSTICE, SEVENTH FLOOR, PETTY FRANCE' }] },
    { postcode: 'SW1A 1AA', expected: [{ street1: 'BUCKINGHAM PALACE' }] },
  ])('returns a mock postcode %o', async ({ postcode, expected }) => {
    const controller = new AddressLookupController();

    const mockReq = mockRequest({ body: { postcode } });
    const mockRes = mockResponse();

    await controller.post(mockReq, mockRes);

    expect(mockGetAddressesFromPostcode).not.toHaveBeenCalled();
    expect((mockRes.json as jest.Mock).mock.calls[0][0]).toMatchObject(expected);
  });
});
