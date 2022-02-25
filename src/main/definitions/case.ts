import { TypesOfClaim } from './definition';
import { UnknownRecord } from './util-types';

export enum Checkbox {
  Checked = 'checked',
  Unchecked = '',
}

export interface CaseDate {
  year: string;
  month: string;
  day: string;
}

export interface Address {
  AddressLine1: string;
  AddressLine2: string;
  AddressLine3: string;
  PostTown: string;
  County: string;
  PostCode: string;
  Country: string;
}

export interface Case {
  dobDate: CaseDate;
  address1?: string;
  address2?: string;
  addressTown?: string;
  addressCounty?: string;
  addressPostcode?: string;
  acasMultiple?: YesOrNo;
  updatePreference?: YesOrNo;
  representingMyself?: YesOrNo;
  IsASingleClaim?: YesOrNo;
  isAcasSingle?: YesOrNo;
  telNumber?: string;
  validNoAcasReason?: YesOrNo;
  returnToExisting: YesOrNo;
  isMultipleRespondent?: YesOrNo;
  jobTitle?: string;
  presentEmployer?: YesOrNo;
  typeOfClaim?: TypesOfClaim[];
  pastEmployer?: YesOrNo;
  workAddress1?: string;
  workAddress2?: string;
  workAddressTown?: string;
  workAddressCounty?: string;
  workAddressPostcode?: string;
}

export interface CaseWithId extends Case {
  id: string;
}

export const enum YesOrNo {
  YES = 'Yes',
  NO = 'No',
}

export type DateParser = (property: string, body: UnknownRecord) => CaseDate;
