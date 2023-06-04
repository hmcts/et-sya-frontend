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
  const userCase = req.session?.userCase;
  if (items?.length && filterNotificationsWithRequestsOrOrders(items).length) {
    // check if they are not for claimant
    const anyRequireResponse = items.some(
      item =>
        item.value.sendNotificationResponseTribunal === ResponseRequired.YES &&
        item.value.sendNotificationSelectParties !== Parties.RESPONDENT_ONLY
    );
    const anyRequireResponseAndNotResponded = items.some(item => {
      return (
        item.value.sendNotificationResponseTribunal === ResponseRequired.YES &&
        item.value.sendNotificationSelectParties !== Parties.RESPONDENT_ONLY &&
        !item.value.respondCollection?.some(r => r.value.from === Applicant.CLAIMANT)
      );
    });

    const anyNotViewed = items.some(item => {
      return (
        item.value.notificationState === HubLinkStatus.NOT_STARTED_YET ||
        item.value.notificationState === HubLinkStatus.NOT_VIEWED
      );
    });
    const allViewed = items.every(item => {
      return item.value.notificationState === HubLinkStatus.VIEWED;
    });
    console.log('anyRequireResponse', anyRequireResponse);
    console.log('anyRequireResponseAndNotResponded', anyRequireResponseAndNotResponded);
    console.log('anyNotViewed', anyNotViewed);
    console.log('allViewed', allViewed);

    // all that require a response have been responded to
    // anyRequireRponseAndNotRespond must be false
    // and anyRequireresponse must be true
    switch (true) {
      case anyRequireResponseAndNotResponded:
        console.log('case 1');
        userCase.hubLinksStatuses[HubLinkNames.TribunalOrders] = HubLinkStatus.NOT_STARTED_YET;
        break;
      case anyNotViewed:
        console.log('case 2');
        userCase.hubLinksStatuses[HubLinkNames.TribunalOrders] = HubLinkStatus.NOT_VIEWED;
        break;
      case anyRequireResponse && !anyRequireResponseAndNotResponded && allViewed:
        console.log('case 3');
        userCase.hubLinksStatuses[HubLinkNames.TribunalOrders] = HubLinkStatus.SUBMITTED;
        break;
      case allViewed:
        console.log('case 4');
        userCase.hubLinksStatuses[HubLinkNames.TribunalOrders] = HubLinkStatus.VIEWED;
        break;
      default:
        // eslint-disable-next-line no-console
        console.log('Hublink - Order or Request state exception');
    }
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
