import axios, { AxiosResponse } from 'axios';
import config from 'config';

import { getLogger } from '../logger';
import { axiosErrorDetails } from '../services/AxiosErrorAdapter';

const logger = getLogger('address');

export const getAddressesForPostcode = async (postcode: string): Promise<Address[]> => {
  try {
    const url: string = config.get('services.addressLookup.url');
    const response: AxiosResponse<PostcodeResponse> = await axios.get(url, {
      headers: {
        accept: 'application/json',
      },
      params: {
        key: config.get('services.addressLookup.token'),
        postcode,
      },
    });

    if (!response.data?.results) {
      return [];
    }

    return response.data.results.map(
      ({
        DPA: {
          ADDRESS,
          BUILDING_NUMBER = '',
          SUB_BUILDING_NAME = '',
          BUILDING_NAME = '',
          ORGANISATION_NAME = '',
          THOROUGHFARE_NAME = '',
          DEPENDENT_THOROUGHFARE_NAME = '',
          DEPENDENT_LOCALITY = '',
          DOUBLE_DEPENDENT_LOCALITY = '',
          POST_TOWN,
          LOCAL_CUSTODIAN_CODE_DESCRIPTION = '',
          POSTCODE,
          COUNTRY_CODE,
        },
      }) => ({
        fullAddress: ADDRESS,
        street1: [
          [ORGANISATION_NAME, SUB_BUILDING_NAME, BUILDING_NAME, BUILDING_NUMBER, THOROUGHFARE_NAME]
            .filter(Boolean)
            .join(', '),
        ]
          .filter(Boolean)
          .join(' '),
        street2: [DEPENDENT_THOROUGHFARE_NAME, DEPENDENT_LOCALITY, DOUBLE_DEPENDENT_LOCALITY]
          .filter(Boolean)
          .join(', '),
        town: POST_TOWN,
        county: LOCAL_CUSTODIAN_CODE_DESCRIPTION,
        postcode: POSTCODE,
        country: countryCodes.get(COUNTRY_CODE),
      })
    );
  } catch (error) {
    logger.error('Error getting addresses for postcode: ' + axiosErrorDetails(error));
    return [];
  }
};

export type Address = {
  fullAddress: string;
  street1: string;
  street2?: string;
  town: string;
  county?: string;
  postcode: string;
  country: string;
};

const countryCodes = new Map([
  ['E', 'ENGLAND'],
  ['S', 'SCOTLAND'],
  ['W', 'WALES'],
  ['N', 'NORTHERN IRELAND'],
]);

export interface PostcodeResponse {
  results: {
    DPA: {
      ADDRESS: string;
      BUILDING_NUMBER: string;
      SUB_BUILDING_NAME: string;
      BUILDING_NAME: string;
      ORGANISATION_NAME: string;
      THOROUGHFARE_NAME: string;
      DEPENDENT_THOROUGHFARE_NAME: string;
      DEPENDENT_LOCALITY: string;
      DOUBLE_DEPENDENT_LOCALITY: string;
      POST_TOWN: string;
      LOCAL_CUSTODIAN_CODE_DESCRIPTION: string;
      POSTCODE: string;
      COUNTRY_CODE: string;
    };
  }[];
}
