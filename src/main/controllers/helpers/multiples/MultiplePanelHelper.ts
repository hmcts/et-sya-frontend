import { CaseWithId, YesOrNo } from '../../../definitions/case';
import { FEATURE_FLAGS } from '../../../definitions/constants';
import { MultiplePanelData } from '../../../definitions/multiples/multiplePanelData';
import { AnyRecord } from '../../../definitions/util-types';
import { getFlagValue } from '../../../modules/featureFlag/launchDarkly';

export const showMutipleData = async (userCase: CaseWithId): Promise<boolean> => {
  return (await getFlagValue(FEATURE_FLAGS.MUL2, null)) && userCase?.multipleFlag === YesOrNo.YES;
};

export const getMultiplePanelData = async (
  userCase: CaseWithId,
  translations: AnyRecord,
  showMultipleData: boolean
): Promise<MultiplePanelData> => {
  if (!showMultipleData) {
    return;
  }
  const data = new MultiplePanelData();
  if (userCase?.leadClaimant === YesOrNo.YES) {
    data.banner = translations.multiples?.leadClaim;
    data.text = translations.multiples?.designated;
  } else if (userCase?.caseStayed === YesOrNo.YES) {
    data.banner = translations.multiples?.stayedCase;
    data.text = translations.multiples?.stayed;
  } else {
    data.text = translations.multiples?.nonLead;
  }
  return data;
};
