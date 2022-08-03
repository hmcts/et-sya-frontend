import { HearingPreference, YesOrNo } from '../case';

export interface ClaimantHearingPreference {
  reasonable_adjustments?: YesOrNo;
  reasonable_adjustments_detail?: string;
  hearing_preferences?: HearingPreference[];
  hearing_assistance?: string;
}
