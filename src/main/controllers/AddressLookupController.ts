import autobind from 'autobind-decorator';
import { Response } from 'express';

import { Address, getAddressesForPostcode } from '../address/index';
import { AppRequest } from '../definitions/appRequest';
import { UnknownRecord } from '../definitions/util-types';

@autobind
export default class AddressLookupController {
  public async post(req: AppRequest<UnknownRecord>, res: Response): Promise<void> {
    const postcode = req.body.postcode as string;

    const stubbedPostcode = this.checkStubbedPostcode(postcode);
    if (stubbedPostcode) {
      res.json(stubbedPostcode);
      return;
    }

    res.json(await getAddressesForPostcode(postcode));
  }

  private checkStubbedPostcode(postcode: string): Address[] | null {
    if (postcode === 'SW1A 1AA') {
      return [
        {
          fullAddress: 'BUCKINGHAM PALACE, LONDON, SW1A 1AA',
          street1: 'BUCKINGHAM PALACE',
          street2: '',
          town: 'LONDON',
          county: 'CITY OF WESTMINSTER',
          postcode: 'SW1A 1AA',
        },
      ];
    }

    if (postcode === 'SW1H 9AJ') {
      return [
        {
          fullAddress: 'MINISTRY OF JUSTICE, SEVENTH FLOOR, 102, PETTY FRANCE, LONDON, SW1H 9AJ',
          street1: '102 MINISTRY OF JUSTICE, SEVENTH FLOOR, PETTY FRANCE',
          street2: '',
          town: 'LONDON',
          county: 'CITY OF WESTMINSTER',
          postcode: 'SW1H 9AJ',
        },
      ];
    }

    if (postcode === 'ZZ00 0ZZ') {
      return [];
    }

    return null;
  }
}
