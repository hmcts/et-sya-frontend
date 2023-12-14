import { AppRequest } from '../../definitions/appRequest';
import { CaseWithId, YesOrNo } from '../../definitions/case';
import {
  PseResponseType,
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
    if (item.value.sendNotificationResponseTribunal === YesOrNo.YES) {
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

export const populateNotificationsWithRedirectLinksAndStatusColors = (
  notifications: SendNotificationTypeItem[],
  url: string,
  translations: AnyRecord
): SendNotificationTypeItem[] => {
  if (notifications?.length) {
    notifications.forEach(item => {
      const responseRequired =
        item.value.sendNotificationResponseTribunal === ResponseRequired.YES &&
        item.value.sendNotificationSelectParties !== Parties.RESPONDENT_ONLY;
      const hasResponded = item.value.respondCollection?.some(r => r.value.from === Applicant.CLAIMANT) || false;
      const isNotViewedYet = item.value.notificationState === HubLinkStatus.NOT_VIEWED;
      const isViewed = item.value.notificationState === HubLinkStatus.VIEWED;

      let hubLinkStatus: HubLinkStatus;

      switch (true) {
        case responseRequired && hasResponded:
          hubLinkStatus = HubLinkStatus.SUBMITTED;
          break;
        case responseRequired && !hasResponded:
          hubLinkStatus = HubLinkStatus.NOT_STARTED_YET;
          break;
        case !responseRequired && isNotViewedYet:
          hubLinkStatus = HubLinkStatus.NOT_VIEWED;
          break;
        case !responseRequired && isViewed:
          hubLinkStatus = HubLinkStatus.VIEWED;
          break;
        default:
          throw new Error(`Illegal order/ request state, title: ${item.value.sendNotificationTitle}, id: ${item.id}`);
      }
      item.displayStatus = translations[hubLinkStatus];
      item.statusColor = displayStatusColorMap.get(hubLinkStatus);
      item.redirectUrl = getRedirectUrlForNotification(item, false, url);
      item.respondUrl = getRedirectUrlForNotification(item, responseRequired, url);
      setNotificationBannerData(item);
    });
    return notifications;
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

  const anyRequireResponse = notices.some(responseRequired);

  const anyRequireResponseAndNotResponded = notices.some(item => {
    return responseRequired(item) && !item.value.respondCollection?.some(r => r.value.from === Applicant.CLAIMANT);
  });

  const anyNotViewed = notices.some(item => {
    return item.value.notificationState === HubLinkStatus.NOT_VIEWED;
  });

  const allViewed = notices.every(item => {
    return item.value.notificationState === HubLinkStatus.VIEWED;
  });

  switch (true) {
    case anyRequireResponseAndNotResponded:
      userCase.hubLinksStatuses[HubLinkNames.TribunalOrders] = HubLinkStatus.NOT_STARTED_YET;
      break;
    case anyRequireResponse && !anyRequireResponseAndNotResponded && !anyNotViewed:
      userCase.hubLinksStatuses[HubLinkNames.TribunalOrders] = HubLinkStatus.SUBMITTED;
      break;
    case anyNotViewed:
      userCase.hubLinksStatuses[HubLinkNames.TribunalOrders] = HubLinkStatus.NOT_VIEWED;
      break;
    case allViewed:
      userCase.hubLinksStatuses[HubLinkNames.TribunalOrders] = HubLinkStatus.VIEWED;
      break;
  }
};

const responseRequired = (item: SendNotificationTypeItem) =>
  item.value.sendNotificationResponseTribunal === ResponseRequired.YES &&
  item.value.sendNotificationSelectParties !== Parties.RESPONDENT_ONLY;

export const getAndPopulateNotifications = (
  items: SendNotificationTypeItem[],
  url: string,
  translations: AnyRecord
): SendNotificationTypeItem[] => {
  const notifications = filterSendNotifications(items);

  return populateNotificationsWithRedirectLinksAndStatusColors(notifications, url, translations);
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

/**
 * Returns a filtered list of notifications where ANY criteria is matched:
 * 1. Notification is not viewed
 * 2. A response on the notification is not viewed
 * 3. A response on the notification is viewed and requires a response where none has been given yet
 */
export function filterActionableNotifications(notifications: SendNotificationTypeItem[]): SendNotificationTypeItem[] {
  return notifications
    ?.filter(o => o.value.sendNotificationNotify !== Parties.RESPONDENT_ONLY)
    .filter(o => {
      if (o.value.notificationState !== HubLinkStatus.VIEWED) {
        return true;
      }

      if (requiresResponse(o.value) && !hasClaimantResponded(o.value)) {
        return true;
      }

      return o.value.respondNotificationTypeCollection?.some(
        r => claimantRelevant(r) && (r.value.state !== HubLinkStatus.VIEWED || r.value.isClaimantResponseDue)
      );
    });
}

/**
 * Sets "showAlert" and "needsResponse" for a notification for the notification banner on citizen hub.
 * needsResponse is true if a notification (or tribunal response on it) requires a response where none has been given.
 * showAlert is true if needsResponse is set or if a notification (or tribunal response on it) is unviewed.
 */
export function setNotificationBannerData(notification: SendNotificationTypeItem): void {
  const actionableNotifications = filterActionableNotifications([notification]);
  if (!actionableNotifications.length) {
    notification.showAlert = false;
    return;
  }

  notification.showAlert = true;
  notification.needsResponse = false;

  const value = actionableNotifications[0].value;
  const responses = value.respondNotificationTypeCollection?.filter(claimantRelevant) || [];

  const hasAnyResponsesDue = responses?.some(r => r.value.isClaimantResponseDue);

  if (hasAnyResponsesDue || (requiresResponse(notification.value) && !hasClaimantResponded(notification.value))) {
    notification.needsResponse = true;
  }
}

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
  const allResponses: any[] = [];
  const respondCollection = sendNotificationType.respondCollection;
  if (respondCollection?.length) {
    await addClaimantRespondentResponses(respondCollection, req, translations, allResponses);
  }

  const adminResponseCollection = sendNotificationType.respondNotificationTypeCollection;
  if (adminResponseCollection?.length) {
    await addTribunalResponses(adminResponseCollection, req, allResponses, translations);
  }
  return allResponses;
};

const addAdminResponse = async (
  allResponses: any[],
  translations: AnyRecord,
  response: RespondNotificationTypeItem,
  accessToken: string,
  responseDate: string
): Promise<any> => {
  allResponses.push([
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
          accessToken
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
  ]);
};

async function addTribunalResponses(
  adminResponseCollection: TypeItem<RespondNotificationType>[],
  req: AppRequest<Partial<AnyRecord>>,
  allResponses: any[],
  translations: AnyRecord
) {
  for (const response of adminResponseCollection) {
    const responseDate = datesStringToDateInLocale(response.value.respondNotificationDate, req.url);
    const responseToAdd = await addAdminResponse(
      allResponses,
      translations,
      response,
      req.session.user?.accessToken,
      responseDate
    );
    if (responseToAdd !== undefined) {
      allResponses.push(responseToAdd);
    }
  }
}

async function addClaimantRespondentResponses(
  respondCollection: TypeItem<PseResponseType>[],
  req: AppRequest<Partial<AnyRecord>>,
  translations: AnyRecord,
  allResponses: any[]
) {
  for (const response of respondCollection) {
    const responseDate = datesStringToDateInLocale(response.value.date, req.url);
    let responseToAdd;
    if (
      response.value.from === Applicant.CLAIMANT ||
      (response.value.from === Applicant.RESPONDENT && response.value.copyToOtherParty === YesOrNo.YES)
    ) {
      responseToAdd = await addNonAdminResponse(translations, response, req.session.user?.accessToken, responseDate);
    }
    if (responseToAdd !== undefined) {
      allResponses.push(responseToAdd);
    }
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
