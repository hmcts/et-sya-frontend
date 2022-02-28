import { YesOrNo } from '../case';

// Properties belong to ClaimantCorrespondence ComplexType
export interface ContactDetails {
  claimant_addressUK: AddressUK;
  claimant_contact_preference: ContactPreference;
}

export interface Preferences {
  // In CCD these two are under EmploymentDetails complex type. Not sure this is the right one
  claimant_disabled: YesOrNo;
  claimant_disabled_detail?: string;

  claimant_contact_preference: ContactPreference; // Belongs to ClaimantCorrespondence, perhaps should be part of above interface
  video_hearings: YesOrNo; // New
}

export enum ContactPreference {
  Email = 'Email',
  Post = 'Post',
}

export interface AddressUK {
  AddressLine1: string;
  AddressLine2?: string;
  PostTown?: string;
  County?: string;
  Country?: string;
  PostCode: string;
}
