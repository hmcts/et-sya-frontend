import { EmailOrPost } from '../case';

import { AddressUK } from './addressUK';

export interface ClaimantCorrespondence {
  claimant_email_address?: string;
  claimant_addressUK?: AddressUK;
  claimant_phone_number?: string;
  claimant_contact_preference?: EmailOrPost;
}
