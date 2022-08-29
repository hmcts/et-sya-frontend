import { Sex } from '../case';

export interface ClaimantIndividual {
  claimant_first_names?: string;
  claimant_last_name?: string;
  claimant_date_of_birth?: string;
  claimant_sex?: Sex;
  claimant_preferred_title?: string;
  claimant_title_other?: string; // custom title
}
