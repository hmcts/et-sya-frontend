import { CaseWithId, Document } from '../../definitions/case';
import { GenericTseApplicationTypeItem } from '../../definitions/complexTypes/genericTseApplicationTypeItem';
import { applicationTypes } from '../../definitions/contact-applications';
import { RespondentApplicationDetails } from '../../definitions/definition';
import { HubLinkNames, HubLinkStatus, statusColorMap } from '../../definitions/hub';
import { AnyRecord } from '../../definitions/util-types';

import { getLanguageParam } from './RouterHelpers';

export const getRespondentApplications = (userCase: CaseWithId): GenericTseApplicationTypeItem[] => {
  return userCase?.genericTseApplicationCollection?.filter(
    app =>
      app.value.applicant.includes('Respondent') &&
      app.value.type !== 'Order a witness to attend to give evidence' &&
      app.value.copyToOtherPartyYesOrNo.includes('Yes')
  );
};

export const getRespondentBannerContent = (
  items: GenericTseApplicationTypeItem[],
  translations: AnyRecord,
  languageParam: string
): RespondentApplicationDetails[] => {
  const bannerContent: RespondentApplicationDetails[] = [];

  if (items && items.length) {
    for (let i = items.length - 1; i >= 0; i--) {
      if (items[i].value.applicationState === 'notStartedYet') {
        const dueDate = new Date(Date.parse(items[i].value.dueDate));
        const rec: RespondentApplicationDetails = {
          respondentApplicationHeader:
            translations.notificationBanner.respondentApplicationReceived.header + translations[items[i].value.type],
          respondToRespondentAppRedirectUrl: `/respondent-application-details/${items[i].id}${languageParam}`,
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
          number: items[i].id,
          applicationState: items[i].value.applicationState,
          date: items[i].value.date,
          type: items[i].value.type,
        };
        bannerContent.push(rec);
      }
    }
    return bannerContent;
  }
};

export const activateRespondentApplicationsLink = (
  items: GenericTseApplicationTypeItem[],
  userCase: CaseWithId
): void => {
  if (items && items.length) {
    userCase.hubLinksStatuses[HubLinkNames.RespondentApplications] = HubLinkStatus.IN_PROGRESS;
  }
};

export const populateRespondentItemsWithRedirectLinksCaptionsAndStatusColors = (
  respondentItems: GenericTseApplicationTypeItem[],
  url: string,
  translations: AnyRecord
): GenericTseApplicationTypeItem[] => {
  if (respondentItems && respondentItems.length) {
    respondentItems.forEach(item => {
      const app = translations[item.value.type];
      item.linkValue = app;
      item.redirectUrl = `/respondent-application-details/${item.id}${getLanguageParam(url)}`;
      item.statusColor = statusColorMap.get(<HubLinkStatus>item.value.applicationState);
      item.displayStatus = translations[item.value.applicationState];
    });
    return respondentItems;
  }
};

export const getClaimantResponseDocDownload = (selectedApplication: GenericTseApplicationTypeItem): Document => {
  let claimantResponseDocDownload = undefined;
  const selectedAppRespondCollection = selectedApplication.value?.respondCollection;
  for (let i = selectedAppRespondCollection?.length - 1; i >= 0; i--) {
    const selectedAppRespondCollectionItem = selectedAppRespondCollection[i].value;
    if (
      selectedAppRespondCollectionItem.from === 'Claimant' &&
      selectedAppRespondCollectionItem.supportingMaterial !== undefined
    ) {
      claimantResponseDocDownload = selectedAppRespondCollectionItem.supportingMaterial[0].value.uploadedDocument;
    }
  }
  return claimantResponseDocDownload;
};
