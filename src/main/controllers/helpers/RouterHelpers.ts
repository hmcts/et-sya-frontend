import * as urlModule from 'url';

import { Request, Response } from 'express';
import { LoggerInstance } from 'winston';

import { AppRequest } from '../../definitions/appRequest';
import { ErrorPages, LegacyUrls, PageUrls, languages } from '../../definitions/constants';
import { FormFields } from '../../definitions/form';

import { setUrlLanguage } from './LanguageHelper';

export const handleSaveAsDraft = (res: Response): void => {
  return res.redirect(PageUrls.CLAIM_SAVED);
};

export const conditionalRedirect = (
  req: AppRequest,
  formFields: FormFields,
  condition: boolean | string | string[]
): boolean => {
  const matchingValues = Object.entries(req.body).find(([k]) => Object.keys(formFields).some(ff => ff === k));
  if (Array.isArray(condition) && matchingValues) {
    return matchingValues.some(v => {
      return condition.some(c => (Array.isArray(v) ? v.some(e => String(e) === c) : v.includes(c)));
    });
  }
  return matchingValues?.some(v => v === condition);
};

export const returnNextPage = (req: AppRequest, res: Response, redirectUrl: string): void => {
  const nextPage = req.session.returnUrl ?? redirectUrl;
  req.session.returnUrl = undefined;
  const checkedPage = isValidUrl(nextPage) ? nextPage : setUrlLanguage(req, ErrorPages.NOT_FOUND);
  return res.redirect(checkedPage);
};

const isValidUrl = (url: string): boolean => {
  const urlStr: string[] = url.split('?');
  const baseUrl: string = urlStr[0];
  const legacyUrlValues: string[] = Object.values(LegacyUrls);
  if (legacyUrlValues.includes(baseUrl) || baseUrl === '/' || baseUrl === '#') {
    return true;
  }
  const validUrls = Object.values(PageUrls);
  for (const validUrl of validUrls) {
    if (validUrl === '/' || validUrl === '#') {
      continue;
    }
    if (baseUrl.includes(validUrl)) {
      return true;
    }
  }
  return false;
};

export const returnValidUrl = (redirectUrl: string, validUrls: string[]): string => {
  for (const url of validUrls) {
    const welshUrl = url + languages.WELSH_URL_PARAMETER;
    const englishUrl = url + languages.ENGLISH_URL_PARAMETER;
    if (redirectUrl === url) {
      return url;
    } else if (redirectUrl === welshUrl) {
      return welshUrl;
    } else if (redirectUrl === englishUrl) {
      return englishUrl;
    }
  }
  return ErrorPages.NOT_FOUND;
};

export const validateLanguageParam = (lng: string): boolean => {
  const validLanguages = [languages.WELSH, languages.ENGLISH];
  return validLanguages.includes(lng);
};

export const getLanguageParam = (url: string): string => {
  if (!url?.includes('?')) {
    return languages.ENGLISH_URL_PARAMETER;
  }
  const urlParams = new URLSearchParams(url.split('?')[1]);
  const lng = urlParams.get('lng');
  if (lng && validateLanguageParam(lng)) {
    return lng === 'cy' ? languages.WELSH_URL_PARAMETER : languages.ENGLISH_URL_PARAMETER;
  }
  return languages.ENGLISH_URL_PARAMETER;
};

export const returnSafeRedirectUrl = (req: Request, redirectUrl: string, logger: LoggerInstance): string => {
  const parsedUrl = getParsedUrl(redirectUrl);
  if (parsedUrl.host === null) {
    logger.info('No change to host in request. Redirect is safe');
  } else if (parsedUrl.host !== req.headers.host) {
    logger.error('Unauthorised External Redirect Attempted to %s', parsedUrl.href);
    logger.error(`Host ${parsedUrl.host} did not match to ${req.headers.host}`);
    return PageUrls.HOME;
  }
  return redirectUrl;
};

export const getParsedUrl = (redirectUrl: string): urlModule.UrlWithStringQuery => {
  return urlModule.parse(redirectUrl);
};

export const isReturnUrlIsCheckAnswers = (req: AppRequest): boolean => {
  return req.session.returnUrl?.includes(PageUrls.CHECK_ANSWERS);
};
