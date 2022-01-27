import { UnknownRecord } from './util-types';

export enum Checkbox {
  Checked = 'checked',
  Unchecked = ''
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
  videoHearing?: YesOrNo;
}

export interface CaseWithId extends Case {
  id: string;
}

export const enum YesOrNo {
  YES = 'Yes',
  NO = 'No',
}

export type DateParser = (property: string, body: UnknownRecord) => CaseDate
