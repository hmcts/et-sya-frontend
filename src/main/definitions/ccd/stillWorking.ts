import { YesOrNo } from '../case';

// Entirely new class
export interface StillWorking {
  past_employer: YesOrNo;
  still_working: StillWorkingAnswers;
}

export enum StillWorkingAnswers {
  YES = 'Yes - still working',
  YES_NOTICE = 'Yes - working notice',
  NO = 'No - no longer working',
}
