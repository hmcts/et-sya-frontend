import { AppRequest } from '../../definitions/appRequest';
import { SendNotificationTypeItem } from '../../definitions/complexTypes/sendNotificationTypeItem';
import { Applicant, PageUrls, Parties, ResponseRequired } from '../../definitions/constants';
import { HubLinkNames, HubLinkStatus, displayStatusColorMap } from '../../definitions/hub';
import { AnyRecord } from '../../definitions/util-types';

import { createDownloadLink } from './DocumentHelpers';
import { getLanguageParam } from './RouterHelpers';

export const getRepondentOrderOrRequestDetails = (
  translations: AnyRecord,
  item: SendNotificationTypeItem
): { key: unknown; value?: unknown; actions?: unknown }[] => {
  const respondentRequestOrOrderDetails = [];

  if (item.value.sendNotificationSelectHearing) {
    respondentRequestOrOrderDetails.push({
      key: {
        text: translations.hearing,
        classes: 'govuk-!-font-weight-regular-m',
      },
      value: {
        text: item.value.sendNotificationSelectHearing.selectedLabel,
      },
    });
  }

  respondentRequestOrOrderDetails.push(
    {
      key: {
        text: translations.dateSent,
        classes: 'govuk-!-font-weight-regular-m',
      },
      value: {
        text: item.value.date,
      },
    },
    {
      key: {
        text: translations.sentBy,
        classes: 'govuk-!-font-weight-regular-m',
      },
      value: {
        text: 'Tribunal',
      },
    },
    {
      key: {
        text: translations.orderOrRequest,
        classes: 'govuk-!-font-weight-regular-m',
      },
      value: {
        text: item.value.sendNotificationCaseManagement,
      },
    },
    {
      key: {
        text: translations.responseDue,
        classes: 'govuk-!-font-weight-regular-m',
      },
      value: {
        text: item.value.sendNotificationResponseTribunal,
      },
    },
    {
      key: {
        text: translations.partyToRespond,
        classes: 'govuk-!-font-weight-regular-m',
      },
      value: {
        text: item.value.sendNotificationSelectParties,
      },
    }
  );

  if (item.value.sendNotificationAdditionalInfo) {
    respondentRequestOrOrderDetails.push({
      key: {
        text: translations.addInfo,
        classes: 'govuk-!-font-weight-regular-m',
      },
      value: {
        text: item.value.sendNotificationAdditionalInfo,
      },
    });
  }

  const docs = item.value.sendNotificationUploadDocument;
  if (docs?.length) {
    docs.forEach(doc => {
      respondentRequestOrOrderDetails.push(
        {
          key: {
            text: translations.description,
            classes: 'govuk-!-font-weight-regular-m',
          },
          value: { text: doc.value.shortDescription },
        },
        {
          key: {
            text: translations.document,
            classes: 'govuk-!-font-weight-regular-m',
          },
          value: { html: createDownloadLink(doc.value.uploadedDocument) },
        }
      );
    });
  }

  if (item.value.sendNotificationWhoCaseOrder) {
    respondentRequestOrOrderDetails.push({
      key: {
        text: translations.orderMadeBy,
        classes: 'govuk-!-font-weight-regular-m',
      },
      value: {
        text: item.value.sendNotificationWhoCaseOrder,
      },
    });
  } else {
    respondentRequestOrOrderDetails.push({
      key: {
        text: translations.requestMadeBy,
        classes: 'govuk-!-font-weight-regular-m',
      },
      value: {
        text: item.value.sendNotificationRequestMadeBy,
      },
    });
  }

  respondentRequestOrOrderDetails.push(
    {
      key: {
        text: translations.fullName,
        classes: 'govuk-!-font-weight-regular-m',
      },
      value: {
        text: item.value.sendNotificationFullName,
      },
    },
    {
      key: {
        text: translations.sentTo,
        classes: 'govuk-!-font-weight-regular-m',
      },
      value: {
        text: item.value.sendNotificationNotify,
      },
    }
  );

  return respondentRequestOrOrderDetails;
};

export const populateNotificationsWithRedirectLinksAndStatusColors = (
  notifications: SendNotificationTypeItem[],
  url: string,
  translations: AnyRecord
): SendNotificationTypeItem[] => {
  if (notifications?.length && filterNotificationsWithRequestsOrOrders(notifications).length) {
    notifications.forEach(item => {
      item.redirectUrl = PageUrls.TRIBUNAL_ORDER_OR_REQUEST_DETAILS.replace(
        ':orderId',
        `${item.id}${getLanguageParam(url)}`
      );

      const responseRequired =
        item.value.sendNotificationResponseTribunal === ResponseRequired.YES &&
        item.value.sendNotificationSelectParties !== Parties.RESPONDENT_ONLY;
      const hasResponded = item.value.respondCollection?.some(r => r.value.from === Applicant.CLAIMANT);
      const isNotStarted = item.value.notificationState === HubLinkStatus.NOT_STARTED_YET;
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
        case !responseRequired && (isNotStarted || isNotViewedYet):
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
    });
    return notifications;
  }
};

export const activateTribunalOrdersAndRequestsLink = (items: SendNotificationTypeItem[], req: AppRequest): void => {
  if (!items?.length) {
    return;
  }
  const notices = filterNotificationsWithRequestsOrOrders(items).filter(
    notice => notice.value.sendNotificationNotify !== Parties.RESPONDENT_ONLY
  );
  if (!notices?.length) {
    return;
  }

  const userCase = req.session?.userCase;
  const anyRequireResponse = notices.some(
    item =>
      item.value.sendNotificationResponseTribunal === ResponseRequired.YES &&
      item.value.sendNotificationSelectParties !== Parties.RESPONDENT_ONLY
  );
  const anyRequireResponseAndNotResponded = notices.some(item => {
    return (
      item.value.sendNotificationResponseTribunal === ResponseRequired.YES &&
      item.value.sendNotificationSelectParties !== Parties.RESPONDENT_ONLY &&
      !item.value.respondCollection?.some(r => r.value.from === Applicant.CLAIMANT)
    );
  });

  const allViewed = notices.every(item => {
    return item.value.notificationState === HubLinkStatus.VIEWED;
  });

  switch (true) {
    case anyRequireResponseAndNotResponded:
      userCase.hubLinksStatuses[HubLinkNames.TribunalOrders] = HubLinkStatus.NOT_STARTED_YET;
      break;
    case !allViewed:
      userCase.hubLinksStatuses[HubLinkNames.TribunalOrders] = HubLinkStatus.NOT_VIEWED;
      break;
    case anyRequireResponse && !anyRequireResponseAndNotResponded:
      userCase.hubLinksStatuses[HubLinkNames.TribunalOrders] = HubLinkStatus.SUBMITTED;
      break;
    case allViewed:
      userCase.hubLinksStatuses[HubLinkNames.TribunalOrders] = HubLinkStatus.VIEWED;
      break;
    default:
      console.log('######## order request hub link status is as default ##############');
  }
};

export const filterNotificationsWithRequestsOrOrders = (
  items: SendNotificationTypeItem[]
): SendNotificationTypeItem[] => {
  return items?.filter(
    it =>
      it.value.sendNotificationCaseManagement !== undefined &&
      it.value.sendNotificationCaseManagement !== '' &&
      it.value.sendNotificationCaseManagement !== null
  );
};
