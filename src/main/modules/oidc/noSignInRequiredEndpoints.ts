import { PageUrls, languages } from '../../definitions/constants';

export const noSignInRequiredEndpoints: string[] = [
  PageUrls.HOME,
  PageUrls.CHECKLIST,
  PageUrls.LIP_OR_REPRESENTATIVE,
  PageUrls.MAKING_CLAIM_AS_LEGAL_REPRESENTATIVE,
  PageUrls.CLAIM_JURISDICTION_SELECTION,
  PageUrls.SINGLE_OR_MULTIPLE_CLAIM,
  PageUrls.ACAS_MULTIPLE_CLAIM,
  PageUrls.VALID_ACAS_REASON,
  PageUrls.CONTACT_ACAS,
  PageUrls.COOKIE_PREFERENCES,
  PageUrls.RETURN_TO_EXISTING,
  PageUrls.CASE_NUMBER_CHECK,
  PageUrls.ACCESSIBILITY_STATEMENT,
];

export const validateNoSignInEndpoints = (url: string): boolean => {
  const removeWelshQueryString = url.replace(languages.WELSH_URL_PARAMETER, '');
  const removeEnglishQueryString = url.replace(languages.ENGLISH_URL_PARAMETER, '');
  if (noSignInRequiredEndpoints.includes(removeWelshQueryString)) {
    return true;
  } else if (noSignInRequiredEndpoints.includes(removeEnglishQueryString)) {
    return true;
  }
  return false;
};
