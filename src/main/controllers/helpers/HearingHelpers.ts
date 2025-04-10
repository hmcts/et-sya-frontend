import { HearingModel } from '../../definitions/api/caseApiResponse';
import { SendNotificationTypeItem } from '../../definitions/complexTypes/sendNotificationTypeItem';
import { NotificationSubjects, PageUrls, Parties } from '../../definitions/constants';
import { HearingDateRow, HearingDetails } from '../../definitions/hearingDetails';
import { HubLinkStatus, displayStatusColorMap } from '../../definitions/hub';
import { AnyRecord } from '../../definitions/util-types';

/**
 * Check if any Hearing exist in hearingCollection
 * @param hearingModel Hearing Collection for the case
 */
export const isHearingExist = (hearingModel: HearingModel[]): boolean => {
  return hearingModel && hearingModel.length > 0;
};

/**
 * Get hearing data to display in Hearing Details page
 * @param hearingModel Hearing Collections
 * @param sendNotificationTypeItem Notification Collections to map with Hearings
 * @param translations Translation for status tag
 */
export const getHearingCollection = (
  hearingModel: HearingModel[],
  sendNotificationTypeItem: SendNotificationTypeItem[],
  translations: AnyRecord
): HearingDetails[] => {
  const list: HearingDetails[] = [];
  const filteredNotifications = getFilteredNotifications(sendNotificationTypeItem);
  for (const hearing of hearingModel || []) {
    const details: HearingDetails = {
      hearingNumber: hearing.value?.hearingNumber,
      Hearing_type: hearing.value?.Hearing_type,
      hearingDateRows: getHearingDateRows(hearing),
      notifications: getMatchedNotifications(filteredNotifications, hearing, translations),
    };
    list.push(details);
  }
  return list;
};

const getFilteredNotifications = (sendNotificationTypeItem: SendNotificationTypeItem[]): SendNotificationTypeItem[] => {
  if (!sendNotificationTypeItem) {
    return [];
  }
  return sendNotificationTypeItem.filter(
    notification =>
      notification.value?.sendNotificationNotify !== Parties.RESPONDENT_ONLY &&
      notification.value?.sendNotificationSubject?.includes(NotificationSubjects.HEARING)
  );
};

const getHearingDateRows = (hearing: HearingModel): HearingDateRow[] => {
  return hearing.value?.hearingDateCollection.map(hearingDate => ({
    date: hearingDate.value.listedDate,
    status: hearingDate.value.Hearing_status,
    venue: hearingDate.value.hearingVenueDay?.value.label || '',
  }));
};

const getMatchedNotifications = (
  sendNotificationTypeItem: SendNotificationTypeItem[],
  hearing: HearingModel,
  translations: AnyRecord
): SendNotificationTypeItem[] => {
  const notifications = sendNotificationTypeItem.filter(notification =>
    isNotificationsWithIdMatch(notification, hearing)
  );
  notifications.forEach(item => {
    item.redirectUrl = PageUrls.TRIBUNAL_ORDER_OR_REQUEST_DETAILS.replace(':orderId', item.id);
    item.displayStatus = translations[item.value?.notificationState];
    item.statusColor = displayStatusColorMap.get(item.value?.notificationState as HubLinkStatus);
  });
  return notifications;
};

const isNotificationsWithIdMatch = (notification: SendNotificationTypeItem, hearing: HearingModel): boolean => {
  return hearing.value?.hearingDateCollection.some(hearingDate => {
    return notification.value?.sendNotificationSelectHearing?.selectedCode === hearingDate.id;
  });
};

/**
 * Check if the system should display hearing notification banner
 * @param notifications Send Notification Collection
 */
export const shouldShowHearingBanner = (notifications: SendNotificationTypeItem[]): boolean => {
  return (
    notifications?.some(
      notification =>
        notification.value?.sendNotificationNotify !== Parties.RESPONDENT_ONLY &&
        notification.value?.sendNotificationSubject?.includes(NotificationSubjects.HEARING) &&
        notification.value?.notificationState !== HubLinkStatus.VIEWED
    ) || false
  );
};
