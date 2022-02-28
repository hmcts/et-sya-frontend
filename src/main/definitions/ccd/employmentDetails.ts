import { YesOrNo } from '../case';

import { AddressUK } from './contactDetails';

// Only fields pre-existing in ECM - claimant_occupation, claimant_employed_from, claimant_employed_to, claimant_employed_notice_period

interface EmploymentDetails {
  claimant_occupation: string;
  claimant_employed_from: Date;
  average_weekly_hours: number;
  pay_before_tax: number;
  pay_after_tax: number;
  pension_scheme: YesOrNo;
  benefits: YesOrNo;
  benefits_details?: string;
}

export interface EmploymentDetailsWorking extends EmploymentDetails {
  notice_period: YesOrNo;
  notice_period_details?: NoticePeriodDuration;
}

export interface EmploymentDetailsNotice extends EmploymentDetails {
  claimant_employed_notice_period: Date;
  notice_period_paid?: NoticePeriodDuration;
}

export interface EmploymentDetailsNoLongerWorking extends EmploymentDetails {
  claimant_employed_to: Date;
  notice_period: YesOrNo;
  notice_period_length: NoticePeriodDuration;
  notice_period_paid?: NoticePeriodDuration;
  new_job: YesOrNo;
  new_job_start_date?: Date;
  new_job_pay_before_tax: number;
  work_address: AddressUK;
}

export enum NoticePeriodDuration {
  weeks = 0,
  months = 0,
}
