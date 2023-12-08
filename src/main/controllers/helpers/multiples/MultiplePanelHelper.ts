import { CaseWithId, YesOrNo } from '../../../definitions/case';
import { AnyRecord } from '../../../definitions/util-types';
import { getFlagValue } from '../../../modules/featureFlag/launchDarkly';

export const getMultiplePanelData = async (
  userCase: CaseWithId,
  translations: AnyRecord
): Promise<MultiplePanelData> => {
  const multipleFlag = await getFlagValue('multiples', null);
  console.log('Multiple flag: ' + multipleFlag);
  if (userCase?.multipleFlag !== YesOrNo.YES && multipleFlag === false) {
    return;
  }
  const data = new MultiplePanelData();
  if (userCase?.leadClaimant === YesOrNo.YES) {
    data.banner = translations.multiples?.leadClaim;
    data.text = translations.multiples?.designated;
  } else {
    // TODO: Differentiate between stayed and non-lead case
    data.banner = translations.multiples?.stayedCase;
    data.text = translations.multiples?.stayed;
  }
  return data;
};

export class MultiplePanelData {
  banner?: string;
  text?: string;
}
