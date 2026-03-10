import {
  getCorrespondenceNotificationDetails,
  updateGeneralCorrespondenceRedirectLinksAndStatus,
} from '../../../../main/controllers/helpers/GeneralCorrespondenceHelper';
import { TranslationKeys } from '../../../../main/definitions/constants';
import { AnyRecord } from '../../../../main/definitions/util-types';
import citizenHubRaw from '../../../../main/resources/locales/en/translation/citizen-hub.json';
import generalCorrespondenceRaw from '../../../../main/resources/locales/en/translation/general-correspondence-notification-details.json';
import notificationSubjectsRaw from '../../../../main/resources/locales/en/translation/notification-subjects.json';
import { mockNotificationItemOther } from '../../mocks/mockNotificationItem';
import { mockRequestWithTranslation } from '../../mocks/mockRequest';

describe('General correspondence helper', () => {
  const translationJsons = { ...generalCorrespondenceRaw, ...notificationSubjectsRaw, ...citizenHubRaw };
  const req = mockRequestWithTranslation({}, translationJsons);
  const notificationItem = mockNotificationItemOther;
  const translations: AnyRecord = {
    ...req.t(TranslationKeys.NOTIFICATION_SUBJECTS, { returnObjects: true }),
    ...req.t(TranslationKeys.GENERAL_CORRESPONDENCE_NOTIFICATION_DETAILS, { returnObjects: true }),
  };

  it('should change notification redirect link to correspondence link', () => {
    updateGeneralCorrespondenceRedirectLinksAndStatus([notificationItem], 'url', translationJsons);
    expect(notificationItem.redirectUrl).toEqual(
      '/general-correspondence-notification-details/2c6ae9f6-66cd-4a6b-86fa-0eabcb64bf29?lng=en'
    );
  });

  it('should return expected correspondece notification details content', () => {
    const pageContent = getCorrespondenceNotificationDetails(translations, notificationItem, 'any url');
    expect(pageContent[0].key).toEqual({ classes: 'govuk-!-font-weight-regular-m', text: 'Notification Subject' });
    expect(pageContent[0].value).toEqual({ text: 'Other (General correspondence)' });
    expect(pageContent[1].key).toEqual({ classes: 'govuk-!-font-weight-regular-m', text: 'Date sent' });
    expect(pageContent[1].value).toEqual({ text: '23 August 2023' });
    expect(pageContent[2].key).toEqual({ classes: 'govuk-!-font-weight-regular-m', text: 'Sent by' });
    expect(pageContent[2].value).toEqual({ text: 'Tribunal' });
    expect(pageContent[3].key).toEqual({
      classes: 'govuk-!-font-weight-regular-m',
      text: 'Additional information',
    });
    expect(pageContent[3].value).toEqual({ text: 'Additional info' });

    expect(pageContent[4].key).toEqual({
      classes: 'govuk-!-font-weight-regular-m',
      text: 'Description',
    });
    expect(pageContent[4].value).toEqual({ text: 'Short description' });
    expect(pageContent[5].key).toEqual({
      classes: 'govuk-!-font-weight-regular-m',
      text: 'Document',
    });
    expect(pageContent[5].value).toEqual({
      html: "<a href='/getSupportingMaterial/uuid' target='_blank' class='govuk-link'>test.pdf</a>",
    });
    expect(pageContent[6].key).toEqual({
      classes: 'govuk-!-font-weight-regular-m',
      text: 'Sent to',
    });
    expect(pageContent[6].value).toEqual({ text: 'Both parties' });
  });
});
