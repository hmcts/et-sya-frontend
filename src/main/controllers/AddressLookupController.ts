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
          fullAddress: 'BUCKINGHAM PALACE, LONDON, SW1A 1AA',
          street1: 'BUCKINGHAM PALACE',
          street2: '',
          town: 'LONDON',
          county: 'CITY OF WESTMINSTER',
          postcode: 'SW1A 1AA',
          country: 'ENGLAND',
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
          country: 'ENGLAND',
        },
      ];
    }

    if (postcode === 'ZZ00 0ZZ') {
      return [];
    }

    return null;
  }
}
