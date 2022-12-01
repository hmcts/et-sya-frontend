import { EmailOrPost, EnglishOrWelsh } from '../case';

import { Et1Address } from './et1Address';

export interface ClaimantCorrespondence {
  claimant_email_address?: string;
  claimant_addressUK?: Et1Address;
  claimant_phone_number?: string;
  claimant_contact_preference?: EmailOrPost;
  claimant_contact_language?: EnglishOrWelsh;
  claimant_hearing_language?: EnglishOrWelsh;
}
