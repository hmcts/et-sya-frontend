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
    if (!startDate) {
      return false;
    }
  }
  if (isStillWorking === 'Notice') {
    if (!startDate || !noticeEnds) {
      return false;
    }
  }
  return !(!pastEmployer || isStillWorking === undefined || !claimantWorkAddressQuestion || !respondentEnterPostcode);
};

export const validateClaimCheckDetails = (userCase: Record<string, any>): boolean => {
  if (!userCase) {
    return false;
  }

  const { claimTypePay, claimSummaryText } = userCase;

  if (!Array.isArray(claimTypePay) || claimTypePay.length === 0) {
    return false;
  }

  return !(!claimSummaryText || claimSummaryText.trim() === '');
};
