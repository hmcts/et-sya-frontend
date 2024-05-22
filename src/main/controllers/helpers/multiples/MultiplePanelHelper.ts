import { CaseWithId, YesOrNo } from '../../../definitions/case';
import { FEATURE_FLAGS } from '../../../definitions/constants';
import { MultiplePanelData } from '../../../definitions/multiples/multiplePanelData';
import { AnyRecord } from '../../../definitions/util-types';
import { getFlagValue } from '../../../modules/featureFlag/launchDarkly';

export const getMultiplePanelData = async (
  userCase: CaseWithId,
  translations: AnyRecord
): Promise<MultiplePanelData> => {
  const MUL2 = await getFlagValue(FEATURE_FLAGS.MUL2, null);
  if (MUL2 === false || userCase?.multipleFlag !== YesOrNo.YES) {
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
