import * as urlModule from 'url';

import config from 'config';
import { Request, Response } from 'express';
import { LoggerInstance } from 'winston';

import { AppRequest } from '../../definitions/appRequest';
import {
  DefaultValues,
  ErrorPages,
  LegacyUrls,
  PageUrls,
  VALID_DYNAMIC_URL_BASES,
  languages,
} from '../../definitions/constants';
import { FormFields } from '../../definitions/form';
import NumberUtils from '../../utils/NumberUtils';
import StringUtils from '../../utils/StringUtils';
import UrlUtils from '../../utils/UrlUtils';

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

// Main function to redirect to the next page
export const returnNextPage = (req: AppRequest, res: Response, redirectUrl: string): void => {
  let nextPage = redirectUrl;
  if (req.session.returnUrl) {
    nextPage = req.session.returnUrl;
    req.session.returnUrl = undefined;
  }
  return res.redirect(returnValidUrl(nextPage));
};

function isFullEt1LegacyUrl(baseUrl: string, et1BaseUrl: string): boolean {
  return baseUrl.startsWith(et1BaseUrl);
}

function getStaticValidUrl(baseUrl: string, redirectUrl: string, validUrls: string[]): string | undefined {
  for (let validUrl of validUrls) {
    if (baseUrl === validUrl) {
      const parameters = UrlUtils.getRequestParamsFromUrl(redirectUrl);
      for (const param of parameters) {
        if (param !== DefaultValues.CLEAR_SELECTION_URL_PARAMETER) {
          validUrl = addParameterToUrl(validUrl, param);
        }
      }
      return validUrl;
    }
  }
  return undefined;
}

function getDynamicValidUrl(baseUrl: string, redirectUrl: string): string | undefined {
  const urlParts = baseUrl.split('/');
  let returnUrl = '';
  for (const urlPart of urlParts) {
    const matchedUrlPart = VALID_DYNAMIC_URL_BASES.find(url => url === urlPart);
    if (matchedUrlPart) {
      returnUrl += `/${matchedUrlPart}`;
    } else {
      if (NumberUtils.isNumericValue(urlPart) && urlPart.length <= 20) {
        returnUrl += `/${urlPart}`;
      }
    }
  }
  if (returnUrl) {
    const parameters = UrlUtils.getRequestParamsFromUrl(redirectUrl);
    for (const param of parameters) {
      if (param !== DefaultValues.CLEAR_SELECTION_URL_PARAMETER) {
        returnUrl = addParameterToUrl(returnUrl, param);
      }
    }
    return returnUrl;
  }
  return undefined;
}

export const returnValidUrl = (redirectUrl: string, validUrls?: string[]): string => {
  validUrls = validUrls ?? Object.values(PageUrls);
  const et1BaseUrl = process.env.ET1_BASE_URL ?? `${config.get('services.et1Legacy.url')}`;
  validUrls.push(et1BaseUrl, LegacyUrls.ET1_APPLY, LegacyUrls.ET1_PATH);

  const urlStr = redirectUrl.split('?');
  const baseUrl = urlStr[0];

  if (isFullEt1LegacyUrl(baseUrl, et1BaseUrl)) {
    return redirectUrl;
  }

  const staticUrl = getStaticValidUrl(baseUrl, redirectUrl, validUrls);
  if (staticUrl) {
    return staticUrl;
  }

  const dynamicUrl = getDynamicValidUrl(baseUrl, redirectUrl);
  if (dynamicUrl) {
    return dynamicUrl;
  }

  return ErrorPages.NOT_FOUND;
};

export const addParameterToUrl = (url: string, parameter: string): string => {
  if (StringUtils.isBlank(url)) {
    return DefaultValues.STRING_EMPTY;
  }
  if (StringUtils.isBlank(parameter)) {
    return url;
  }
  if (!url.includes(parameter)) {
    if (url.includes(DefaultValues.STRING_QUESTION_MARK)) {
      url = url + DefaultValues.STRING_AMPERSAND + parameter;
    } else {
      url = url + DefaultValues.STRING_QUESTION_MARK + parameter;
    }
  }
  return url;
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
