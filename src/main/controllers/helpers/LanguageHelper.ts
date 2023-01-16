import { AppRequest } from '../../definitions/appRequest';
import { languages } from '../../definitions/constants';

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

// Use the session language to set post url language param in describe what happened controller as the language param doesn't get appended if there's a csrf token in the url
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
