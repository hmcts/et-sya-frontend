import { AppRequest } from '../../definitions/appRequest';
import { GenericTseApplicationTypeItem } from '../../definitions/complexTypes/genericTseApplicationTypeItem';
import { applicationTypes } from '../../definitions/contact-applications';
import { RespondentApplicationDetails } from '../../definitions/definition';
import { HubLinkNames, HubLinkStatus, hubLinksColorMap } from '../../definitions/hub';
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
  if (items && items.length) {
    for (let i = items.length - 1; i >= 0; i--) {
      if (items[i].value.applicant?.includes('Claimant')) {
        claimantItems[i] = items[i];
      }
    }
  }
  if (claimantItems && claimantItems.length) {
    claimantItems.forEach(item => {
      const app = item.value.type;
      item.linkValue = translations.sections[app].caption;
      item.redirectUrl = `/application-details/${item.value.number}${getLanguageParam(url)}`;
      item.statusColor = hubLinksColorMap.get(<HubLinkStatus>item.value.applicationState);
      item.displayStatus = translations[item.value.applicationState];
    });
  }
};

export const activateRespondentApplicationsLink = (items: GenericTseApplicationTypeItem[], req: AppRequest): void => {
  const userCase = req.session?.userCase;
  if (items && items.length) {
    for (let i = items.length - 1; i >= 0; i--) {
      if (items[i].value.applicant.includes('Respondent') && items[i].value.copyToOtherPartyYesOrNo.includes('Yes')) {
        userCase.hubLinksStatuses[HubLinkNames.RespondentApplications] = HubLinkStatus.IN_PROGRESS;
      }
    }
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

export const populateRespondentItemsWithRedirectLinksCaptionsAndStatusColors = (
  items: GenericTseApplicationTypeItem[],
  url: string,
  translations: AnyRecord
): GenericTseApplicationTypeItem[] => {
  const respondentItems = [];
  if (items && items.length) {
    for (let i = items.length - 1; i >= 0; i--) {
      if (items[i].value.applicant.includes('Respondent') && items[i].value.copyToOtherPartyYesOrNo.includes('Yes')) {
        respondentItems[i] = items[i];
      }
    }
  }
  if (respondentItems && respondentItems.length) {
    respondentItems.forEach(item => {
      const app = translations[item.value.type];
      item.linkValue = app;
      item.redirectUrl = `/respondent-application-details/${item.value.number}${getLanguageParam(url)}`;
      item.statusColor = hubLinksColorMap.get(<HubLinkStatus>item.value.status);
      item.displayStatus = translations[item.value.status];
    });
    return items;
  }
};

export const getRespondentApplicationDetails = (
  items: GenericTseApplicationTypeItem[],
  translations: AnyRecord,
  languageParam: string
): RespondentApplicationDetails[] => {
  const bannerContent: RespondentApplicationDetails[] = [];

  if (items && items.length) {
    for (let i = items.length - 1; i >= 0; i--) {
      const dueDate = new Date(Date.parse(items[i].value.dueDate));
      const rec: RespondentApplicationDetails = {
        respondentApplicationHeader:
          translations.notificationBanner.respondentApplicationReceived.header + translations[items[i].value.type],
        respondToRespondentAppRedirectUrl: `/respondent-application-details/${items[i].value.number}${languageParam}`,
        applicant: items[i].value.applicant,
        copyToOtherPartyYesOrNo: items[i].value.copyToOtherPartyYesOrNo,
        respondByDate:
          translations.days[dueDate.getDay()] +
          ' ' +
          dueDate.getDate() +
          ' ' +
          translations.months[dueDate.getMonth()] +
          ' ' +
          dueDate.getFullYear(),
        applicationType: applicationTypes.respondent.a.includes(items[i].value.type) ? 'A' : 'B',
        number: items[i].value.number,
        status: items[i].value.status,
        date: items[i].value.date,
        type: items[i].value.type,
      };
      bannerContent.push(rec);
    }
    return bannerContent;
  }
};
