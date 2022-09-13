import { EmailOrPost } from '../case';

import { Et1Address } from './ET1Address';

export interface ClaimantCorrespondence {
  claimant_email_address?: string;
  claimant_addressUK?: Et1Address;
  claimant_phone_number?: number;
  claimant_contact_preference?: EmailOrPost;
}
