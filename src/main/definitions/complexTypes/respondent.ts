import { NoAcasNumberReason, YesOrNo } from '../case';

import { Et1Address } from './et1Address';
import { Et3Vetting } from './et3Vetting';

export interface RespondentType {
  respondent_name?: string;
  respondent_address?: Et1Address;
  respondent_ACAS_question?: YesOrNo;
  respondent_ACAS?: string;
  respondent_ACAS_no?: NoAcasNumberReason;
  responseRespondentName?: string;
  responseRespondentAddress?: Et1Address;
  responseRespondentEmail?: string;
  responseRespondentContactPreference?: string;
  claimant_work_address?: Et1Address;
  responseReceived?: YesOrNo;
  response_status?: string;
  idamId?: string;
  et3Vetting: Et3Vetting;
}
