import { GenderTitle, Sex, YesOrNoOrPreferNot } from '../case';

export interface ClaimantIndividual {
  claimant_first_names?: string;
  claimant_last_name?: string;
  claimant_date_of_birth?: string;
  claimant_sex?: Sex;
  claimant_gender_identity_same?: YesOrNoOrPreferNot;
  claimant_gender_identity?: string;
  claimant_preferred_title?: GenderTitle;
  claimant_title_other?: string; // custom title
}
