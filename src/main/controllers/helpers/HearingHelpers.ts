import { HearingModel } from '../../definitions/api/caseApiResponse';
import { SendNotificationTypeItem } from '../../definitions/complexTypes/sendNotificationTypeItem';
import { NotificationSubjects, Parties } from '../../definitions/constants';

/**
 * Check if any Hearing exist in hearingCollection
 * @param hearingModel Hearing Collection for the case
 */
export const isHearingExist = (hearingModel: HearingModel[]): boolean => {
  return hearingModel && hearingModel.length > 0;
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
