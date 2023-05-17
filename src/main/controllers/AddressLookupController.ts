import autobind from 'autobind-decorator';
import { Response } from 'express';

import { Address, getAddressesForPostcode } from '../address';
import { AppRequest } from '../definitions/appRequest';
import { UnknownRecord } from '../definitions/util-types';

import { handleSaveAsDraft } from './helpers/RouterHelpers';

@autobind
export default class AddressLookupController {
  public async post(req: AppRequest<UnknownRecord>, res: Response): Promise<void> {
    const { saveForLater } = req.body;

    if (saveForLater) {
      handleSaveAsDraft(res);
    } else {
      const postcode = req.body.postcode as string;

      const stubbedPostcode = AddressLookupController.checkStubbedPostcode(postcode);
      if (stubbedPostcode) {
        res.json(stubbedPostcode);
        return;
      }

      res.json(await getAddressesForPostcode(postcode));
    }
  }

  private static checkStubbedPostcode(postcode: string): Address[] | null {
    if (postcode === 'SW1A 1AA') {
      return [
        {
          fullAddress: 'Buckingham Palace, London, SW1A 1AA',
          street1: 'Buckingham Palace',
          street2: '',
          town: 'London',
          county: 'City Of Westminster',
          postcode: 'SW1A 1AA',
          country: 'England',
        },
      ];
    }

    if (postcode === 'SW1H 9AJ') {
      return [
        {
          fullAddress: 'Ministry of Justice, Seventh Floor, 102, Petty France, London, SW1H 9AJ',
          street1: '102 Ministry of Justice, Seventh Floor, Petty France',
          street2: '',
          town: 'London',
          county: 'City Of Westminster',
          postcode: 'SW1H 9AJ',
          country: 'England',
        },
      ];
    }

    if (postcode === 'ZZ00 0ZZ') {
      return [];
    }

    return null;
  }
}
