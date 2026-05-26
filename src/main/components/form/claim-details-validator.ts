export const validatePersonalDetails = (userCase: Record<string, any>): boolean => {
  if (!userCase) {
    return false;
  }
  const { address1, addressTown, addressPostcode, addressCountry } = userCase;

  return !(!address1 || !addressTown || !addressPostcode || !addressCountry);
};

export const validateEmploymentAndRespondentDetails = (userCase: Record<string, any>): boolean => {
  if (!userCase) {
    return false;
  }

  const { respondents } = userCase;

  for (const respondent of respondents) {
    if (
      !respondent.respondentName ||
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

export const validateRepresentativeDetails = (userCase: Record<string, any>): boolean => {
  if (!userCase) {
    return false;
  }
  const { representativeName, repAddress1 } = userCase;
  return !(!representativeName || !repAddress1);
};

export const validateClaimCheckDetails = (userCase: Record<string, any>): boolean => {
  if (!userCase) {
    return false;
  }

  const { typeOfClaim, claimSummaryFile, claimSummaryText, claimTypeDiscrimination, claimTypePay } = userCase;

  if (!typeOfClaim || !Array.isArray(typeOfClaim) || typeOfClaim.length === 0) {
    return false;
  }

  if (typeOfClaim.includes('discrimination') && (!claimTypeDiscrimination || claimTypeDiscrimination.length === 0)) {
    return false;
  }

  if (typeOfClaim.includes('payRelated') && (!claimTypePay || claimTypePay.length === 0)) {
    return false;
  }

  const hasClaimSummaryFile =
    claimSummaryFile &&
    (typeof claimSummaryFile === 'object' || (typeof claimSummaryFile === 'string' && claimSummaryFile.trim() !== ''));
  const hasClaimSummaryText =
    claimSummaryText && typeof claimSummaryText === 'string' && claimSummaryText.trim() !== '';

  return !(!hasClaimSummaryFile && !hasClaimSummaryText);
};
