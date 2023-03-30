import {
  activateTribunalOrdersAndRequestsLink,
  filterNotificationsWithRequestsOrOrders,
  getRepondentOrderOrRequestDetails,
  populateNotificationsWithRedirectLinksAndStatusColors,
} from '../../../../main/controllers/helpers/TribunalOrderOrRequestHelper';
import { Document } from '../../../../main/definitions/case';
import {
  DocumentType,
  DocumentTypeItem,
  SendNotificationType,
  SendNotificationTypeItem,
} from '../../../../main/definitions/complexTypes/sendNotificationTypeItem';
import { Parties, ResponseRequired, TranslationKeys } from '../../../../main/definitions/constants';
import { HubLinkNames, HubLinkStatus, HubLinksStatuses } from '../../../../main/definitions/hub';
import { AnyRecord } from '../../../../main/definitions/util-types';
import citizenHubRaw from '../../../../main/resources/locales/en/translation/citizen-hub.json';
import respondentOrderOrRequestRaw from '../../../../main/resources/locales/en/translation/tribunal-order-or-request-details.json';
import { mockRequest, mockRequestWithTranslation } from '../../mocks/mockRequest';

describe('Tribunal order or request helper', () => {
  const translationJsons = { ...respondentOrderOrRequestRaw, ...citizenHubRaw };
  const req = mockRequestWithTranslation({}, translationJsons);

  const doc: Document = {
    document_url: '',
    document_filename: 'test.pdf',
    document_binary_url: '',
    document_size: 1000,
    document_mime_type: 'pdf',
  };

  const docType = {
    shortDescription: 'Short description',
    uploadedDocument: doc,
  } as DocumentType;

  const docItem = {
    value: docType,
  } as DocumentTypeItem;

  const notificationType = {
    number: '1',
    sendNotificationSelectHearing: 'Selected hearing',
    date: '2019-05-02',
    sentBy: 'Tribunal',
    sendNotificationCaseManagement: 'Order',
    sendNotificationResponseTribunal: 'Required',
    sendNotificationSelectParties: 'Both',
    sendNotificationAdditionalInfo: 'Additional info',
    sendNotificationUploadDocument: [docItem],
    sendNotificationWhoCaseOrder: 'Judge',
    sendNotificationFullName: 'Bob',
    sendNotificationNotify: 'Both',
    notificationState: 'notStartedYet',
  } as SendNotificationType;

  const notificationItem = {
    id: '2c6ae9f6-66cd-4a6b-86fa-0eabcb64bf28',
    value: notificationType,
  } as SendNotificationTypeItem;

  const translations: AnyRecord = {
    ...req.t(TranslationKeys.TRIBUNAL_ORDER_OR_REQUEST_DETAILS, { returnObjects: true }),
    ...req.t(TranslationKeys.CITIZEN_HUB, { returnObjects: true }),
  };

  it('should return expected tribunal order or request details content', () => {
    const pageContent = getRepondentOrderOrRequestDetails(translations, notificationItem);
    expect(pageContent[0].key).toEqual({ classes: 'govuk-!-font-weight-regular-m', text: 'Hearing' });
    expect(pageContent[0].value).toEqual({ text: 'Selected hearing' });
    expect(pageContent[1].key).toEqual({ classes: 'govuk-!-font-weight-regular-m', text: 'Date sent' });
    expect(pageContent[1].value).toEqual({ text: '2019-05-02' });
    expect(pageContent[2].key).toEqual({ classes: 'govuk-!-font-weight-regular-m', text: 'Sent by' });
    expect(pageContent[2].value).toEqual({ text: 'Tribunal' });
    expect(pageContent[3].key).toEqual({
      classes: 'govuk-!-font-weight-regular-m',
      text: 'Case management order or request?',
    });
    expect(pageContent[3].value).toEqual({ text: 'Order' });
    expect(pageContent[4].key).toEqual({
      classes: 'govuk-!-font-weight-regular-m',
      text: 'Response due',
    });
    expect(pageContent[4].value).toEqual({ text: 'Required' });
    expect(pageContent[5].key).toEqual({
      classes: 'govuk-!-font-weight-regular-m',
      text: 'Party or parties to respond',
    });
    expect(pageContent[5].value).toEqual({ text: 'Both' });
    expect(pageContent[6].key).toEqual({
      classes: 'govuk-!-font-weight-regular-m',
      text: 'Additional information',
    });
    expect(pageContent[6].value).toEqual({ text: 'Additional info' });
    expect(pageContent[7].key).toEqual({
      classes: 'govuk-!-font-weight-regular-m',
      text: 'Description',
    });
    expect(pageContent[7].value).toEqual({ text: 'Short description' });
    expect(pageContent[8].key).toEqual({
      classes: 'govuk-!-font-weight-regular-m',
      text: 'Document',
    });
    expect(pageContent[8].value).toEqual({
      html: "<a href='/getTribunalOrderDocument/' target='_blank' class='govuk-link'>test.pdf(pdf, 1000Bytes)</a>",
    });
    expect(pageContent[9].key).toEqual({
      classes: 'govuk-!-font-weight-regular-m',
      text: 'Case management order made by',
    });
    expect(pageContent[9].value).toEqual({ text: 'Judge' });
    expect(pageContent[10].key).toEqual({
      classes: 'govuk-!-font-weight-regular-m',
      text: 'Full name',
    });
    expect(pageContent[10].value).toEqual({ text: 'Bob' });
    expect(pageContent[11].key).toEqual({
      classes: 'govuk-!-font-weight-regular-m',
      text: 'Sent to',
    });
    expect(pageContent[11].value).toEqual({ text: 'Both' });
  });

  it('should filter only orders and requests', () => {
    const notificationWithoutOrderOrRequest = {
      value: {
        sendNotificationCaseManagement: undefined,
      } as SendNotificationType,
    } as SendNotificationTypeItem;

    const filteredNotifications = filterNotificationsWithRequestsOrOrders([
      notificationWithoutOrderOrRequest,
      notificationItem,
    ]);
    expect(filteredNotifications).toHaveLength(1);
    expect(filteredNotifications[0].value.sendNotificationCaseManagement).toStrictEqual('Order');
  });

  it('should activate tribunal orders and requests section with not-viewed status', () => {
    const request = mockRequest({});
    request.session.userCase.hubLinksStatuses = new HubLinksStatuses();

    const notificationWithOrder = {
      value: {
        sendNotificationCaseManagement: 'Order',
        sendNotificationSelectParties: Parties.RESPONDENT_ONLY,
        sendNotificationResponseTribunal: ResponseRequired.YES,
      } as SendNotificationType,
    } as SendNotificationTypeItem;

    activateTribunalOrdersAndRequestsLink([notificationWithOrder], request);
    expect(request.session.userCase.hubLinksStatuses[HubLinkNames.TribunalOrders]).toStrictEqual(
      HubLinkStatus.NOT_VIEWED
    );
  });

  it('should activate tribunal orders and requests section with not-started status', () => {
    const request = mockRequest({});
    request.session.userCase.hubLinksStatuses = new HubLinksStatuses();

    const notificationWithOrder = {
      value: {
        sendNotificationCaseManagement: 'Order',
        sendNotificationSelectParties: Parties.CLAIMANT_ONLY,
        sendNotificationResponseTribunal: ResponseRequired.YES,
      } as SendNotificationType,
    } as SendNotificationTypeItem;

    activateTribunalOrdersAndRequestsLink([notificationWithOrder], request);
    expect(request.session.userCase.hubLinksStatuses[HubLinkNames.TribunalOrders]).toStrictEqual(
      HubLinkStatus.NOT_STARTED_YET
    );
  });

  it('should populate notification with redirect link, status and color', () => {
    const populatedNotification = populateNotificationsWithRedirectLinksAndStatusColors(
      [notificationItem],
      'url',
      translations
    )[0];
    expect(populatedNotification.redirectUrl).toEqual(
      '/tribunal-order-or-request-details/2c6ae9f6-66cd-4a6b-86fa-0eabcb64bf28?lng=en'
    );
    expect(populatedNotification.statusColor).toEqual('--red');
    expect(populatedNotification.displayStatus).toEqual('Not started yet');
  });
});
