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
 * @param hearings hearing collections
 * @param notifications notification collections to map with hearings
 * @param req request
 */
export const getHearingCollection = (
  hearings: HearingModel[],
  notifications: SendNotificationTypeItem[],
  req: AppRequest
): HearingDetails[] => {
  const list: HearingDetails[] = [];
  const translations: AnyRecord = {
    ...req.t(TranslationKeys.HEARING_DETAILS, { returnObjects: true }),
  };
  const hearingNotifications = getHearingNotificationsToClaimant(notifications);
  for (const hearing of hearings || []) {
    const details: HearingDetails = {
      hearingNumber: hearing.value?.hearingNumber,
      hearingType: translations[hearing.value?.Hearing_type],
      hearingDateRows: getHearingDateRows(hearing, translations),
      notifications: getMatchedNotifications(hearingNotifications, hearing, translations),
    };
    list.push(details);
  }
  return list;
};

const getHearingNotificationsToClaimant = (notifications: SendNotificationTypeItem[]): SendNotificationTypeItem[] => {
  return (
    notifications?.filter(
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
    .map(notification => getNotificationRow(notification, translations));
};

const isNotificationsWithIdMatch = (notification: SendNotificationTypeItem, hearing: HearingModel): boolean => {
  return hearing.value?.hearingDateCollection?.some(hearingDate => {
    return notification.value?.sendNotificationSelectHearing?.selectedCode === hearingDate.id;
  });
};

const getNotificationRow = (
  notification: SendNotificationTypeItem,
  translations: AnyRecord
): HearingNotificationRow => {
  return {
    date: notification.value?.date,
    redirectUrl: PageUrls.NOTIFICATION_DETAILS.replace(':orderId', notification.id),
    notificationTitle: notification.value?.sendNotificationTitle,
    displayStatus: translations[notification.value?.notificationState],
    statusColor: displayStatusColorMap.get(notification.value?.notificationState as HubLinkStatus),
  };
};

/**
 * Check if the system should display hearing notification banner
 * @param notifications Send Notification Collection
 */
export const shouldShowHearingBanner = (notifications: SendNotificationTypeItem[]): boolean => {
  return (
    getHearingNotificationsToClaimant(notifications)?.some(
      notification =>
        notification.value?.notificationState === HubLinkStatus.NOT_VIEWED ||
        notification.value?.notificationState === HubLinkStatus.NOT_STARTED_YET
    ) || false
  );
};
