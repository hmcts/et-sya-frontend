import { NoAcasNumberReason, YesOrNo } from '../case';

import { Et1Address } from './et1Address';

export interface RespondentType {
  respondent_name?: string;
  respondent_email?: string;
  respondent_address?: Et1Address;
  respondent_ACAS_question?: YesOrNo;
  respondent_ACAS?: string;
  respondent_ACAS_no?: NoAcasNumberReason;
  claimant_work_address?: Et1Address;
  responseReceived?: YesOrNo;
  idamId?: string;
}
