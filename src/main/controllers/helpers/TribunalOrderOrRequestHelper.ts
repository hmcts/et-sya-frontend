import { CaseWithId } from '../../definitions/case';
import {
  SendNotificationType,
  SendNotificationTypeItem,
} from '../../definitions/complexTypes/sendNotificationTypeItem';
import { Applicant, NotificationSubjects, PageUrls, Parties, ResponseRequired } from '../../definitions/constants';
import { HubLinkNames, HubLinkStatus, displayStatusColorMap } from '../../definitions/hub';
import { AnyRecord } from '../../definitions/util-types';

import { createDownloadLink } from './DocumentHelpers';
import { getLanguageParam } from './RouterHelpers';

export const getRepondentOrderOrRequestDetails = (
  translations: AnyRecord,
  item: SendNotificationTypeItem
): { key: unknown; value?: unknown; actions?: unknown }[] => {
  const respondentRequestOrOrderDetails = [];

  if (item.value.sendNotificationSelectHearing) {
    respondentRequestOrOrderDetails.push({
      key: {
        text: translations.hearing,
        classes: 'govuk-!-font-weight-regular-m',
      },
      value: {
        text: item.value.sendNotificationSelectHearing.selectedLabel,
      },
    });
  }

  respondentRequestOrOrderDetails.push(
    {
      key: {
        text: translations.dateSent,
        classes: 'govuk-!-font-weight-regular-m',
      },
      value: {
        text: item.value.date,
      },
    },
    {
      key: {
        text: translations.sentBy,
        classes: 'govuk-!-font-weight-regular-m',
      },
      value: {
        text: 'Tribunal',
      },
    },
    {
      key: {
        text: translations.orderOrRequest,
        classes: 'govuk-!-font-weight-regular-m',
      },
      value: {
        text: item.value.sendNotificationCaseManagement,
      },
    },
    {
      key: {
        text: translations.responseDue,
        classes: 'govuk-!-font-weight-regular-m',
      },
      value: {
        text: item.value.sendNotificationResponseTribunal,
      },
    },
    {
      key: {
        text: translations.partyToRespond,
        classes: 'govuk-!-font-weight-regular-m',
      },
      value: {
        text: item.value.sendNotificationSelectParties,
      },
    }
  );

  if (item.value.sendNotificationAdditionalInfo) {
    respondentRequestOrOrderDetails.push({
      key: {
        text: translations.addInfo,
        classes: 'govuk-!-font-weight-regular-m',
      },
      value: {
        text: item.value.sendNotificationAdditionalInfo,
      },
    });
  }

  const docs = item.value.sendNotificationUploadDocument;
  if (docs?.length) {
    docs.forEach(doc => {
      respondentRequestOrOrderDetails.push(
        {
          key: {
            text: translations.description,
            classes: 'govuk-!-font-weight-regular-m',
          },
          value: { text: doc.value.shortDescription },
        },
        {
          key: {
            text: translations.document,
            classes: 'govuk-!-font-weight-regular-m',
          },
          value: { html: createDownloadLink(doc.value.uploadedDocument) },
        }
      );
    });
  }

  if (item.value.sendNotificationWhoCaseOrder) {
    respondentRequestOrOrderDetails.push({
      key: {
        text: translations.orderMadeBy,
        classes: 'govuk-!-font-weight-regular-m',
      },
      value: {
        text: item.value.sendNotificationWhoCaseOrder,
      },
    });
  } else {
    respondentRequestOrOrderDetails.push({
      key: {
        text: translations.requestMadeBy,
        classes: 'govuk-!-font-weight-regular-m',
      },
      value: {
        text: item.value.sendNotificationRequestMadeBy,
      },
    });
  }

  respondentRequestOrOrderDetails.push(
    {
      key: {
        text: translations.fullName,
        classes: 'govuk-!-font-weight-regular-m',
      },
      value: {
        text: item.value.sendNotificationFullName,
      },
    },
    {
      key: {
        text: translations.sentTo,
        classes: 'govuk-!-font-weight-regular-m',
      },
      value: {
        text: item.value.sendNotificationNotify,
      },
    }
  );

  return respondentRequestOrOrderDetails;
};

export const getRedirectUrlForNotification = (id: string, responseRequired: boolean, url: string): string => {
  let pageUrl: string = PageUrls.TRIBUNAL_ORDER_OR_REQUEST_DETAILS;

  if (responseRequired) {
    pageUrl = PageUrls.TRIBUNAL_RESPOND_TO_ORDER;
  }

  return pageUrl.replace(':orderId', `${id}${getLanguageParam(url)}`);
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
      item.redirectUrl = getRedirectUrlForNotification(item.id, false, url);
      item.respondUrl = getRedirectUrlForNotification(item.id, responseRequired, url);
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
  return notifications?.filter(o => {
    if (o.value.notificationState !== HubLinkStatus.VIEWED) {
      return true;
    }

    if (requiresResponse(o.value) && !hasClaimantResponded(o.value)) {
      return true;
    }

    return o.value.respondNotificationTypeCollection?.some(
      r => r.value.state !== HubLinkStatus.VIEWED || r.value.isClaimantResponseDue
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
  const responses = value.respondNotificationTypeCollection;

  const hasAnyResponsesDue = responses?.some(r => r.value.isClaimantResponseDue);

  if (hasAnyResponsesDue || (requiresResponse(notification.value) && !hasClaimantResponded(notification.value))) {
    notification.needsResponse = true;
  }
}

function requiresResponse(notification: SendNotificationType) {
  return notification.sendNotificationResponseTribunal === ResponseRequired.YES;
}

function hasClaimantResponded(notification: SendNotificationType) {
  return notification.respondCollection?.filter(o => o.value.from === Applicant.CLAIMANT).length > 0;
}
