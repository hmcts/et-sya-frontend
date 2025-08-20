import { SendNotificationTypeItem } from '../../definitions/complexTypes/sendNotificationTypeItem';
import { NotificationSubjects, PageUrls } from '../../definitions/constants';
import { SummaryListRow, addSummaryHtmlRow, addSummaryRow } from '../../definitions/govuk/govukSummaryList';
import { HubLinkStatus, statusColorMap } from '../../definitions/hub';
import { AnyRecord } from '../../definitions/util-types';
import { datesStringToDateInLocale } from '../../helper/dateInLocale';

import { createDownloadLink } from './DocumentHelpers';
import { getLanguageParam } from './RouterHelpers';
import { formatNotificationSubjects } from './TribunalOrderOrRequestDetailsHelper';

export const getCorrespondenceNotificationDetails = (
  translations: AnyRecord,
  item: SendNotificationTypeItem,
  url: string
): SummaryListRow[] => {
  const generalCorrespondenceNotification = [];
  generalCorrespondenceNotification.push(
    addSummaryRow(
      translations.notificationSubject,
      formatNotificationSubjects(item.value.sendNotificationSubject, translations)
    ),
    addSummaryRow(translations.dateSent, datesStringToDateInLocale(item.value.date, url)),
    addSummaryRow(translations.sentBy, translations.tribunal),
    addSummaryRow(translations.addInfo, item.value.sendNotificationAdditionalInfo)
  );

  const docs = item.value.sendNotificationUploadDocument;
  if (docs?.length) {
    docs.forEach(doc => {
      generalCorrespondenceNotification.push(
        addSummaryRow(translations.description, doc.value.shortDescription),
        addSummaryHtmlRow(translations.document, createDownloadLink(doc.value.uploadedDocument))
      );
    });
  }

  generalCorrespondenceNotification.push(
    addSummaryRow(
      translations.sentTo,
      translations[item.value.sendNotificationNotify] || item.value.sendNotificationNotify
    )
  );

  return generalCorrespondenceNotification;
};

export const updateGeneralCorrespondenceRedirectLinksAndStatus = (
  notifications: SendNotificationTypeItem[],
  url: string,
  translations: AnyRecord
): void => {
  notifications.forEach(item => {
    if (item.value.sendNotificationSubject.includes(NotificationSubjects.GENERAL_CORRESPONDENCE)) {
      item.redirectUrl = PageUrls.GENERAL_CORRESPONDENCE_NOTIFICATION_DETAILS.replace(
        ':itemId',
        `${item.id}${getLanguageParam(url)}`
      );
      item.statusColor = statusColorMap.get(<HubLinkStatus>item.value.notificationState);
      item.displayStatus = translations[item.value.notificationState];
    }
  });
};
