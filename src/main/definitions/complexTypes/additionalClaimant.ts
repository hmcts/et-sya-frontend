import { AddressUK } from './addressUK';

export interface AdditionalClaimantType {
  title?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  dob?: string;
  address?: AddressUK;
}
