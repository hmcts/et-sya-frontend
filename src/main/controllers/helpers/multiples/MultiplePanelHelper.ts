import { CaseWithId, YesOrNo } from '../../../definitions/case';
import { AnyRecord } from '../../../definitions/util-types';

export const getMultiplePanelData = (userCase: CaseWithId, translations: AnyRecord): MultiplePanelData => {
  if (userCase?.multipleFlag !== YesOrNo.YES) {
    return;
  }
  const data = new MultiplePanelData();
  if (userCase?.leadClaimant === YesOrNo.YES) {
    data.banner = translations.multiples?.leadClaim;
    data.text = translations.multiples?.designated;
  } else {
    // To do: Differentiate between stayed and non-lead case
    data.banner = translations.multiples?.stayedCase;
    data.text = translations.multiples?.stayed;
  }
  return data;
};

export class MultiplePanelData {
  banner?: string;
  text?: string;
}
