import { AppRequest } from '../../definitions/appRequest';
import { AddressType } from '../../definitions/case';
import { PageUrls, languages } from '../../definitions/constants';
import localesCy from '../../resources/locales/cy/translation/common.json';
import locales from '../../resources/locales/en/translation/common.json';

export const getAddressAddressTypes = (response: Record<string, string>[], req: AppRequest): AddressType[] => {
  const addressAddressTypes: AddressType[] = [];
  if (response?.length === 1) {
    addressAddressTypes.push({
      selected: true,
      label: req.url?.includes(languages.WELSH_URL_POSTFIX)
        ? localesCy.selectDefaultSingle
        : locales.selectDefaultSingle,
    });
  } else if (response?.length > 0) {
    addressAddressTypes.push({
      selected: true,
      label: req.url?.includes(languages.WELSH_URL_POSTFIX)
        ? localesCy.selectDefaultSeveral
        : locales.selectDefaultSeveral,
    });
  } else {
    addressAddressTypes.push({
      selected: true,
      label: req.url?.includes(languages.WELSH_URL_POSTFIX) ? localesCy.selectDefaultNone : locales.selectDefaultNone,
    });
  }
  for (const address of response || []) {
    addressAddressTypes.push({
      value: response.indexOf(address),
      label: address.fullAddress,
    });
  }
  return addressAddressTypes;
};

export const getLink = (req: AppRequest): string => {
  return req.url?.includes(languages.WELSH_URL_POSTFIX)
    ? PageUrls.ADDRESS_DETAILS + languages.WELSH_URL_PARAMETER
    : PageUrls.ADDRESS_DETAILS + languages.ENGLISH_URL_PARAMETER;
};

export const getEnterTitle = (req: AppRequest): string => {
  return req.url?.includes(languages.WELSH_URL_POSTFIX)
    ? localesCy.addressPostcodeEnterTitle
    : locales.addressPostcodeEnterTitle;
};

export const getSelectTitle = (req: AppRequest): string => {
  return req.url?.includes(languages.WELSH_URL_POSTFIX)
    ? localesCy.addressPostcodeSelectTitle
    : locales.addressPostcodeSelectTitle;
};
