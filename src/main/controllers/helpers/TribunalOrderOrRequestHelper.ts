import { SendNotificationTypeItem } from '../../definitions/complexTypes/sendNotificationTypeItem';
import { Applicant, FEATURE_FLAGS, NotificationSubjects, PageUrls, Parties } from '../../definitions/constants';
import { HubLinkStatus, displayStatusColorMap } from '../../definitions/hub';
import { AnyRecord } from '../../definitions/util-types';
import { getFlagValue } from '../../modules/featureFlag/launchDarkly';

export async function getSendNotifications(
  sendNotificationCollection: SendNotificationTypeItem[],
  translations: AnyRecord,
  languageParam: string
): Promise<SendNotificationTypeItem[]> {
  let notifications: SendNotificationTypeItem[];
  const eccFlag = await getFlagValue(FEATURE_FLAGS.ECC, null);
  if (eccFlag) {
    notifications = sendNotificationCollection?.filter(
      it => it.value.sendNotificationNotify !== Parties.RESPONDENT_ONLY
    );
  } else {
    notifications = sendNotificationCollection?.filter(
      it =>
        it.value.sendNotificationNotify !== Parties.RESPONDENT_ONLY &&
        !it.value.sendNotificationSubjectString?.includes(NotificationSubjects.ECC)
    );
  }
  notifications.forEach(item => {
    item.redirectUrl = getRedirectUrl(item, languageParam);
    item.displayStatus = translations[item.value.notificationState];
    item.statusColor = displayStatusColorMap.get(item.value.notificationState as HubLinkStatus);
  });
  return notifications;
}

const getRedirectUrl = (item: SendNotificationTypeItem, languageParam: string): string => {
  const storedRespond = item.value.respondStoredCollection?.find(r => r.value.from === Applicant.CLAIMANT);
  return storedRespond
    ? PageUrls.STORED_TO_SUBMIT_TRIBUNAL.replace(':orderId', item.id).replace(':responseId', storedRespond.id) +
        languageParam
    : PageUrls.NOTIFICATION_DETAILS.replace(':orderId', item.id) + languageParam;
};
