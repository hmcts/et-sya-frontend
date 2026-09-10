import { Organisation } from './Organisation';
import { Et1Address } from './et1Address';

export interface ClaimantRepresentative {
  name_of_representative?: string;
  myHmctsOrganisation?: Organisation;
  name_of_organisation?: string;
  representative_email_address?: string;
  representative_address?: Et1Address;
  representative_phone_number?: string;
  representative_occupation?: string;
}
