import { HearingModel } from '../../definitions/api/caseApiResponse';
import { AppRequest } from '../../definitions/appRequest';
import { SendNotificationTypeItem } from '../../definitions/complexTypes/sendNotificationTypeItem';
import { NotificationSubjects, PageUrls, Parties, TranslationKeys } from '../../definitions/constants';
import { HearingDateRow, HearingDetails, HearingNotificationRow } from '../../definitions/hearingDetails';
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
 * @param hearingModel hearing collections
 * @param sendNotificationTypeItem notification collections to map with hearings
 * @param req request
 */
export const getHearingCollection = (
  hearingModel: HearingModel[],
  sendNotificationTypeItem: SendNotificationTypeItem[],
  req: AppRequest
): HearingDetails[] => {
  const list: HearingDetails[] = [];
  const translations: AnyRecord = {
    ...req.t(TranslationKeys.HEARING_DETAILS, { returnObjects: true }),
  };
  const filteredNotifications = getFilteredNotifications(sendNotificationTypeItem);
  for (const hearing of hearingModel || []) {
    const details: HearingDetails = {
      hearingNumber: hearing.value?.hearingNumber,
      Hearing_type: hearing.value?.Hearing_type,
      hearingDateRows: getHearingDateRows(hearing, translations),
      notifications: getMatchedNotifications(filteredNotifications, hearing, translations),
    };
    list.push(details);
  }
  return list;
};

const getFilteredNotifications = (sendNotificationTypeItem: SendNotificationTypeItem[]): SendNotificationTypeItem[] => {
  return (
    sendNotificationTypeItem?.filter(
      notification =>
        notification.value?.sendNotificationNotify !== Parties.RESPONDENT_ONLY &&
        notification.value?.sendNotificationSubject?.includes(NotificationSubjects.HEARING)
    ) || []
  );
};

const getHearingDateRows = (hearing: HearingModel, translations: AnyRecord): HearingDateRow[] => {
  return hearing.value?.hearingDateCollection.map(hearingDate => ({
    date: hearingDate.value?.listedDate,
    status: translations[hearingDate.value?.Hearing_status],
    venue: hearingDate.value?.hearingVenueDay?.value.label || '',
  }));
};

const getMatchedNotifications = (
  notifications: SendNotificationTypeItem[],
  hearing: HearingModel,
  translations: AnyRecord
): HearingNotificationRow[] => {
  return notifications
    .filter(notification => isNotificationsWithIdMatch(notification, hearing))
    .map(notification => getItems(notification, translations));
};

const isNotificationsWithIdMatch = (notification: SendNotificationTypeItem, hearing: HearingModel): boolean => {
  return hearing.value?.hearingDateCollection?.some(hearingDate => {
    return notification.value?.sendNotificationSelectHearing?.selectedCode === hearingDate.id;
  });
};

const getItems = (item: SendNotificationTypeItem, translations: AnyRecord): HearingNotificationRow => {
  return {
    date: item.value?.date,
    redirectUrl: PageUrls.TRIBUNAL_ORDER_OR_REQUEST_DETAILS.replace(':orderId', item.id),
    sendNotificationTitle: item.value?.sendNotificationTitle,
    displayStatus: translations[item.value?.notificationState],
    statusColor: displayStatusColorMap.get(item.value?.notificationState as HubLinkStatus),
  };
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
