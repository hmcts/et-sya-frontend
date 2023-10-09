import { CaseWithId } from '../../definitions/case';
import {
  RespondNotificationType,
  SendNotificationType,
  SendNotificationTypeItem,
} from '../../definitions/complexTypes/sendNotificationTypeItem';
import { Applicant, NotificationSubjects, PageUrls, Parties, ResponseRequired } from '../../definitions/constants';
import { SummaryListRow, addSummaryHtmlRow, addSummaryRow } from '../../definitions/govuk/govukSummaryList';
import { HubLinkNames, HubLinkStatus, displayStatusColorMap } from '../../definitions/hub';
import { AnyRecord, TypeItem } from '../../definitions/util-types';

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

  const docs = item.value.sendNotificationUploadDocument;
  if (docs?.length) {
    docs.forEach(doc => {
      respondentRequestOrOrderDetails.push(
        addSummaryRow(translations.description, doc.value.shortDescription),
        addSummaryHtmlRow(translations.document, createDownloadLink(doc.value.uploadedDocument))
      );
    });
  }

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

export const getRedirectUrlForNotification = (
  notification: SendNotificationTypeItem,
  responseRequired: boolean,
  url: string
): string => {
  let pageUrl: string = PageUrls.TRIBUNAL_ORDER_OR_REQUEST_DETAILS;

  if (responseRequired) {
    pageUrl = PageUrls.TRIBUNAL_RESPOND_TO_ORDER;
  }
  if (notification.value.sendNotificationSubjectString?.includes(NotificationSubjects.GENERAL_CORRESPONDENCE)) {
    return PageUrls.GENERAL_CORRESPONDENCE_NOTIFICATION_DETAILS.replace(
      ':itemId',
      `${notification.id}${getLanguageParam(url)}`
    );
  }

  return pageUrl.replace(':orderId', `${notification.id}${getLanguageParam(url)}`);
};

export const populateNotificationsWithRedirectLinksAndStatusColors = (
  notifications: SendNotificationTypeItem[],
  url: string,
  translations: AnyRecord
): SendNotificationTypeItem[] => {
  if (notifications?.length && filterSendNotifications(notifications).length) {
    notifications.forEach(item => {
      const responseRequired =
        item.value.sendNotificationResponseTribunal === ResponseRequired.YES &&
        item.value.sendNotificationSelectParties !== Parties.RESPONDENT_ONLY;
      const hasResponded = item.value.respondCollection?.some(r => r.value.from === Applicant.CLAIMANT) || false;
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
      item.redirectUrl = getRedirectUrlForNotification(item, false, url);
      item.respondUrl = getRedirectUrlForNotification(item, responseRequired, url);
      setNotificationBannerData(item);
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
  const notices = filterSendNotifications(items).filter(
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

export const filterSendNotifications = (items: SendNotificationTypeItem[]): SendNotificationTypeItem[] => {
  return items?.filter(
    it =>
      it.value.sendNotificationSubjectString?.includes(NotificationSubjects.ORDER_OR_REQUEST) ||
      it.value.sendNotificationSubjectString?.includes(NotificationSubjects.GENERAL_CORRESPONDENCE)
  );
};

/**
 * Returns a filtered list of notifications where ANY criteria is matched:
 * 1. Notification is not viewed
 * 2. A response on the notification is not viewed
 * 3. A response on the notification is viewed and requires a response where none has been given yet
 */
export function filterActionableNotifications(notifications: SendNotificationTypeItem[]): SendNotificationTypeItem[] {
  return notifications
    ?.filter(o => o.value.sendNotificationNotify !== Parties.RESPONDENT_ONLY)
    .filter(o => {
      if (o.value.notificationState !== HubLinkStatus.VIEWED) {
        return true;
      }

      if (requiresResponse(o.value) && !hasClaimantResponded(o.value)) {
        return true;
      }

      return o.value.respondNotificationTypeCollection?.some(
        r => claimantRelevant(r) && (r.value.state !== HubLinkStatus.VIEWED || r.value.isClaimantResponseDue)
      );
    });
}

/**
 * Sets "showAlert" and "needsResponse" for a notification for the notification banner on citizen hub.
 * needsResponse is true if a notification (or tribunal response on it) requires a response where none has been given.
 * showAlert is true if needsResponse is set or if a notification (or tribunal response on it) is unviewed.
 */
export function setNotificationBannerData(notification: SendNotificationTypeItem): void {
  const actionableNotifications = filterActionableNotifications([notification]);
  if (!actionableNotifications.length) {
    notification.showAlert = false;
    return;
  }

  notification.showAlert = true;
  notification.needsResponse = false;

  const value = actionableNotifications[0].value;
  const responses = value.respondNotificationTypeCollection?.filter(claimantRelevant) || [];

  const hasAnyResponsesDue = responses?.some(r => r.value.isClaimantResponseDue);

  if (hasAnyResponsesDue || (requiresResponse(notification.value) && !hasClaimantResponded(notification.value))) {
    notification.needsResponse = true;
  }
}

function requiresResponse(notification: SendNotificationType) {
  return (
    notification.sendNotificationResponseTribunal === ResponseRequired.YES &&
    notification.sendNotificationSelectParties !== Parties.RESPONDENT_ONLY
  );
}

function hasClaimantResponded(notification: SendNotificationType) {
  return notification.respondCollection?.filter(o => o.value.from === Applicant.CLAIMANT).length > 0;
}

const claimantRelevant = (response: TypeItem<RespondNotificationType>): boolean => {
  return response.value.respondNotificationPartyToNotify !== Parties.RESPONDENT_ONLY;
};
