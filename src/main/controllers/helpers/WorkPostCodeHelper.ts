import { AppRequest } from '../../definitions/appRequest';
import { AddressType } from '../../definitions/case';
import { languages } from '../../definitions/constants';
import localesCy from '../../resources/locales/cy/translation/common.json';
import locales from '../../resources/locales/en/translation/common.json';

export const getWorkAddressTypes = (response: Record<string, string>[], req: AppRequest): AddressType[] => {
  const workAddressTypes: AddressType[] = [];
  if (response?.length === 1) {
    workAddressTypes.push({
      selected: true,
      label: req.url?.includes(languages.WELSH_URL_POSTFIX)
        ? localesCy.selectDefaultSingle
        : locales.selectDefaultSingle,
    });
  } else if (response?.length > 0) {
    workAddressTypes.push({
      selected: true,
      label: req.url?.includes(languages.WELSH_URL_POSTFIX)
        ? localesCy.selectDefaultSeveral
        : locales.selectDefaultSeveral,
    });
  } else {
    workAddressTypes.push({
      selected: true,
      label: req.url?.includes(languages.WELSH_URL_POSTFIX) ? localesCy.selectDefaultNone : locales.selectDefaultNone,
    });
  }
  for (const address of response || []) {
    workAddressTypes.push({
      value: response.indexOf(address),
      label: address.fullAddress,
    });
  }
  return workAddressTypes;
};

export const getEnterTitle = (req: AppRequest): string => {
  return req.url?.includes(languages.WELSH_URL_POSTFIX)
    ? localesCy.workPostcodeEnterTitle
    : locales.workPostcodeEnterTitle;
};

export const getSelectTitle = (req: AppRequest): string => {
  return req.url?.includes(languages.WELSH_URL_POSTFIX)
    ? localesCy.workPostcodeSelectTitle
    : locales.workPostcodeSelectTitle;
};
