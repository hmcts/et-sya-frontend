import { AppRequest } from '../../definitions/appRequest';
import { languages } from '../../definitions/constants';

export const setUrlLanguage = (req: AppRequest, redirectUrl: string): string => {
  if ((req.url as string)?.includes(languages.ENGLISH_URL_PARAMETER)) {
    redirectUrl += languages.ENGLISH_URL_PARAMETER;
    req.session.lang = languages.ENGLISH;
    req.cookies.i18next = languages.ENGLISH;
  }
  if ((req.url as string)?.includes(languages.WELSH_URL_PARAMETER)) {
    redirectUrl += languages.WELSH_URL_PARAMETER;
    req.session.lang = languages.WELSH;
    req.cookies.i18next = languages.WELSH;
  }
  return redirectUrl;
};

export const setCallbackUrlLanguage = (req: AppRequest, languageRequestParam: string): string => {
  if ((req.cookies.i18next as string)?.includes(languages.ENGLISH_URL_PARAMETER)) {
    languageRequestParam = languages.ENGLISH;
  }
  if ((req.cookies.i18next as string)?.includes(languages.WELSH_URL_PARAMETER)) {
    languageRequestParam = languages.WELSH;
  }
  return languageRequestParam;
};

export const setI18nLanguageCookie = (req: AppRequest, i18nLanguageCookie: string): string => {
  if ((req.url as string)?.includes(languages.WELSH_URL_PARAMETER || languages.WELSH_LOCALE)) {
    i18nLanguageCookie = languages.WELSH;
  }
  if ((req.url as string)?.includes(languages.ENGLISH_URL_PARAMETER || languages.ENGLISH_LOCALE)) {
    i18nLanguageCookie = languages.ENGLISH;
  }
  return i18nLanguageCookie;
};

export const setChangeAnswersUrlLanguage = (req: AppRequest, redirectUrlParam: string): string => {
  if (req.session.lang === languages.WELSH || (req.url as string)?.includes(languages.WELSH_URL_PARAMETER)) {
    redirectUrlParam = languages.WELSH_URL_PARAMETER;
  }
  if (req.session.lang === languages.ENGLISH || (req.url as string)?.includes(languages.ENGLISH_URL_PARAMETER)) {
    redirectUrlParam = languages.ENGLISH_URL_PARAMETER;
  }
  return redirectUrlParam;
};

export const setClaimSavedLanguage = (req: AppRequest, redirectUrl: string): string => {
  req.session.lang = setI18nLanguageCookie(req, req.session.lang);
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

export const setCheckAnswersLanguage = (req: AppRequest, sessionUrl: string): string => {
  if (req.session.lang === languages.WELSH || (req.url as string)?.includes(languages.WELSH_URL_PARAMETER)) {
    sessionUrl += languages.WELSH_URL_PARAMETER;
  }
  if (req.session.lang === languages.ENGLISH || (req.url as string)?.includes(languages.ENGLISH_URL_PARAMETER)) {
    sessionUrl += languages.ENGLISH_URL_PARAMETER;
  }
  return sessionUrl;
};
