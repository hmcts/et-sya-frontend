import { PayInterval, YesOrNo } from '../case';

export interface NewEmploymentDetails {
  new_job?: YesOrNo;
  newly_employed_from?: string;
  new_pay_before_tax?: number;
  new_job_pay_interval?: PayInterval;
}
