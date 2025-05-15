import { AppRequest } from '../../definitions/appRequest';
import { AddressType } from '../../definitions/case';
import { languages } from '../../definitions/constants';
import localesCy from '../../resources/locales/cy/translation/common.json';
import locales from '../../resources/locales/en/translation/common.json';

export const getRespondentAddressTypes = (req: AppRequest, response: Record<string, string>[]): AddressType[] => {
  const respondentAddressTypes: AddressType[] = [];
  if (response.length === 1) {
    respondentAddressTypes.push({
      selected: true,
      label: req.url?.includes(languages.WELSH_URL_POSTFIX)
        ? localesCy.selectDefaultSingle
        : locales.selectDefaultSingle,
    });
  } else if (response.length > 0) {
    respondentAddressTypes.push({
      selected: true,
      label: req.url?.includes(languages.WELSH_URL_POSTFIX)
        ? localesCy.selectDefaultSeveral
        : locales.selectDefaultSeveral,
    });
  } else {
    respondentAddressTypes.push({
      selected: true,
      label: req.url?.includes(languages.WELSH_URL_POSTFIX) ? localesCy.selectDefaultNone : locales.selectDefaultNone,
    });
  }
  for (const address of response) {
    respondentAddressTypes.push({
      value: response.indexOf(address),
      label: address.fullAddress,
    });
  }
  return respondentAddressTypes;
};

export const getEnterTitle = (req: AppRequest): string => {
  return req.url?.includes(languages.WELSH_URL_POSTFIX)
    ? localesCy.respondentPostcodeEnterTitle
    : locales.respondentPostcodeEnterTitle;
};

export const getSelectTitle = (req: AppRequest): string => {
  return req.url?.includes(languages.WELSH_URL_POSTFIX)
    ? localesCy.respondentPostcodeSelectTitle
    : locales.respondentPostcodeSelectTitle;
};
