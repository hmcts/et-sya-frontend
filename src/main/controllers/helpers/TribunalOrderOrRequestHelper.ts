import { CaseWithId } from '../../definitions/case';
import { SendNotificationTypeItem } from '../../definitions/complexTypes/sendNotificationTypeItem';
import { Applicant, PageUrls, Parties, ResponseRequired } from '../../definitions/constants';
import { SummaryListRow, addSummaryRow } from '../../definitions/govuk/govukSummaryList';
import { HubLinkNames, HubLinkStatus, displayStatusColorMap } from '../../definitions/hub';
import { AnyRecord } from '../../definitions/util-types';

import { createDownloadLink } from './DocumentHelpers';
import { getLanguageParam } from './RouterHelpers';

export const getRepondentOrderOrRequestDetails = (
  translations: AnyRecord,
  item: SendNotificationTypeItem
): SummaryListRow[] => {
  const respondentRequestOrOrderDetails = [];

  if (item.value.sendNotificationSelectHearing) {
    respondentRequestOrOrderDetails.push(
      addSummaryRow(translations.hearing, item.value.sendNotificationSelectHearing.selectedLabel)
    );
  }

  respondentRequestOrOrderDetails.push(
    addSummaryRow(translations.dateSent, item.value.date),
    // Should 'Tribunal' here be a translation reference?
    addSummaryRow(translations.sentBy, 'Tribunal'),
    addSummaryRow(translations.orderOrRequest, item.value.sendNotificationCaseManagement),
    addSummaryRow(translations.responseDue, item.value.sendNotificationResponseTribunal),
    addSummaryRow(translations.partyToRespond, item.value.sendNotificationSelectParties)
  );

  if (item.value.sendNotificationAdditionalInfo) {
    respondentRequestOrOrderDetails.push(
      addSummaryRow(translations.addInfo, item.value.sendNotificationAdditionalInfo)
    );
  }

  const docs = item.value.sendNotificationUploadDocument || [];
  respondentRequestOrOrderDetails.push(
    ...docs.flatMap(doc => [
      addSummaryRow(translations.description, doc.value.shortDescription),
      addSummaryRow(translations.document, undefined, createDownloadLink(doc.value.uploadedDocument)),
    ])
  );

  if (item.value.sendNotificationWhoCaseOrder) {
    respondentRequestOrOrderDetails.push(
      addSummaryRow(translations.orderMadeBy, item.value.sendNotificationWhoCaseOrder)
    );
  } else {
    respondentRequestOrOrderDetails.push(
      addSummaryRow(translations.requestMadeBy, item.value.sendNotificationRequestMadeBy)
    );
  }

  respondentRequestOrOrderDetails.push(
    addSummaryRow(translations.fullName, item.value.sendNotificationFullName),
    addSummaryRow(translations.sentTo, item.value.sendNotificationNotify)
  );

  return respondentRequestOrOrderDetails;
};

export const populateNotificationsWithRedirectLinksAndStatusColors = (
  notifications: SendNotificationTypeItem[],
  url: string,
  translations: AnyRecord
): SendNotificationTypeItem[] => {
  if (notifications?.length && filterNotificationsWithRequestsOrOrders(notifications).length) {
    notifications.forEach(item => {
      item.redirectUrl = PageUrls.TRIBUNAL_ORDER_OR_REQUEST_DETAILS.replace(
        ':orderId',
        `${item.id}${getLanguageParam(url)}`
      );

      const responseRequired =
        item.value.sendNotificationResponseTribunal === ResponseRequired.YES &&
        item.value.sendNotificationSelectParties !== Parties.RESPONDENT_ONLY;
      const hasResponded = item.value.respondCollection?.some(r => r.value.from === Applicant.CLAIMANT);
      const isNotViewedYet = item.value.notificationState === HubLinkStatus.NOT_VIEWED;
      const isViewed = item.value.notificationState === HubLinkStatus.VIEWED;

      let hubLinkStatus: HubLinkStatus;

      switch (true) {
        case responseRequired && hasResponded:
          hubLinkStatus = HubLinkStatus.SUBMITTED;
          break;
        case responseRequired && !hasResponded:
          hubLinkStatus = HubLinkStatus.NOT_STARTED_YET;
          break;
        case !responseRequired && isNotViewedYet:
          hubLinkStatus = HubLinkStatus.NOT_VIEWED;
          break;
        case !responseRequired && isViewed:
          hubLinkStatus = HubLinkStatus.VIEWED;
          break;
        default:
          throw new Error(`Illegal order/ request state, title: ${item.value.sendNotificationTitle}, id: ${item.id}`);
      }
      item.displayStatus = translations[hubLinkStatus];
      item.statusColor = displayStatusColorMap.get(hubLinkStatus);
    });
    return notifications;
  }
};

export const activateTribunalOrdersAndRequestsLink = (
  items: SendNotificationTypeItem[],
  userCase: CaseWithId
): void => {
  if (!items?.length) {
    return;
  }
  const notices = filterNotificationsWithRequestsOrOrders(items).filter(
    notice => notice.value.sendNotificationNotify !== Parties.RESPONDENT_ONLY
  );
  if (!notices?.length) {
    return;
  }

  const responseRequired = (item: SendNotificationTypeItem) =>
    item.value.sendNotificationResponseTribunal === ResponseRequired.YES &&
    item.value.sendNotificationSelectParties !== Parties.RESPONDENT_ONLY;

  const anyRequireResponse = notices.some(responseRequired);

  const anyRequireResponseAndNotResponded = notices.some(item => {
    return responseRequired(item) && !item.value.respondCollection?.some(r => r.value.from === Applicant.CLAIMANT);
  });

  const allViewed = notices.every(item => {
    return item.value.notificationState === HubLinkStatus.VIEWED;
  });

  switch (true) {
    case anyRequireResponseAndNotResponded:
      userCase.hubLinksStatuses[HubLinkNames.TribunalOrders] = HubLinkStatus.NOT_STARTED_YET;
      break;
    case !allViewed:
      userCase.hubLinksStatuses[HubLinkNames.TribunalOrders] = HubLinkStatus.NOT_VIEWED;
      break;
    case anyRequireResponse && !anyRequireResponseAndNotResponded:
      userCase.hubLinksStatuses[HubLinkNames.TribunalOrders] = HubLinkStatus.SUBMITTED;
      break;
    case allViewed:
      userCase.hubLinksStatuses[HubLinkNames.TribunalOrders] = HubLinkStatus.VIEWED;
      break;
  }
};

export const filterNotificationsWithRequestsOrOrders = (
  items: SendNotificationTypeItem[]
): SendNotificationTypeItem[] => {
  return items?.filter(it => it.value.sendNotificationCaseManagement);
};
