import { AddressUK } from './addressUK';

export interface ClaimantCorrespondence {
  claimant_email_address?: string;
  claimant_addressUK?: AddressUK;
  claimant_phone_number?: number;
  claimant_contact_preference?: string;
}
