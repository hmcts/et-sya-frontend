import { Organisation } from './Organisation';

export interface ClaimantRepresentative {
  name_of_representative?: string;
  myHmctsOrganisation?: Organisation;
  name_of_organisation?: string;
}
