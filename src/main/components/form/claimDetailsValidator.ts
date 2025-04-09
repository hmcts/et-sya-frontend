export const validatePersonalDetails = (userCase: Record<string, any>): boolean => {
  if (!userCase) {
    return false;
  }

  const {
    typeOfClaim,
    reasonableAdjustments,
    personalDetailsCheck,
    hearingPreferences,
    claimantContactPreference,
    claimantContactLanguagePreference,
    claimantHearingLanguagePreference,
    address1,
    addressTown,
    addressPostcode,
  } = userCase;

  if (
    !typeOfClaim ||
    !reasonableAdjustments ||
    !personalDetailsCheck ||
    !hearingPreferences ||
    !claimantContactPreference ||
    !claimantContactLanguagePreference ||
    !claimantHearingLanguagePreference ||
    !address1 ||
    !addressTown ||
    !addressPostcode
  ) {
    return false;
  }

  return true;
};

export const validateEmploymentAndRespondentDetails = (userCase: Record<string, any>): boolean => {
  if (!userCase) {
    return false;
  }

  const { startDate, pastEmployer, isStillWorking, claimantWorkAddressQuestion, respondentEnterPostcode, noticeEnds } =
    userCase;

  if (pastEmployer === 'Yes') {
    // If pastEmployer is 'Yes', validate additional fields
    if (!startDate) {
      return false; // Return false if any required field is missing
    }
  }
  if (isStillWorking === 'Notice') {
    // If isStillWorking is 'Notice', validate additional fields
    if (!startDate || !noticeEnds) {
      return false; // Return false if any required field is missing
    }
  }
  if (
    !pastEmployer ||
    isStillWorking === undefined || // Explicitly check for undefined
    !claimantWorkAddressQuestion ||
    !respondentEnterPostcode
  ) {
    return false;
  }

  return true;
};

export const validateClaimCheckDetails = (userCase: Record<string, any>): boolean => {
  if (!userCase) {
    return false;
  }

  const { claimTypePay, claimSummaryText } = userCase;

  // Validate claimTypePay is a non-empty array
  if (!Array.isArray(claimTypePay) || claimTypePay.length === 0) {
    return false;
  }

  // Validate claimSummaryText is present and not empty
  return !(!claimSummaryText || claimSummaryText.trim() === '');
};
