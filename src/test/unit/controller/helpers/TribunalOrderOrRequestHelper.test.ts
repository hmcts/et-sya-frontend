import {
  activateTribunalOrdersAndRequestsLink,
  filterNotificationsWithRequestsOrOrders,
  getRepondentOrderOrRequestDetails,
  populateNotificationsWithRedirectLinksAndStatusColors,
} from '../../../../main/controllers/helpers/TribunalOrderOrRequestHelper';
import {
  SendNotificationType,
  SendNotificationTypeItem,
} from '../../../../main/definitions/complexTypes/sendNotificationTypeItem';
import { Parties, ResponseRequired, TranslationKeys } from '../../../../main/definitions/constants';
import { HubLinkNames, HubLinkStatus } from '../../../../main/definitions/hub';
import { AnyRecord } from '../../../../main/definitions/util-types';
import citizenHubRaw from '../../../../main/resources/locales/en/translation/citizen-hub.json';
import respondentOrderOrRequestRaw from '../../../../main/resources/locales/en/translation/tribunal-order-or-request-details.json';
import mockUserCaseWithCitizenHubLinks from '../../../../main/resources/mocks/mockUserCaseWithCitizenHubLinks';
import {
  mockNotificationItem,
  mockNotificationRespondOnlyReq,
  mockNotificationResponseReq,
  mockNotificationSubmitted,
  mockNotificationViewed,
} from '../../mocks/mockNotificationItem';
import { mockRequestWithTranslation } from '../../mocks/mockRequest';

describe('Tribunal order or request helper', () => {
  const translationJsons = { ...respondentOrderOrRequestRaw, ...citizenHubRaw };
  const req = mockRequestWithTranslation({}, translationJsons);
  const notificationItem = mockNotificationItem;

  const translations: AnyRecord = {
    ...req.t(TranslationKeys.TRIBUNAL_ORDER_OR_REQUEST_DETAILS, { returnObjects: true }),
    ...req.t(TranslationKeys.CITIZEN_HUB, { returnObjects: true }),
  };

  it('should return expected tribunal order or request details content', () => {
    const pageContent = getRepondentOrderOrRequestDetails(translations, notificationItem);
    expect(pageContent[0].key).toEqual({ classes: 'govuk-!-font-weight-regular-m', text: 'Hearing' });
    expect(pageContent[0].value).toEqual({ text: 'Hearing' });
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
      html: "<a href='/getSupportingMaterial/uuid' target='_blank' class='govuk-link'>test.pdf(pdf, 1000Bytes)</a>",
    });
    expect(pageContent[9].key).toEqual({
      classes: 'govuk-!-font-weight-regular-m',
      text: 'Case management order made by',
    });
    expect(pageContent[9].value).toEqual({ text: 'Judge' });
    expect(pageContent[10].key).toEqual({
      classes: 'govuk-!-font-weight-regular-m',
      text: 'Name',
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
    const notificationWithOrder = {
      value: {
        sendNotificationCaseManagement: 'Order',
        sendNotificationSelectParties: Parties.RESPONDENT_ONLY,
        sendNotificationResponseTribunal: ResponseRequired.YES,
      } as SendNotificationType,
    } as SendNotificationTypeItem;

    activateTribunalOrdersAndRequestsLink([notificationWithOrder], mockUserCaseWithCitizenHubLinks);
    expect(mockUserCaseWithCitizenHubLinks.hubLinksStatuses[HubLinkNames.TribunalOrders]).toStrictEqual(
      HubLinkStatus.NOT_VIEWED
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
    expect(populatedNotification.displayStatus).toEqual('Not viewed yet');
  });

  it('should populate notification with correct status when required to respond and no response exists', () => {
    const populatedNotification = populateNotificationsWithRedirectLinksAndStatusColors(
      [mockNotificationResponseReq],
      'url',
      translations
    )[0];
    expect(populatedNotification.statusColor).toEqual('--red');
    expect(populatedNotification.displayStatus).toEqual('Not started yet');
  });

  it('should populate notification with correct status when not required to respond', () => {
    const populatedNotification = populateNotificationsWithRedirectLinksAndStatusColors(
      [mockNotificationRespondOnlyReq],
      'url',
      translations
    )[0];
    expect(populatedNotification.statusColor).toEqual('--red');
    expect(populatedNotification.displayStatus).toEqual('Not viewed yet');
  });

  it('should populate correct status when viewed and not required to respond', () => {
    const populatedNotification = populateNotificationsWithRedirectLinksAndStatusColors(
      [mockNotificationViewed],
      'url',
      translations
    )[0];
    expect(populatedNotification.statusColor).toEqual('--green');
    expect(populatedNotification.displayStatus).toEqual('Viewed');
  });

  it('should populate correct status when required to respond and has responded', () => {
    const populatedNotification = populateNotificationsWithRedirectLinksAndStatusColors(
      [mockNotificationSubmitted],
      'url',
      translations
    )[0];
    expect(populatedNotification.statusColor).toEqual('--green');
    expect(populatedNotification.displayStatus).toEqual('Submitted');
  });

  it('should activate tribunal orders and requests section with not-started status', () => {
    const userCase = { ...mockUserCaseWithCitizenHubLinks };
    const notificationWithOrder = {
      value: {
        sendNotificationCaseManagement: 'Order',
        sendNotificationSelectParties: Parties.CLAIMANT_ONLY,
        sendNotificationResponseTribunal: ResponseRequired.YES,
      } as SendNotificationType,
    } as SendNotificationTypeItem;

    activateTribunalOrdersAndRequestsLink([notificationWithOrder], userCase);
    expect(userCase.hubLinksStatuses[HubLinkNames.TribunalOrders]).toStrictEqual(HubLinkStatus.NOT_STARTED_YET);
  });

  it('tribunal orders and requests section should be not started when a response is required', () => {
    const userCase = { ...mockUserCaseWithCitizenHubLinks };
    const notificationWithOrder = {
      value: {
        sendNotificationCaseManagement: 'Order',
        sendNotificationSelectParties: Parties.CLAIMANT_ONLY,
        sendNotificationResponseTribunal: ResponseRequired.YES,
      } as SendNotificationType,
    } as SendNotificationTypeItem;

    activateTribunalOrdersAndRequestsLink([notificationWithOrder], userCase);
    expect(userCase.hubLinksStatuses[HubLinkNames.TribunalOrders]).toStrictEqual(HubLinkStatus.NOT_STARTED_YET);
  });

  it('tribunal orders and requests section should be not viewed when not viewed and a response is not required', () => {
    const userCase = { ...mockUserCaseWithCitizenHubLinks };
    const notificationWithOrder = {
      value: {
        sendNotificationCaseManagement: 'Order',
        sendNotificationSelectParties: Parties.RESPONDENT_ONLY,
        sendNotificationResponseTribunal: ResponseRequired.YES,
      } as SendNotificationType,
    } as SendNotificationTypeItem;

    activateTribunalOrdersAndRequestsLink([notificationWithOrder], userCase);
    expect(userCase.hubLinksStatuses[HubLinkNames.TribunalOrders]).toStrictEqual(HubLinkStatus.NOT_VIEWED);
  });

  it('tribunal orders and requests section should be viewed when viewed and a response is not required', () => {
    const userCase = { ...mockUserCaseWithCitizenHubLinks };
    const notificationWithOrder = {
      value: {
        sendNotificationCaseManagement: 'Order',
        sendNotificationSelectParties: Parties.RESPONDENT_ONLY,
        sendNotificationResponseTribunal: ResponseRequired.YES,
        notificationState: 'viewed',
      } as SendNotificationType,
    } as SendNotificationTypeItem;

    activateTribunalOrdersAndRequestsLink([notificationWithOrder], userCase);
    expect(userCase.hubLinksStatuses[HubLinkNames.TribunalOrders]).toStrictEqual(HubLinkStatus.VIEWED);
  });

  it('tribunal orders and requests section should be submitted when response is required and has been sent', () => {
    const userCase = { ...mockUserCaseWithCitizenHubLinks };
    const notificationSubmitted = {
      value: {
        sendNotificationCaseManagement: 'Order',
        sendNotificationSelectParties: Parties.CLAIMANT_ONLY,
        sendNotificationResponseTribunal: ResponseRequired.YES,
        notificationState: 'viewed',
        respondCollection: [
          {
            id: 'abc-12',
            value: {
              from: 'Claimant',
            },
          },
        ],
      } as SendNotificationType,
    } as SendNotificationTypeItem;
    activateTribunalOrdersAndRequestsLink([notificationSubmitted], userCase);
    expect(userCase.hubLinksStatuses[HubLinkNames.TribunalOrders]).toStrictEqual(HubLinkStatus.SUBMITTED);
  });

  it('tribunal orders and requests section should be not started when a response is required for any notification', () => {
    const userCase = { ...mockUserCaseWithCitizenHubLinks };
    const notificationWithOrder = {
      value: {
        sendNotificationCaseManagement: 'Order',
        sendNotificationSelectParties: Parties.CLAIMANT_ONLY,
        sendNotificationResponseTribunal: ResponseRequired.YES,
      } as SendNotificationType,
    } as SendNotificationTypeItem;
    const notificationNoResponseRequired = {
      value: {
        sendNotificationCaseManagement: 'Order',
        notificationState: 'viewed',
        sendNotificationNotify: 'Both parties',
        sendNotificationResponseTribunal: 'No',
      } as SendNotificationType,
    } as SendNotificationTypeItem;

    activateTribunalOrdersAndRequestsLink([notificationWithOrder, notificationNoResponseRequired], userCase);
    expect(userCase.hubLinksStatuses[HubLinkNames.TribunalOrders]).toStrictEqual(HubLinkStatus.NOT_STARTED_YET);
  });

  it('should be not viewed when any remain not viewed and a response not required for any notification', () => {
    const userCase = { ...mockUserCaseWithCitizenHubLinks };
    const notificationSubmitted = {
      value: {
        sendNotificationCaseManagement: 'Order',
        sendNotificationSelectParties: Parties.CLAIMANT_ONLY,
        sendNotificationResponseTribunal: ResponseRequired.YES,
        notificationState: 'viewed',
        respondCollection: [
          {
            id: 'abc-12',
            value: {
              from: 'Claimant',
            },
          },
        ],
      } as SendNotificationType,
    } as SendNotificationTypeItem;
    const notificationNoResponseRequired = {
      value: {
        sendNotificationCaseManagement: 'Order',
        notificationState: 'something',
        sendNotificationNotify: 'Both parties',
        sendNotificationResponseTribunal: 'No',
      } as SendNotificationType,
    } as SendNotificationTypeItem;

    activateTribunalOrdersAndRequestsLink([notificationSubmitted, notificationNoResponseRequired], userCase);
    expect(userCase.hubLinksStatuses[HubLinkNames.TribunalOrders]).toStrictEqual(HubLinkStatus.NOT_VIEWED);
  });

  it('tribunal orders and requests section should be submitted when all notifications are viewed or submitted', () => {
    const userCase = { ...mockUserCaseWithCitizenHubLinks };
    const notificationSubmitted = {
      value: {
        sendNotificationCaseManagement: 'Order',
        sendNotificationSelectParties: Parties.CLAIMANT_ONLY,
        sendNotificationResponseTribunal: ResponseRequired.YES,
        notificationState: 'viewed',
        respondCollection: [
          {
            id: 'abc-12',
            value: {
              from: 'Claimant',
            },
          },
        ],
      } as SendNotificationType,
    } as SendNotificationTypeItem;
    const notificationNoResponseRequired = {
      value: {
        sendNotificationCaseManagement: 'Order',
        notificationState: 'viewed',
        sendNotificationNotify: 'Both parties',
        sendNotificationResponseTribunal: 'No',
      } as SendNotificationType,
    } as SendNotificationTypeItem;

    activateTribunalOrdersAndRequestsLink([notificationSubmitted, notificationNoResponseRequired], userCase);
    expect(userCase.hubLinksStatuses[HubLinkNames.TribunalOrders]).toStrictEqual(HubLinkStatus.SUBMITTED);
  });

  it('should be viewed when all notifications are viewed and they did not require a response', () => {
    const userCase = { ...mockUserCaseWithCitizenHubLinks };

    const notification = {
      value: {
        sendNotificationCaseManagement: 'Order',
        notificationState: 'viewed',
        sendNotificationNotify: 'Both parties',
        sendNotificationResponseTribunal: 'No',
      } as SendNotificationType,
    } as SendNotificationTypeItem;
    const notificationNoResponseRequired = {
      value: {
        sendNotificationCaseManagement: 'Order',
        notificationState: 'viewed',
        sendNotificationNotify: 'Both parties',
        sendNotificationResponseTribunal: 'No',
      } as SendNotificationType,
    } as SendNotificationTypeItem;

    activateTribunalOrdersAndRequestsLink([notification, notificationNoResponseRequired], userCase);
    expect(userCase.hubLinksStatuses[HubLinkNames.TribunalOrders]).toStrictEqual(HubLinkStatus.VIEWED);
  });

  it('tribunal orders and requests section should remain as not yet available when order / request notifications do not exist', () => {
    const userCase = { ...mockUserCaseWithCitizenHubLinks };
    userCase.hubLinksStatuses[HubLinkNames.TribunalOrders] = HubLinkStatus.NOT_YET_AVAILABLE;

    activateTribunalOrdersAndRequestsLink([], userCase);
    expect(userCase.hubLinksStatuses[HubLinkNames.TribunalOrders]).toStrictEqual(HubLinkStatus.NOT_YET_AVAILABLE);
  });
});
