import { AppRequest } from '../../definitions/appRequest';
import { CaseWithId, YesOrNo } from '../../definitions/case';
import {
  PseResponseType,
  PseResponseTypeItem,
  RespondNotificationType,
  RespondNotificationTypeItem,
  SendNotificationType,
  SendNotificationTypeItem,
} from '../../definitions/complexTypes/sendNotificationTypeItem';
import {
  Applicant,
  FEATURE_FLAGS,
  NotificationSubjects,
  PageUrls,
  Parties,
  ResponseRequired,
} from '../../definitions/constants';
import { SummaryListRow, addSummaryHtmlRow, addSummaryRow } from '../../definitions/govuk/govukSummaryList';
import { HubLinkNames, HubLinkStatus, displayStatusColorMap } from '../../definitions/hub';
import { AnyRecord, TypeItem } from '../../definitions/util-types';
import { datesStringToDateInLocale } from '../../helper/dateInLocale';
import { getFlagValue } from '../../modules/featureFlag/launchDarkly';

import { addNonAdminResponse, getSupportingMaterialDownloadLink } from './ApplicationDetailsHelper';
import { createDownloadLink } from './DocumentHelpers';
import { getLanguageParam } from './RouterHelpers';

export const getTribunalOrderOrRequestDetails = (
  translations: AnyRecord,
  item: SendNotificationTypeItem,
  url: string
): SummaryListRow[] => {
  const respondentRequestOrOrderDetails = [];

  if (item.value.sendNotificationSelectHearing) {
    respondentRequestOrOrderDetails.push(
      addSummaryRow(translations.hearing, item.value.sendNotificationSelectHearing.selectedLabel)
    );
  }

  respondentRequestOrOrderDetails.push(
    addSummaryRow(translations.dateSent, datesStringToDateInLocale(item.value.date, url)),
    addSummaryRow(translations.sentBy, translations.tribunal)
  );

  if (item.value.sendNotificationCaseManagement) {
    respondentRequestOrOrderDetails.push(
      addSummaryRow(translations.orderOrRequest, translations[item.value.sendNotificationCaseManagement]),
      addSummaryRow(translations.responseDue, translations[item.value.sendNotificationResponseTribunal])
    );
    if (item.value.sendNotificationResponseTribunal.startsWith(YesOrNo.YES)) {
      respondentRequestOrOrderDetails.push(
        addSummaryRow(translations.partyToRespond, translations[item.value.sendNotificationSelectParties])
      );
    }
  }

  if (item.value.sendNotificationAdditionalInfo) {
    respondentRequestOrOrderDetails.push(
      addSummaryRow(translations.addInfo, item.value.sendNotificationAdditionalInfo)
    );
  }

  const docs = item.value.sendNotificationUploadDocument;
  if (docs?.length) {
    docs.forEach(doc => {
      respondentRequestOrOrderDetails.push(
        addSummaryRow(translations.description, doc.value.shortDescription),
        addSummaryHtmlRow(translations.document, createDownloadLink(doc.value.uploadedDocument))
      );
    });
  }

  if (item.value.sendNotificationWhoCaseOrder) {
    respondentRequestOrOrderDetails.push(
      addSummaryRow(translations.orderMadeBy, translations[item.value.sendNotificationWhoCaseOrder]),
      addSummaryRow(translations.fullName, item.value.sendNotificationFullName)
    );
  } else if (item.value.sendNotificationRequestMadeBy) {
    respondentRequestOrOrderDetails.push(
      addSummaryRow(translations.requestMadeBy, translations[item.value.sendNotificationRequestMadeBy]),
      addSummaryRow(translations.fullName, item.value.sendNotificationFullName)
    );
  }

  respondentRequestOrOrderDetails.push(
    addSummaryRow(translations.sentTo, translations[item.value.sendNotificationNotify])
  );

  return respondentRequestOrOrderDetails;
};

export const getRedirectUrlForNotification = (
  notification: SendNotificationTypeItem,
  responseRequired: boolean,
  url: string
): string => {
  if (notification.value.sendNotificationSubjectString?.includes(NotificationSubjects.GENERAL_CORRESPONDENCE)) {
    return PageUrls.GENERAL_CORRESPONDENCE_NOTIFICATION_DETAILS.replace(
      ':itemId',
      `${notification.id}${getLanguageParam(url)}`
    );
  }

  let pageUrl: string = PageUrls.TRIBUNAL_ORDER_OR_REQUEST_DETAILS;
  if (responseRequired) {
    pageUrl = PageUrls.TRIBUNAL_RESPOND_TO_ORDER;
  }
  return pageUrl.replace(':orderId', `${notification.id}${getLanguageParam(url)}`);
};

/**
 * Sets "showAlert" and "needsResponse" for a notification for the notification banner on citizen hub.
 */
export const setNotificationBannerData = (
  items: SendNotificationTypeItem[],
  url: string
): SendNotificationTypeItem[] => {
  const notifications = filterSendNotifications(items);
  if (notifications?.length) {
    notifications.forEach(item => {
      const actionableNotification = isActionableNotification(item);
      if (!actionableNotification) {
        item.showAlert = false;
        return;
      }
      const responseRequired = anyResponseRequired(item);
      item.redirectUrl = getRedirectUrlForNotification(item, false, url);
      item.respondUrl = getRedirectUrlForNotification(item, responseRequired, url);
      item.showAlert = true;
      item.needsResponse = responseRequired;
    });
    return notifications;
  }
};

/**
 * Returns a filtered list of notifications where ANY criteria is matched:
 * 1. Notification is not viewed or started yet
 * 2. A response on the notification is not viewed
 * 3. A response on the notification requires a response where none has been given yet
 */
function isActionableNotification(notification: SendNotificationTypeItem): boolean {
  if (notification.value.sendNotificationNotify === Parties.RESPONDENT_ONLY) {
    return false;
  }
  if (
    notification.value.notificationState === HubLinkStatus.NOT_VIEWED ||
    notification.value.notificationState === HubLinkStatus.NOT_STARTED_YET
  ) {
    return true;
  }
  if (requiresResponse(notification.value) && !hasClaimantResponded(notification.value)) {
    return true;
  }
  if (
    notification.value.respondNotificationTypeCollection?.some(
      r => claimantRelevant(r) && r.value?.isClaimantResponseDue
    )
  ) {
    return true;
  }
  return false;
}

export const anyResponseRequired = (sendNotification: SendNotificationTypeItem): boolean => {
  if (sendNotification.value.notificationState === HubLinkStatus.NOT_STARTED_YET) {
    return true;
  }
  if (
    sendNotification.value?.respondNotificationTypeCollection?.some(
      response => response.value?.isClaimantResponseDue === YesOrNo.YES
    )
  ) {
    return true;
  } else {
    return false;
  }
};

export const populateAllOrdersItemsWithCorrectStatusTranslations = (
  ordersAndRequests: SendNotificationTypeItem[],
  translations: AnyRecord,
  url: string
): SendNotificationTypeItem[] => {
  if (ordersAndRequests?.length) {
    ordersAndRequests.forEach(item => {
      item.displayStatus = translations[item.value.notificationState];
      item.redirectUrl = getRedirectUrlForNotification(item, false, url);
    });
    return ordersAndRequests;
  }
};

export const activateTribunalOrdersAndRequestsLink = async (
  items: SendNotificationTypeItem[],
  userCase: CaseWithId
): Promise<void> => {
  if (!items?.length) {
    return;
  }
  let notices = [];
  const eccFlag = await getFlagValue(FEATURE_FLAGS.ECC, null);

  if (eccFlag) {
    notices = items.filter(
      notice =>
        (notice.value.sendNotificationNotify !== Parties.RESPONDENT_ONLY &&
          notice.value.sendNotificationSubjectString?.includes(NotificationSubjects.ORDER_OR_REQUEST)) ||
        notice.value.sendNotificationSubjectString?.includes(NotificationSubjects.ECC)
    );
  } else {
    notices = items.filter(
      notice =>
        notice.value.sendNotificationNotify !== Parties.RESPONDENT_ONLY &&
        notice.value.sendNotificationSubjectString?.includes(NotificationSubjects.ORDER_OR_REQUEST)
    );
  }

  if (!notices?.length) {
    return;
  }

  if (notices.some(item => item.value.notificationState === HubLinkStatus.NOT_STARTED_YET)) {
    userCase.hubLinksStatuses[HubLinkNames.TribunalOrders] = HubLinkStatus.NOT_STARTED_YET;
  } else if (notices.some(item => item.value.notificationState === HubLinkStatus.NOT_VIEWED)) {
    userCase.hubLinksStatuses[HubLinkNames.TribunalOrders] = HubLinkStatus.NOT_VIEWED;
  } else if (notices.some(item => item.value.notificationState === HubLinkStatus.SUBMITTED)) {
    userCase.hubLinksStatuses[HubLinkNames.TribunalOrders] = HubLinkStatus.SUBMITTED;
  } else if (notices.some(item => item.value.notificationState === HubLinkStatus.VIEWED)) {
    userCase.hubLinksStatuses[HubLinkNames.TribunalOrders] = HubLinkStatus.VIEWED;
  }
};

export const filterSendNotifications = (items: SendNotificationTypeItem[]): SendNotificationTypeItem[] => {
  return items?.filter(
    it =>
      it.value.sendNotificationSubjectString?.includes(NotificationSubjects.ORDER_OR_REQUEST) ||
      it.value.sendNotificationSubjectString?.includes(NotificationSubjects.GENERAL_CORRESPONDENCE) ||
      it.value.sendNotificationSubjectString?.includes(NotificationSubjects.ECC)
  );
};

export const filterECCNotifications = async (
  items: SendNotificationTypeItem[]
): Promise<SendNotificationTypeItem[]> => {
  const eccFlag = await getFlagValue(FEATURE_FLAGS.ECC, null);
  if (eccFlag) {
    return items?.filter(it => it.value.sendNotificationSubjectString?.includes(NotificationSubjects.ECC));
  }
  return [];
};

export const filterOutEcc = (notifications: SendNotificationTypeItem[]): SendNotificationTypeItem[] => {
  return notifications?.filter(it => !it.value.sendNotificationSubjectString?.includes(NotificationSubjects.ECC));
};

function requiresResponse(notification: SendNotificationType) {
  return (
    notification.sendNotificationResponseTribunal === ResponseRequired.YES &&
    notification.sendNotificationSelectParties !== Parties.RESPONDENT_ONLY
  );
}

function hasClaimantResponded(notification: SendNotificationType) {
  return notification.respondCollection?.filter(o => o.value.from === Applicant.CLAIMANT).length > 0;
}

const claimantRelevant = (response: TypeItem<RespondNotificationType>): boolean => {
  return response.value.respondNotificationPartyToNotify !== Parties.RESPONDENT_ONLY;
};

export const getNotificationResponses = async (
  sendNotificationType: SendNotificationType,
  translations: AnyRecord,
  req: AppRequest
): Promise<any> => {
  const nonAdminRespondCollection = sendNotificationType?.respondCollection || [];
  const adminResponseCollection = sendNotificationType?.respondNotificationTypeCollection || [];
  const allResponses: any[] = [];
  const combinedResponses = [...nonAdminRespondCollection, ...adminResponseCollection];
  if (!combinedResponses.length) {
    return [];
  }
  combinedResponses.sort(sortResponsesByDate);
  for (const response of combinedResponses) {
    let responseToAdd;
    if (instanceOfPseResponse(response)) {
      responseToAdd = await getNonAdminResponse(response, req, translations);
    } else {
      responseToAdd = await populateAdminResponse(response, req, translations);
    }
    if (responseToAdd !== undefined) {
      allResponses.push(responseToAdd);
    }
  }
  return allResponses;
};

const populateAdminResponse = async (
  response: RespondNotificationTypeItem,
  req: AppRequest<Partial<AnyRecord>>,
  translations: AnyRecord
): Promise<any> => {
  if (response.value.respondNotificationPartyToNotify === Parties.RESPONDENT_ONLY) {
    return;
  }
  const responseDate = datesStringToDateInLocale(response.value.respondNotificationDate, req.url);
  return [
    {
      key: {
        text: translations.responseItem,
        classes: 'govuk-!-font-weight-regular-m',
      },
      value: { text: response.value.respondNotificationTitle },
    },
    {
      key: {
        text: translations.date,
        classes: 'govuk-!-font-weight-regular-m',
      },
      value: { text: responseDate },
    },
    {
      key: {
        text: translations.sentBy,
        classes: 'govuk-!-font-weight-regular-m',
      },
      value: { text: translations.tribunal },
    },
    {
      key: {
        text: translations.orderOrRequest,
        classes: 'govuk-!-font-weight-regular-m',
      },
      value: { text: translations[response.value.respondNotificationCmoOrRequest] },
    },
    {
      key: {
        text: translations.responseDue,
        classes: 'govuk-!-font-weight-regular-m',
      },
      value: { text: translations[response.value.respondNotificationResponseRequired] },
    },
    {
      key: {
        text: translations.partyToRespond,
        classes: 'govuk-!-font-weight-regular-m',
      },
      value: { text: translations[response.value.respondNotificationWhoRespond] },
    },
    {
      key: {
        text: translations.additionalInfo,
        classes: 'govuk-!-font-weight-regular-m',
      },
      value: { text: response.value.respondNotificationAdditionalInfo },
    },
    {
      key: {
        text: translations.description,
        classes: 'govuk-!-font-weight-regular-m',
      },
      value: {
        text: response.value.respondNotificationUploadDocument?.find(element => element !== undefined).value
          .shortDescription,
      },
    },
    {
      key: {
        text: translations.document,
        classes: 'govuk-!-font-weight-regular-m',
      },
      value: {
        html: await getSupportingMaterialDownloadLink(
          response.value.respondNotificationUploadDocument?.find(element => element !== undefined).value
            .uploadedDocument,
          req.session.user?.accessToken
        ),
      },
    },
    {
      key: {
        text: translations.requestMadeBy,
        classes: 'govuk-!-font-weight-regular-m',
      },
      value: {
        text:
          response.value.respondNotificationRequestMadeBy === 'Request'
            ? translations[response.value.respondNotificationRequestMadeBy]
            : translations[response.value.respondNotificationCaseManagementMadeBy],
      },
    },
    {
      key: {
        text: translations.fullName,
        classes: 'govuk-!-font-weight-regular-m',
      },
      value: { text: response.value.respondNotificationFullName },
    },
    {
      key: {
        text: translations.sentTo,
        classes: 'govuk-!-font-weight-regular-m',
      },
      value: { text: translations[response.value.respondNotificationPartyToNotify] },
    },
  ];
};

async function getNonAdminResponse(
  response: TypeItem<PseResponseType>,
  req: AppRequest<Partial<AnyRecord>>,
  translations: AnyRecord
) {
  const responseDate = datesStringToDateInLocale(response.value.date, req.url);
  if (
    response.value.from === Applicant.CLAIMANT ||
    (response.value.from === Applicant.RESPONDENT && response.value.copyToOtherParty === YesOrNo.YES)
  ) {
    return addNonAdminResponse(translations, response, req.session.user?.accessToken, responseDate);
  }
}

export const getClaimantTribunalResponseBannerContent = (
  notifications: SendNotificationTypeItem[],
  languageParam: string
): { redirectUrl: string; copyToOtherParty?: string }[] => {
  if (!notifications?.length) {
    return [];
  }

  return notifications.flatMap(
    notification =>
      notification.value.respondCollection
        ?.filter(
          response =>
            response.value.from === Applicant.CLAIMANT && response.value.responseState !== HubLinkStatus.VIEWED
        )
        .map(response => ({
          redirectUrl: `/tribunal-order-or-request-details/${notification.id}${languageParam}`,
          copyToOtherParty: response.value.copyToOtherParty,
        })) ?? []
  );
};

export async function getSendNotifications(
  sendNotificationCollection: SendNotificationTypeItem[],
  translations: AnyRecord,
  languageParam: string
): Promise<SendNotificationTypeItem[]> {
  let notifications: SendNotificationTypeItem[];
  const eccFlag = await getFlagValue(FEATURE_FLAGS.ECC, null);
  if (eccFlag) {
    notifications = sendNotificationCollection?.filter(
      it =>
        (it.value.sendNotificationNotify !== Parties.RESPONDENT_ONLY &&
          it.value.sendNotificationSubjectString?.includes(NotificationSubjects.ORDER_OR_REQUEST)) ||
        it.value.sendNotificationSubjectString?.includes(NotificationSubjects.ECC)
    );
  } else {
    notifications = sendNotificationCollection?.filter(
      it =>
        it.value.sendNotificationNotify !== Parties.RESPONDENT_ONLY &&
        it.value.sendNotificationSubjectString?.includes(NotificationSubjects.ORDER_OR_REQUEST) &&
        !it.value.sendNotificationSubjectString?.includes(NotificationSubjects.ECC)
    );
  }
  notifications.forEach(item => {
    item.redirectUrl = `/tribunal-order-or-request-details/${item.id}${languageParam}`;
    item.displayStatus = translations[item.value.notificationState];
    item.statusColor = displayStatusColorMap.get(item.value.notificationState as HubLinkStatus);
  });
  return notifications;
}

const sortResponsesByDate = (
  a: PseResponseTypeItem | RespondNotificationTypeItem,
  b: PseResponseTypeItem | RespondNotificationTypeItem
): number => {
  const typeA = instanceOfPseResponse(a);
  const typeB = instanceOfPseResponse(b);
  const da = typeA ? new Date(a.value.date) : new Date(a.value.respondNotificationDate);
  const db = typeB ? new Date(b.value.date) : new Date(b.value.respondNotificationDate);

  return da.valueOf() - db.valueOf();
};

function instanceOfPseResponse(
  object: PseResponseTypeItem | RespondNotificationTypeItem
): object is PseResponseTypeItem {
  return 'date' in object.value;
}
