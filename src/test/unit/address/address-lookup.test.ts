import axios from 'axios';

import { getAddressesForPostcode } from '../../../main/address';
import { emptyPostcodeResponse, validPostcodeResponse } from '../mocks/mockPostcodeResponses';

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

    expect(actual).toEqual([
      {
        county: 'EXETER',
        fullAddress: 'FLAT 1, HOPE COURT, PRINCE OF WALES ROAD, EXETER, EX4 4PN',
        postcode: 'EX4 4PN',
        street1: 'FLAT 1, HOPE COURT, PRINCE OF WALES ROAD',
        street2: '',
        town: 'EXETER',
      },
      {
        county: 'EXETER',
        fullAddress: 'FLAT 10, HOPE COURT, PRINCE OF WALES ROAD, EXETER, EX4 4PN',
        postcode: 'EX4 4PN',
        street1: 'FLAT 10, HOPE COURT, PRINCE OF WALES ROAD',
        street2: '',
        town: 'EXETER',
      },
      {
        county: 'EXETER',
        fullAddress: 'FLAT 11, HOPE COURT, PRINCE OF WALES ROAD, EXETER, EX4 4PN',
        postcode: 'EX4 4PN',
        street1: 'FLAT 11, HOPE COURT, PRINCE OF WALES ROAD',
        street2: '',
        town: 'EXETER',
      },
      {
        county: 'EXETER',
        fullAddress: 'FLAT 12, HOPE COURT, PRINCE OF WALES ROAD, EXETER, EX4 4PN',
        postcode: 'EX4 4PN',
        street1: 'FLAT 12, HOPE COURT, PRINCE OF WALES ROAD',
        street2: '',
        town: 'EXETER',
      },
      {
        county: 'EXETER',
        fullAddress: 'FLAT 13, HOPE COURT, PRINCE OF WALES ROAD, EXETER, EX4 4PN',
        postcode: 'EX4 4PN',
        street1: 'FLAT 13, HOPE COURT, PRINCE OF WALES ROAD',
        street2: '',
        town: 'EXETER',
      },
      {
        county: 'EXETER',
        fullAddress: 'FLAT 2, HOPE COURT, PRINCE OF WALES ROAD, EXETER, EX4 4PN',
        postcode: 'EX4 4PN',
        street1: 'FLAT 2, HOPE COURT, PRINCE OF WALES ROAD',
        street2: '',
        town: 'EXETER',
      },
      {
        county: 'EXETER',
        fullAddress: 'FLAT 3, HOPE COURT, PRINCE OF WALES ROAD, EXETER, EX4 4PN',
        postcode: 'EX4 4PN',
        street1: 'FLAT 3, HOPE COURT, PRINCE OF WALES ROAD',
        street2: '',
        town: 'EXETER',
      },
      {
        county: 'EXETER',
        fullAddress: 'FLAT 4, HOPE COURT, PRINCE OF WALES ROAD, EXETER, EX4 4PN',
        postcode: 'EX4 4PN',
        street1: 'FLAT 4, HOPE COURT, PRINCE OF WALES ROAD',
        street2: '',
        town: 'EXETER',
      },
      {
        county: 'EXETER',
        fullAddress: 'FLAT 5, HOPE COURT, PRINCE OF WALES ROAD, EXETER, EX4 4PN',
        postcode: 'EX4 4PN',
        street1: 'FLAT 5, HOPE COURT, PRINCE OF WALES ROAD',
        street2: '',
        town: 'EXETER',
      },
      {
        county: 'EXETER',
        fullAddress: 'FLAT 6, HOPE COURT, PRINCE OF WALES ROAD, EXETER, EX4 4PN',
        postcode: 'EX4 4PN',
        street1: 'FLAT 6, HOPE COURT, PRINCE OF WALES ROAD',
        street2: '',
        town: 'EXETER',
      },
      {
        county: 'EXETER',
        fullAddress: 'FLAT 7, HOPE COURT, PRINCE OF WALES ROAD, EXETER, EX4 4PN',
        postcode: 'EX4 4PN',
        street1: 'FLAT 7, HOPE COURT, PRINCE OF WALES ROAD',
        street2: '',
        town: 'EXETER',
      },
      {
        county: 'EXETER',
        fullAddress: 'FLAT 8, HOPE COURT, PRINCE OF WALES ROAD, EXETER, EX4 4PN',
        postcode: 'EX4 4PN',
        street1: 'FLAT 8, HOPE COURT, PRINCE OF WALES ROAD',
        street2: '',
        town: 'EXETER',
      },
      {
        county: 'EXETER',
        fullAddress: 'FLAT 9, HOPE COURT, PRINCE OF WALES ROAD, EXETER, EX4 4PN',
        postcode: 'EX4 4PN',
        street1: 'FLAT 9, HOPE COURT, PRINCE OF WALES ROAD',
        street2: '',
        town: 'EXETER',
      },
    ]);
  });

  it('should return no results when not found', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: emptyPostcodeResponse });
    const actual = await getAddressesForPostcode('EX13DJ');
    expect(actual).toEqual([]);
  });
});
