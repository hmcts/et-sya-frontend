import { HearingModel } from '../../definitions/api/caseApiResponse';
import { SendNotificationTypeItem } from '../../definitions/complexTypes/sendNotificationTypeItem';
import { NotificationSubjects, Parties } from '../../definitions/constants';

export const isHearingExist = (hearingCollection: HearingModel[]): boolean => {
  return hearingCollection && hearingCollection.length > 0;
};

/**
 * Return true when sendNotificationNotify:
 * - Notify is not Respondent only
 * - Subject includes Hearing
 * - Able to find Hearing by selectedCode
 * - Date of Hearing is in the future
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
    notification.value.sendNotificationSubject.includes(NotificationSubjects.HEARING) &&
    isSelectHearingInFuture(notification, hearingModels)
  );
};

const isSelectHearingInFuture = (notification: SendNotificationTypeItem, hearingModels: HearingModel[]): boolean => {
  const selectHearing = notification.value.sendNotificationSelectHearing;
  const hearingDateCollectionId = selectHearing.selectedCode;

  for (const hearingModel of hearingModels) {
    const hearingDateCollection = hearingModel.value.hearingDateCollection.find(
      collection => collection.id === hearingDateCollectionId
    );

    if (hearingDateCollection) {
      return new Date(hearingDateCollection.value.listedDate) > new Date();
    }
  }
};
