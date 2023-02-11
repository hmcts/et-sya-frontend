import { PageUrls, Urls, languages } from '../../definitions/constants';

export const noSignInRequiredEndpoints: string[] = [
  PageUrls.HOME,
  PageUrls.CHECKLIST,
  PageUrls.LIP_OR_REPRESENTATIVE,
  PageUrls.WORK_POSTCODE,
  PageUrls.SINGLE_OR_MULTIPLE_CLAIM,
  PageUrls.ACAS_MULTIPLE_CLAIM,
  PageUrls.VALID_ACAS_REASON,
  PageUrls.CONTACT_ACAS,
  PageUrls.TYPE_OF_CLAIM,
  PageUrls.COOKIE_PREFERENCES,
  PageUrls.RETURN_TO_EXISTING,
  PageUrls.ACCESSIBILITY_STATEMENT,
  PageUrls.YOUR_APPLICATIONS,
  Urls.INFO,
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
