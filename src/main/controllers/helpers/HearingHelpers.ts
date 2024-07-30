import { HearingModel } from '../../definitions/api/caseApiResponse';
import { SendNotificationTypeItem } from '../../definitions/complexTypes/sendNotificationTypeItem';
import { NotificationSubjects, Parties } from '../../definitions/constants';
import { HearingDateRow, HearingDetails } from '../../definitions/hearingDetails';

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
 */
export const getHearingCollection = (
  hearingModel: HearingModel[],
  sendNotificationTypeItem: SendNotificationTypeItem[]
): HearingDetails[] => {
  const list: HearingDetails[] = [];
  for (const hearing of hearingModel || []) {
    const details: HearingDetails = {
      hearingNumber: hearing.value.hearingNumber,
      Hearing_type: hearing.value.Hearing_type,
      hearingDateRows: getHearingDateRows(hearing),
      notifications: getNotifications(sendNotificationTypeItem, hearing),
    };
    list.push(details);
  }
  return list;
};

const getHearingDateRows = (hearing: HearingModel): HearingDateRow[] => {
  return hearing.value.hearingDateCollection.map(hearingDate => ({
    date: hearingDate.value.listedDate,
    status: hearingDate.value.Hearing_status,
    venue: hearingDate.value.hearingVenueDay?.value.label || '',
  }));
};

const getNotifications = (
  sendNotificationTypeItem: SendNotificationTypeItem[],
  hearing: HearingModel
): SendNotificationTypeItem[] => {
  return sendNotificationTypeItem.filter(
    notification =>
      notification.value.sendNotificationNotify !== Parties.RESPONDENT_ONLY &&
      notification.value.sendNotificationSubject?.includes(NotificationSubjects.HEARING) &&
      isNotificationsWithIdMatch(notification, hearing)
  );
};

const isNotificationsWithIdMatch = (item: SendNotificationTypeItem, hearing: HearingModel): boolean => {
  return hearing.value.hearingDateCollection.some(dateItem => {
    return item.value.sendNotificationSelectHearing?.selectedCode === dateItem.id;
  });
};

/**
 * Return true when sendNotificationNotify:
 * - Notify is not Respondent only
 * - Subject includes Hearing
 * - Found Hearing by selectedCode
 * - Listed Date of Hearing Date Collection is in the future
 * @param notification Send Notification Type Item
 * @param hearingModels Hearing Collection
 */
export const isNotificationWithFutureHearing = (
  notification: SendNotificationTypeItem,
  hearingModels: HearingModel[]
): boolean => {
  return (
    notification &&
    notification.value.sendNotificationNotify !== Parties.RESPONDENT_ONLY &&
    notification.value.sendNotificationSubject?.includes(NotificationSubjects.HEARING) &&
    isSendNotificationSelectHearingInFuture(notification, hearingModels)
  );
};

const isSendNotificationSelectHearingInFuture = (
  notification: SendNotificationTypeItem,
  hearingModels: HearingModel[]
): boolean => {
  const selectedCode = notification?.value.sendNotificationSelectHearing?.selectedCode;
  return selectedCode && isHearingDateCollectionInFuture(hearingModels, selectedCode);
};

const isHearingDateCollectionInFuture = (hearingModels: HearingModel[], id: string): boolean => {
  return hearingModels.some(hearingModel =>
    hearingModel.value.hearingDateCollection.some(
      collection => collection.id === id && new Date(collection.value.listedDate) > new Date()
    )
  );
};
