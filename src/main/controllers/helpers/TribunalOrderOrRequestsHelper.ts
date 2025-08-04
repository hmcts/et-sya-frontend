import { AppRequest } from '../../definitions/appRequest';
import { SendNotificationTypeItem } from '../../definitions/complexTypes/sendNotificationTypeItem';
import {
  Applicant,
  FEATURE_FLAGS,
  NotificationSubjects,
  PageUrls,
  Parties,
  TranslationKeys,
} from '../../definitions/constants';
import { HubLinkStatus, displayStatusColorMap } from '../../definitions/hub';
import { TribunalNotification } from '../../definitions/tribunal-notification';
import { AnyRecord } from '../../definitions/util-types';
import { getFlagValue } from '../../modules/featureFlag/launchDarkly';

import { getLanguageParam } from './RouterHelpers';

export async function getSendNotifications(req: AppRequest): Promise<TribunalNotification[]> {
  const { userCase } = req.session;
  const { sendNotificationCollection, acknowledgementOfClaimLetterDetail } = userCase;
  const translations: AnyRecord = {
    ...req.t(TranslationKeys.CONTACT_THE_TRIBUNAL, { returnObjects: true }),
    ...req.t(TranslationKeys.CITIZEN_HUB, { returnObjects: true }),
    ...req.t(TranslationKeys.NOTIFICATIONS, { returnObjects: true }),
  };
  const languageParam = getLanguageParam(req.url);

  const notificationList: TribunalNotification[] = [];

  const notifications: SendNotificationTypeItem[] = await getSendNotification(sendNotificationCollection);
  notifications.forEach(item => notificationList.push(getTribunalNotification(item, translations, languageParam)));

  if (acknowledgementOfClaimLetterDetail?.length) {
    notificationList.push({
      redirectUrl: PageUrls.CITIZEN_HUB_DOCUMENT.replace(':documentType', TranslationKeys.CITIZEN_HUB_ACKNOWLEDGEMENT),
      sendNotificationTitle: translations.et1Serving,
    });
  }

  return notificationList;
}

const getSendNotification = async (
  sendNotificationCollection: SendNotificationTypeItem[]
): Promise<SendNotificationTypeItem[]> => {
  const eccFlag = await getFlagValue(FEATURE_FLAGS.ECC, null);
  if (eccFlag) {
    return sendNotificationCollection?.filter(it => it.value.sendNotificationNotify !== Parties.RESPONDENT_ONLY);
  } else {
    return sendNotificationCollection?.filter(
      it =>
        it.value.sendNotificationNotify !== Parties.RESPONDENT_ONLY &&
        !it.value.sendNotificationSubjectString?.includes(NotificationSubjects.ECC)
    );
  }
};

const getTribunalNotification = (
  item: SendNotificationTypeItem,
  translations: AnyRecord,
  languageParam: string
): TribunalNotification => {
  return {
    date: item.value.date,
    redirectUrl: getRedirectUrl(item, languageParam),
    sendNotificationTitle: item.value.sendNotificationTitle,
    displayStatus: translations[item.value.notificationState],
    statusColor: displayStatusColorMap.get(item.value.notificationState as HubLinkStatus),
  };
};

const getRedirectUrl = (item: SendNotificationTypeItem, languageParam: string): string => {
  const storedRespond = item.value.respondStoredCollection?.find(r => r.value.from === Applicant.CLAIMANT);
  return storedRespond
    ? PageUrls.STORED_TO_SUBMIT_TRIBUNAL.replace(':orderId', item.id).replace(':responseId', storedRespond.id) +
        languageParam
    : PageUrls.NOTIFICATION_DETAILS.replace(':orderId', item.id) + languageParam;
};
