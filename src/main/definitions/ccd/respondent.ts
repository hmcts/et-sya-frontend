import { YesOrNo } from '../case';

import { AddressUK } from './contactDetails';

export interface Respondent {
  respondent_type: RespondentType; // New
  respondent_ACAS_question: YesOrNo;
  respondent_ACAS?: string;
  respondent_ACAS_no?: ACASExemption;
  respondent_name: string;
  respondent_phone1: string;
  respondent_address: AddressUK;
}

export enum RespondentType {
  ORGANISATION = 'Organisation',
  PERSON = 'Person',
}

export enum ACASExemption {
  ANOTHER_PERSON = 'Another person',
  NO_POWER = 'No Power',
  EMPLOYER_IN_TOUCH = 'Employer already in touch',
  UNFAIR_DISMISSAL = 'Unfair dismissal',
  ECC = 'ECC',
}
