import { AppRequest } from '../../definitions/appRequest';
import { AddressType } from '../../definitions/case';
import { PageUrls, languages } from '../../definitions/constants';
import localesCy from '../../resources/locales/cy/translation/common.json';
import locales from '../../resources/locales/en/translation/common.json';

export const getRepresentedClaimantAddressTypes = (
  response: Record<string, string>[],
  req: AppRequest
): AddressType[] => {
  const representedClaimantAddressTypes: AddressType[] = [];
  if (response?.length === 1) {
    representedClaimantAddressTypes.push({
      selected: true,
      label: req.url?.includes(languages.WELSH_URL_POSTFIX)
        ? localesCy.selectDefaultSingle
        : locales.selectDefaultSingle,
    });
  } else if (response?.length > 0) {
    representedClaimantAddressTypes.push({
      selected: true,
      label: req.url?.includes(languages.WELSH_URL_POSTFIX)
        ? localesCy.selectDefaultSeveral
        : locales.selectDefaultSeveral,
    });
  } else {
    representedClaimantAddressTypes.push({
      selected: true,
      label: req.url?.includes(languages.WELSH_URL_POSTFIX) ? localesCy.selectDefaultNone : locales.selectDefaultNone,
    });
  }
  for (const address of response || []) {
    representedClaimantAddressTypes.push({
      value: response.indexOf(address),
      label: address.fullAddress,
    });
  }
  return representedClaimantAddressTypes;
};

export const getLink = (req: AppRequest): string => {
  return req.url?.includes(languages.WELSH_URL_POSTFIX)
    ? PageUrls.REPRESENTED_CLAIMANT_ADDRESS_DETAILS + languages.WELSH_URL_PARAMETER
    : PageUrls.REPRESENTED_CLAIMANT_ADDRESS_DETAILS + languages.ENGLISH_URL_PARAMETER;
};

export const getEnterTitle = (req: AppRequest): string => {
  return req.url?.includes(languages.WELSH_URL_POSTFIX)
    ? localesCy.representedClaimantPostcodeEnterTitle
    : locales.representedClaimantPostcodeEnterTitle;
};

export const getSelectTitle = (req: AppRequest): string => {
  return req.url?.includes(languages.WELSH_URL_POSTFIX)
    ? localesCy.representativePostcodeSelectTitle
    : locales.representativePostcodeSelectTitle;
};
