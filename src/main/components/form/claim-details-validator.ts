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

  if (
    (!claimSummaryFile || typeof claimSummaryFile !== 'string' || claimSummaryFile.trim() === '') &&
    (!claimSummaryText || typeof claimSummaryText !== 'string' || claimSummaryText.trim() === '')
  ) {
    return false;
  }

  return true;
};
