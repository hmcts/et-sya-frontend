import { CaseType, YesOrNo } from '../../definitions/case';

export const validatePersonalDetails = (userCase: Record<string, any>): boolean => {
  if (!userCase) {
    return false;
  }
  const { address1, addressTown, addressPostcode, addressCountry } = userCase;

  return !(!address1 || !addressTown || !addressPostcode || !addressCountry);
};

export const validateGroupClaimsCheckDetails = (userCase?: Record<string, any>): boolean => {
  if (!userCase) {
    return false;
  }

  const { caseType, additionalClaimants, leadClaimant } = userCase;

  if (caseType === CaseType.SINGLE) {
    return true;
  }

  if (caseType !== CaseType.MULTIPLE) {
    return false;
  }

  console.log(leadClaimant, additionalClaimants);
  console.log(userCase.groupClaimsCheck);

  const hasAdditionalClaimants = Array.isArray(additionalClaimants) && additionalClaimants.length > 0;
  const hasLeadClaimantSelection = leadClaimant === YesOrNo.YES || leadClaimant === YesOrNo.NO;

  return hasAdditionalClaimants && hasLeadClaimantSelection;
};

export const validateEmploymentAndRespondentDetails = (userCase: Record<string, any>): boolean => {
  if (!userCase) {
    return false;
  }

  const { respondents } = userCase;

  for (const respondent of respondents) {
    if (
      !respondent.respondentAddress1 ||
      !respondent.respondentAddressTown ||
      !respondent.respondentAddressCountry ||
      !respondent.acasCert
    ) {
      return false;
    }

    if (respondent.acasCert === 'No' && !respondent.noAcasReason) {
      return false;
    }

    if (respondent.acasCert === 'Yes' && !respondent.acasCertNum) {
      return false;
    }
  }

  return true;
};

export const validateClaimCheckDetails = (userCase: Record<string, any>): boolean => {
  if (!userCase) {
    return false;
  }

  const { typeOfClaim, claimSummaryFile, claimSummaryText } = userCase;

  if (!typeOfClaim || !Array.isArray(typeOfClaim) || typeOfClaim.length === 0) {
    return false;
  }

  const hasClaimSummaryFile =
    claimSummaryFile &&
    (typeof claimSummaryFile === 'object' || (typeof claimSummaryFile === 'string' && claimSummaryFile.trim() !== ''));
  const hasClaimSummaryText =
    claimSummaryText && typeof claimSummaryText === 'string' && claimSummaryText.trim() !== '';

  return !(!hasClaimSummaryFile && !hasClaimSummaryText);
};
