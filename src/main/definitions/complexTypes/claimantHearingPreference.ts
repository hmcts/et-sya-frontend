import { EnglishOrWelsh, HearingPreference, YesOrNo } from '../case';

export interface ClaimantHearingPreference {
  reasonable_adjustments?: YesOrNo;
  reasonable_adjustments_detail?: string;
  hearing_preferences?: HearingPreference[];
  hearing_assistance?: string;
  claimant_hearing_panel_preference?: string;
  claimant_hearing_panel_preference_why?: string;
  contact_language?: EnglishOrWelsh;
  hearing_language?: EnglishOrWelsh;
}
