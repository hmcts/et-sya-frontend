import { AppRequest } from '../../definitions/appRequest';
import { Parties, languages } from '../../definitions/constants';

export const setUrlLanguage = (req: AppRequest, redirectUrl: string): string => {
  if (req.url?.includes(languages.WELSH_URL_PARAMETER)) {
    redirectUrl += languages.WELSH_URL_PARAMETER;
    req.session.lang = languages.WELSH;
  }
  if (req.url?.includes(languages.ENGLISH_URL_PARAMETER)) {
    redirectUrl += languages.ENGLISH_URL_PARAMETER;
    req.session.lang = languages.ENGLISH;
  }
  return redirectUrl;
};

export const setChangeAnswersUrlLanguage = (req: AppRequest): string => {
  if (req.cookies.i18next === languages.WELSH) {
    return languages.WELSH_URL_PARAMETER;
  }
  return languages.ENGLISH_URL_PARAMETER;
};

export const setCheckAnswersLanguage = (req: AppRequest, sessionUrl: string): string => {
  if (req.cookies.i18next === languages.WELSH) {
    return sessionUrl + languages.WELSH_URL_PARAMETER;
  }
  return sessionUrl + languages.ENGLISH_URL_PARAMETER;
};

// Use the session language to set post url language param if there's a csrf token in the url
export const setUrlLanguageFromSessionLanguage = (req: AppRequest, redirectUrl: string): string => {
  if (req.session.lang === languages.WELSH) {
    if (!redirectUrl.includes(languages.WELSH_URL_PARAMETER)) {
      redirectUrl += languages.WELSH_URL_PARAMETER;
    }
  }
  if (req.session.lang === languages.ENGLISH) {
    if (!redirectUrl.includes(languages.ENGLISH_URL_PARAMETER)) {
      redirectUrl += languages.ENGLISH_URL_PARAMETER;
    }
  }
  return redirectUrl;
};

export const setSentToLanguage = (languageParam: string, sentTo: string): string => {
  const welshTranslations: { [key: string]: string } = {
    [Parties.BOTH_PARTIES]: Parties.BOTH_PARTIES_WELSH,
    [Parties.CLAIMANT_ONLY]: Parties.CLAIMANT_ONLY_WELSH,
    [Parties.RESPONDENT_ONLY]: Parties.RESPONDENT_ONLY_WELSH,
  };

  return languageParam === languages.WELSH_URL_PARAMETER
    ? welshTranslations[sentTo as keyof typeof welshTranslations] || sentTo
    : sentTo;
};
