import { YesOrNo } from '../case';

export interface PersonalDetails {
  claimant_date_of_birth: Date;
  claimant_gender: Gender;
  claimant_registered_gender: YesOrNo; // New Field
  claimant_gender_identity: string; // New Field
  claimant_title1?: ClaimantTitle;
  claimant_title_other?: string;
}

// CCD has Not Known and Non-binary. We do not offer as a choice
export enum Gender {
  Male = 'Male',
  Female = 'Female',
  //  NotKnown = 'Not Known',
  //  NonBinary = 'Non-binary'
}

// More options in CCD
export enum ClaimantTitle {
  MR = 'Mr',
  MRS = 'Mrs',
  MISS = 'Miss',
  MS = 'Ms',
  MX = 'Mx',
  OTHER = 'Other',
}
