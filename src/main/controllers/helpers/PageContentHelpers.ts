import { GenericTseApplicationTypeItem } from '../../definitions/complexTypes/genericTseApplicationTypeItem';
import { Applicant } from '../../definitions/constants';
import { HubLinkStatus, statusColorMap } from '../../definitions/hub';
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
  const claimantItems = [];
  if (items?.length) {
    for (let i = items.length - 1; i >= 0; i--) {
      if (
        items[i].value.applicant?.includes(Applicant.CLAIMANT) ||
        items[i].value.applicant?.includes(Applicant.CLAIMANT_REP)
      ) {
        claimantItems[i] = items[i];
      }
    }
  }
  if (claimantItems?.length) {
    claimantItems.forEach(item => {
      const app = item.value.type;
      item.linkValue = translations[app];
      item.redirectUrl = `/application-details/${item.id}${getLanguageParam(url)}`;
      item.statusColor = statusColorMap.get(<HubLinkStatus>item.value.applicationState);
      item.displayStatus = translations[item.value.applicationState];
    });
  }
};

export const getApplicationRespondByDate = (
  selectedApplication: GenericTseApplicationTypeItem,
  translations: AnyRecord
): string => {
  if (selectedApplication) {
    const dueDate = new Date(Date.parse(selectedApplication.value.dueDate));
    const dateString =
      translations.days[dueDate.getDay()] +
      ' ' +
      dueDate.getDate() +
      ' ' +
      translations.months[dueDate.getMonth()] +
      ' ' +
      dueDate.getFullYear();

    return dateString;
  }
};

export const generateAccordionItems = (
  applications: AnyRecord,
  translations: AnyRecord,
  languageParam: string
): string[] => {
  return applications.map((application: string) => {
    const label = translations.sections[application].label;
    const href =
      application === 'documents'
        ? '/notifications>' + label + languageParam + '</a>'
        : '/contact-the-tribunal/' + application + '>' + label + languageParam + '</a>';

    return {
      heading: {
        text: label,
      },
      content: {
        html:
          "<p class='govuk-body'>" +
          translations.sections[application].body +
          '</p> <br>' +
          "<a class='govuk-link govuk-body'" +
          'href=' +
          href,
      },
    };
  });
};
