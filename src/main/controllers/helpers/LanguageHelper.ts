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
  if ((req.url as string)?.includes(languages.ENGLISH_URL_PARAMETER || languages.ENGLISH_LOCALE)) {
    i18nLanguageCookie = languages.ENGLISH;
  }
  if ((req.url as string)?.includes(languages.ENGLISH_URL_PARAMETER || languages.ENGLISH_LOCALE)) {
    i18nLanguageCookie = languages.WELSH;
  }
  return i18nLanguageCookie;
};
