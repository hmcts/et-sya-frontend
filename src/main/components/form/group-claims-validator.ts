import { AppRequest } from '../../definitions/appRequest';
import { AdditionalClaimant, CaseType, YesOrNo } from '../../definitions/case';

export const validateAdditionalClaimants = (claimants: AdditionalClaimant[]): boolean => {
  for (const claimant of claimants) {
    const hasFirstName = claimant?.firstName?.trim() !== '';
    const hasLastName = claimant?.lastName?.trim() !== '';

    if (!hasFirstName || !hasLastName) {
      return false;
    }

    const address = claimant?.address;
    const hasAddressLine1 = address?.AddressLine1?.trim() !== '';
    const hasCountry = address?.Country?.trim() !== '';
    const hasPostTown = address?.PostTown?.trim() !== '';

    if (!hasAddressLine1 || !hasCountry || !hasPostTown) {
      return false;
    }
  }

  return true;
};

export const validateGroupClaimsCheckDetails = (req?: AppRequest, userCase?: Record<string, any>): boolean => {
  if (!userCase) {
    return false;
  }

  const { caseType, additionalClaimants, leadClaimant, additionalClaimantSpreadsheet } = userCase;

  if (caseType === CaseType.SINGLE) {
    return true;
  }

  if (caseType !== CaseType.MULTIPLE) {
    return false;
  }

  const hasLeadClaimantSelection = leadClaimant === YesOrNo.YES || leadClaimant === YesOrNo.NO;

  if (additionalClaimantSpreadsheet) {
    return hasLeadClaimantSelection;
  }

  const hasAdditionalClaimants = Array.isArray(additionalClaimants) && additionalClaimants.length > 0;

  return hasAdditionalClaimants && validateAdditionalClaimants(additionalClaimants) && hasLeadClaimantSelection;
};
