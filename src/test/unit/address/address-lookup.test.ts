import axios from 'axios';

import { getAddressesForPostcode } from '../../../main/address';
import { emptyPostcodeResponse, validPostcodeResponse } from '../mocks/mockPostcodeResponses';
import { addressLookupResponse } from '../mocks/mockedAddressLookupResponse';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Address Lookup', () => {
  it('should return addresses for a given postcode', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: validPostcodeResponse });

    const actual = await getAddressesForPostcode('EX44PN');

    expect(mockedAxios.get).toHaveBeenCalledWith('https://api.os.uk/search/places/v1/postcode', {
      headers: { accept: 'application/json' },
      params: { key: 'TO BE PICKED UP FROM ENV', postcode: 'EX44PN' },
    });

    expect(actual).toEqual(addressLookupResponse);
  });

  it('should return no results when not found', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: emptyPostcodeResponse });
    const actual = await getAddressesForPostcode('EX13DJ');
    expect(actual).toEqual([]);
  });
});
