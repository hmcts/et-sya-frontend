import { AppRequest } from '../../definitions/appRequest';
import { AddressType } from '../../definitions/case';
import localesCy from '../../resources/locales/cy/translation/common.json';
import locales from '../../resources/locales/en/translation/common.json';

export const getRespondentAddressTypes = (req: AppRequest, response: Record<string, string>[]): AddressType[] => {
  const respondentAddressTypes: AddressType[] = [];
  if (response.length > 0) {
    respondentAddressTypes.push({
      selected: true,
      label: req.url?.includes('lng=cy') ? localesCy.selectDefaultSeveral : locales.selectDefaultSeveral,
    });
  } else if (response.length === 1) {
    respondentAddressTypes.push({
      selected: true,
      label: req.url?.includes('lng=cy') ? localesCy.selectDefaultSingle : locales.selectDefaultSingle,
    });
  } else {
    respondentAddressTypes.push({
      selected: true,
      label: req.url?.includes('lng=cy') ? localesCy.selectDefaultNone : locales.selectDefaultNone,
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
