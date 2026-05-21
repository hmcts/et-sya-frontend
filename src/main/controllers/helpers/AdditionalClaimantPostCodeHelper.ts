import { AppRequest } from '../../definitions/appRequest';
import { AddressType } from '../../definitions/case';
import { PageUrls, languages } from '../../definitions/constants';
import localesCy from '../../resources/locales/cy/translation/common.json';
import locales from '../../resources/locales/en/translation/common.json';

export const getAdditionalClaimantAddressTypes = (response: Record<string, string>[], req: AppRequest): AddressType[] => {
  const additionalClaimantAddressTypes: AddressType[] = [];
  if (response?.length === 1) {
    additionalClaimantAddressTypes.push({
      selected: true,
      label: req.url?.includes(languages.WELSH_URL_POSTFIX)
        ? localesCy.selectDefaultSingle
        : locales.selectDefaultSingle,
    });
  } else if (response?.length > 0) {
    additionalClaimantAddressTypes.push({
      selected: true,
      label: req.url?.includes(languages.WELSH_URL_POSTFIX)
        ? localesCy.selectDefaultSeveral
        : locales.selectDefaultSeveral,
    });
  } else {
    additionalClaimantAddressTypes.push({
      selected: true,
      label: req.url?.includes(languages.WELSH_URL_POSTFIX) ? localesCy.selectDefaultNone : locales.selectDefaultNone,
    });
  }

  for (const address of response || []) {
    additionalClaimantAddressTypes.push({
      value: response.indexOf(address),
      label: address.fullAddress,
    });
  }
  return additionalClaimantAddressTypes;
};

export const getAdditionalClaimantAddressLink = (req: AppRequest): string => {
  return req.url?.includes(languages.WELSH_URL_POSTFIX)
    ? PageUrls.ADDITIONAL_CLAIMANT_POSTCODE_SELECT + languages.WELSH_URL_PARAMETER
    : PageUrls.ADDITIONAL_CLAIMANT_POSTCODE_SELECT + languages.ENGLISH_URL_PARAMETER;
};

export const getEnterTitle = (req: AppRequest): string => {
  return req.url?.includes(languages.WELSH_URL_POSTFIX)
    ? localesCy.additionalClaimantPostcodeEnterTitle
    : locales.additionalClaimantPostcodeEnterTitle;
};

export const getSelectTitle = (req: AppRequest): string => {
  return req.url?.includes(languages.WELSH_URL_POSTFIX)
    ? localesCy.additionalClaimantPostcodeSelectTitle
    : locales.additionalClaimantPostcodeSelectTitle;
};

export const getAddressPageHeader = (req: AppRequest): string => {
  return req.url?.includes(languages.WELSH_URL_POSTFIX)
    ? localesCy.additionalClaimantAddressPageHeader
    : locales.additionalClaimantAddressPageHeader;
};
