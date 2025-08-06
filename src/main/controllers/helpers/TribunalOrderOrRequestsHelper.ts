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
import { DocumentDetail } from '../../definitions/definition';
import { HubLinkNames, HubLinkStatus, HubLinksStatuses, displayStatusColorMap } from '../../definitions/hub';
import { TribunalNotification } from '../../definitions/tribunal-notification';
import { AnyRecord } from '../../definitions/util-types';
import { getFlagValue } from '../../modules/featureFlag/launchDarkly';

import { getDocumentDetails } from './DocumentHelpers';
import { getLanguageParam } from './RouterHelpers';

export async function getSendNotifications(req: AppRequest): Promise<TribunalNotification[]> {
  const { userCase, user } = req.session;
  const {
    hubLinksStatuses,
    sendNotificationCollection,
    acknowledgementOfClaimLetterDetail,
    responseAcknowledgementDocumentDetail,
    responseRejectionDocumentDetail,
  } = userCase;
  const { accessToken } = user;
  const translations: AnyRecord = {
    ...req.t(TranslationKeys.CONTACT_THE_TRIBUNAL, { returnObjects: true }),
    ...req.t(TranslationKeys.CITIZEN_HUB, { returnObjects: true }),
    ...req.t(TranslationKeys.NOTIFICATIONS, { returnObjects: true }),
  };
  const languageParam = getLanguageParam(req.url);

  const notificationList: TribunalNotification[] = [];

  // sendNotificationCollection
  const notifications: SendNotificationTypeItem[] = await getSendNotification(sendNotificationCollection);
  notifications?.forEach(item => notificationList.push(buildSendNotification(item, translations, languageParam)));

  // acknowledgementOfClaimLetterDetail
  const servingDocs = await getDocsInfo(acknowledgementOfClaimLetterDetail, accessToken);
  const servingState: string = getServingState(hubLinksStatuses);
  servingDocs?.forEach(item =>
    notificationList.push(buildServingNotification(item, translations, languageParam, servingState))
  );

  // responseAcknowledgementDocumentDetail
  const responseAckDocs = await getDocsInfo(responseAcknowledgementDocumentDetail, accessToken);
  responseAckDocs?.forEach(item =>
    notificationList.push(buildResponseAckNotification(item, translations, languageParam))
  );

  // responseRejectionDocumentDetail
  const responseRejDocs = await getDocsInfo(responseRejectionDocumentDetail, accessToken);
  responseRejDocs?.forEach(item =>
    notificationList.push(buildResponseRejNotification(item, translations, languageParam))
  );

  return sortNotificationsByDate(notificationList);
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

const buildSendNotification = (
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

const getDocsInfo = async (documents: DocumentDetail[], accessToken: string): Promise<DocumentDetail[]> => {
  if (!documents?.length) {
    return [];
  }
  await getDocumentDetails(documents, accessToken);
  return documents;
};

const getServingState = (hubLinksStatuses: HubLinksStatuses): string => {
  return hubLinksStatuses && hubLinksStatuses[HubLinkNames.Et1ClaimForm] === HubLinkStatus.SUBMITTED_AND_VIEWED
    ? HubLinkStatus.VIEWED
    : HubLinkStatus.NOT_VIEWED;
};

const buildServingNotification = (
  doc: DocumentDetail,
  translations: AnyRecord,
  languageParam: string,
  state: string
): TribunalNotification => {
  return {
    date: doc.createdOn,
    redirectUrl:
      PageUrls.CITIZEN_HUB_DOCUMENT.replace(':documentType', TranslationKeys.CITIZEN_HUB_ACKNOWLEDGEMENT) +
      languageParam,
    sendNotificationTitle: getServingNotificationTitle(doc, translations),
    displayStatus: translations[state],
    statusColor: displayStatusColorMap.get(state as HubLinkStatus),
  };
};

const getServingNotificationTitle = (doc: DocumentDetail, translations: AnyRecord): string => {
  switch (doc.type) {
    case '2.7':
    case '2.8':
      return translations.notificationTitle.noticeOfClaimAndHearing;
    case '7.7':
    case '7.8':
    case '7.8a':
      return translations.notificationTitle.noticeOfPreliminaryHearing;
    default:
      return translations.notificationTitle.acknowledgementOfClaim;
  }
};

const buildResponseAckNotification = (
  doc: DocumentDetail,
  translations: AnyRecord,
  languageParam: string
): TribunalNotification => {
  const state = HubLinkStatus.READY_TO_VIEW;
  return {
    date: doc.createdOn,
    redirectUrl:
      PageUrls.CITIZEN_HUB_DOCUMENT.replace(':documentType', TranslationKeys.CITIZEN_HUB_RESPONSE_ACKNOWLEDGEMENT) +
      languageParam,
    sendNotificationTitle: translations.notificationTitle.acknowledgementOfResponse,
    displayStatus: translations[state],
    statusColor: displayStatusColorMap.get(state as HubLinkStatus),
  };
};

const buildResponseRejNotification = (
  doc: DocumentDetail,
  translations: AnyRecord,
  languageParam: string
): TribunalNotification => {
  const state = HubLinkStatus.READY_TO_VIEW;
  return {
    date: doc.createdOn,
    redirectUrl:
      PageUrls.CITIZEN_HUB_DOCUMENT.replace(':documentType', TranslationKeys.CITIZEN_HUB_RESPONSE_REJECTION) +
      languageParam,
    sendNotificationTitle: translations.notificationTitle.acknowledgementOfResponse,
    displayStatus: translations[state],
    statusColor: displayStatusColorMap.get(state as HubLinkStatus),
  };
};

const sortNotificationsByDate = (notificationList: TribunalNotification[]): TribunalNotification[] => {
  return notificationList.sort((a, b) => {
    if (a.date && b.date) {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    }
    return 0;
  });
};
