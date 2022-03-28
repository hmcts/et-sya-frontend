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

export interface Case {
  dobDate: CaseDate;
  address1?: string;
  address2?: string;
  addressTown?: string;
  addressCounty?: string;
  addressPostcode?: string;
  acasMultiple?: YesOrNo;
  updatePreference?: EmailOrPost;
  representingMyself?: YesOrNo;
  isASingleClaim?: YesOrNo;
  isAcasSingle?: YesOrNo;
  telNumber?: string;
  validNoAcasReason?: YesOrNo;
  returnToExisting: YesOrNo;
  isMultipleRespondent?: YesOrNo;
  jobTitle?: string;
  presentEmployer?: YesOrNo;
  typeOfClaim?: TypesOfClaim[];
  pastEmployer?: YesOrNo;
  noticePeriod?: YesOrNo;
  noticePeriodLength?: string;
  noticePeriodUnit?: WeeksOrMonths;
  isStillWorking: StillWorking;
  workAddress1?: string;
  workAddress2?: string;
  workAddressTown?: string;
  workAddressCounty?: string;
  workAddressPostcode?: string;
  startDate: CaseDate;
}

export const enum StillWorking {
  WORKING = 'WORKING',
  NOTICE = 'NOTICE',
  NO_LONGER_WORKING = 'NO LONGER WORKING',
}

export interface CaseWithId extends Case {
  id: string;
}

export const enum YesOrNo {
  YES = 'Yes',
  NO = 'No',
}

export const enum WeeksOrMonths {
  WEEKS = 'Weeks',
  MONTHS = 'Months',
}

export const enum EmailOrPost {
  EMAIL = 'Email',
  POST = 'Post',
}

export type DateParser = (property: string, body: UnknownRecord) => CaseDate;
