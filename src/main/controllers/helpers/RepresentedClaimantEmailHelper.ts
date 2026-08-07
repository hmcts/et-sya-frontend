import { AppRequest } from '../../definitions/appRequest';
import { PageUrls, languages } from '../../definitions/constants';
import localesCy from '../../resources/locales/cy/translation/common.json';
import locales from '../../resources/locales/en/translation/common.json';
export const getLink = (req: AppRequest): string => {
  return req.url?.includes(languages.WELSH_URL_POSTFIX)
    ? PageUrls.REPRESENTED_CLAIMANT_ADDRESS_DETAILS + languages.WELSH_URL_PARAMETER
    : PageUrls.REPRESENTED_CLAIMANT_ADDRESS_DETAILS + languages.ENGLISH_URL_PARAMETER;
};

export const getEnterEmailTitle = (req: AppRequest): string => {
  return req.url?.includes(languages.WELSH_URL_POSTFIX)
    ? localesCy.representedClaimantEnterEmailTitle
    : locales.representedClaimantEnterEmailTitle;
};

export const getEnterEmailHeading = (req: AppRequest): string => {
  return req.url?.includes(languages.WELSH_URL_POSTFIX)
    ? localesCy.representedClaimantEnterEmailHeading
    : locales.representedClaimantEnterEmailHeading;
};

export const getEnterEmailDescription = (req: AppRequest): string => {
  return req.url?.includes(languages.WELSH_URL_POSTFIX)
    ? localesCy.representedClaimantEnterEmailDescription
    : locales.representedClaimantEnterEmailDescription;
};

export const getEnterEmailLabel = (req: AppRequest): string => {
  return req.url?.includes(languages.WELSH_URL_POSTFIX)
    ? localesCy.representedClaimantEnterEmailLabel
    : locales.representedClaimantEnterEmailLabel;
};
