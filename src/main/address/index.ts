import axios, { AxiosResponse } from 'axios';
import config from 'config';

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
        },
      }) => ({
        fullAddress: ADDRESS,
        street1: [
          BUILDING_NUMBER,
          [ORGANISATION_NAME, SUB_BUILDING_NAME, BUILDING_NAME, THOROUGHFARE_NAME].filter(Boolean).join(', '),
        ]
          .filter(Boolean)
          .join(' '),
        street2: [DEPENDENT_THOROUGHFARE_NAME, DEPENDENT_LOCALITY, DOUBLE_DEPENDENT_LOCALITY]
          .filter(Boolean)
          .join(', '),
        town: POST_TOWN,
        county: LOCAL_CUSTODIAN_CODE_DESCRIPTION,
        postcode: POSTCODE,
      })
    );
  } catch (err) {
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
};

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
    };
  }[];
}
