import { PayInterval, StillWorking, WeeksOrMonths, YesOrNo, YesOrNoOrNotSure } from '../case';

export interface ClaimantEmploymentDetails {
  pastEmployer?: YesOrNo;
  stillWorking?: StillWorking;
  claimant_occupation?: string;
  claimant_employed_from?: string;
  claimant_notice_period?: YesOrNo;
  claimant_notice_period_unit?: WeeksOrMonths;
  claimant_notice_period_duration?: string;
  claimant_average_weekly_hours?: number;
  claimant_pay_before_tax?: number;
  claimant_pay_after_tax?: number;
  claimant_pay_cycle?: PayInterval;
  claimant_pension_contribution?: YesOrNoOrNotSure;
  claimant_pension_weekly_contribution?: number;
  claimant_benefits?: YesOrNo;
  claimant_benefits_detail?: string;
}
