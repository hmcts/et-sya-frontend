import { GenericTseApplicationTypeItem } from '../../definitions/complexTypes/genericTseApplicationTypeItem';
import { HubLinkStatus, hubLinksColorMap } from '../../definitions/hub';
import { AnyRecord } from '../../definitions/util-types';

import { getLanguageParam } from './RouterHelpers';

export const answersAddressFormatter = (
  line1?: string,
  line2?: string,
  line3?: string,
  line4?: string,
  line5?: string
): string => {
  let addresstring = '';
  if (line1 !== undefined && line1.length > 1) {
    addresstring += line1 + ', ';
  }

  if (line2 !== undefined && line2.length > 1) {
    addresstring += line2 + ', ';
  }
  if (line3 !== undefined && line3.length > 1) {
    addresstring += line3 + ', ';
  }
  if (line4 !== undefined && line4.length > 1) {
    addresstring += line4 + ', ';
  }
  if (line5 !== undefined && line5.length > 1) {
    addresstring += line5 + ', ';
  }
  if (addresstring.length > 1) {
    addresstring = addresstring.slice(0, -2);
  }
  return addresstring;
};

export const getUploadedFileName = (fileName?: string): string => {
  if (fileName) {
    return fileName;
  } else {
    return '';
  }
};

export const populateAppItemsWithRedirectLinksCaptionsAndStatusColors = (
  items: GenericTseApplicationTypeItem[],
  url: string,
  translations: AnyRecord
): void => {
  if (items && items.length) {
    items.forEach(item => {
      const app = item.value.type;
      item.linkValue = translations.sections[app].caption;
      item.redirectUrl = `/application-details/${item.value.number}${getLanguageParam(url)}`;
      item.statusColor = hubLinksColorMap.get(<HubLinkStatus>item.value.status);
      item.value.status = translations[item.value.status];
    });
  }
};
