import { EnglishOrWelsh, HearingPanelPreference, HearingPreference, YesOrNo } from '../case';

export interface ClaimantHearingPreference {
  reasonable_adjustments?: YesOrNo;
  reasonable_adjustments_detail?: string;
  hearing_preferences?: HearingPreference[];
  claimant_hearing_panel_preference?: HearingPanelPreference;
  claimant_hearing_panel_preference_why?: string;
  hearing_assistance?: string;
  contact_language?: EnglishOrWelsh;
  hearing_language?: EnglishOrWelsh;
}
