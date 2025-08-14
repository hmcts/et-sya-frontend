import * as urlModule from 'url';

import { Request, Response } from 'express';
import { LoggerInstance } from 'winston';

import { AppRequest } from '../../definitions/appRequest';
import { DefaultValues, ErrorPages, LegacyUrls, PageUrls, languages } from '../../definitions/constants';
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

const isRespondentWorkAddressPath = (path: string) => isDynamicPath(path, ['respondent', null, 'work-address'], 1);

const isRespondentNoAcasPath = (path: string) => isDynamicPath(path, ['respondent', null, 'no-acas-reason'], 1);

const isRespondentWorkPostcodePath = (path: string) =>
  isDynamicPath(path, ['respondent', null, 'work-postcode-enter'], 1);

const isRespondentAcasCertPath = (path: string) => isDynamicPath(path, ['respondent', null, 'acas-cert-num'], 1);

const isRespondentPostcodeEnterPath = (path: string) =>
  isDynamicPath(path, ['respondent', null, 'respondent-postcode-enter'], 1);

const isCitizenHubPath = (path: string) => isDynamicPath(path, ['citizen-hub', null], 1);

const dynamicMatchers: ((path: string) => string)[] = [
  isRespondentWorkAddressPath, // /respondent/{id}/work-address
  isRespondentNoAcasPath, // /respondent/{id}/no-acas-reason
  isRespondentWorkPostcodePath, // /respondent/{id}/work-postcode-enter
  isRespondentAcasCertPath, // /respondent/{id}/acas-cert-num
  isRespondentPostcodeEnterPath, // /respondent/{id}/respondent-postcode-enter
  isCitizenHubPath, // /citizen-hub/{id}
];

export const returnValidUrl = (redirectUrl: string, validUrls?: string[]): string => {
  // if undefined use PageURLs
  validUrls = validUrls ?? Object.values(PageUrls);
  validUrls.push(LegacyUrls.ET1);
  validUrls.push(LegacyUrls.ET1_BASE);
  // split url, first part will always be the url (in a format similar to that in PageUrls)
  const urlStr = redirectUrl.split('?');
  const baseUrl = urlStr[0];

  // check static urls
  for (let validUrl of validUrls) {
    if (baseUrl === validUrl) {
      // get parameters as an array of strings
      const parameters = UrlUtils.getRequestParamsFromUrl(redirectUrl);

      // add params to the validUrl
      for (const param of parameters) {
        // Should never add clear selection parameter.
        if (param !== DefaultValues.CLEAR_SELECTION_URL_PARAMETER) {
          validUrl = addParameterToUrl(validUrl, param);
        }
      }
      return validUrl;
    }
  }
  // check dynamic urls
  const matchedDynamic = dynamicMatchers.some(m => m(baseUrl));
  if (matchedDynamic) {
    // so temporarily include the dynamic baseUrl in the validUrls set for validation.
    const parameters = UrlUtils.getRequestParamsFromUrl(redirectUrl);
    let rebuilt = baseUrl;

    for (const param of parameters) {
      if (param !== DefaultValues.CLEAR_SELECTION_URL_PARAMETER) {
        rebuilt = addParameterToUrl(rebuilt, param);
        if (rebuilt === ErrorPages.NOT_FOUND) {
          // If any param fails validation, stop and return safe fallback.
          return ErrorPages.NOT_FOUND;
        }
      }
    }
    return rebuilt;
  }

  // Return a safe fallback if no validUrl is found
  return ErrorPages.NOT_FOUND;
};

function isDynamicPath(path: string, expectedSegments: (string | null)[], numericIndex: number | null = null): string {
  const seg = toSegments(path);
  if (seg.length !== expectedSegments.length) {
    return null;
  }
  for (let i = 0; i < expectedSegments.length; i++) {
    if (expectedSegments[i] !== null && seg[i] !== expectedSegments[i]) {
      return null;
    }
    if (numericIndex === i && !NumberUtils.isNumericValue(seg[i])) {
      return null;
    }
  }
  return '/' + seg.join('/');
}

function toSegments(path: string): string[] {
  const p = path.split('?')[0].split('#')[0];
  const trimmed = p.startsWith('/') ? p.slice(1) : p;
  if (!trimmed) {
    return [];
  }
  return trimmed.endsWith('/') && trimmed.length > 1 ? trimmed.slice(0, -1).split('/') : trimmed.split('/');
}

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
