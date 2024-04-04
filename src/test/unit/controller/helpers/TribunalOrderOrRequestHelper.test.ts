import {
  activateTribunalOrdersAndRequestsLink,
  filterActionableNotifications,
  filterECCNotifications,
  filterSendNotifications,
  getClaimantTribunalResponseBannerContent,
  getNotificationResponses,
  getTribunalOrderOrRequestDetails,
  populateAllOrdersItemsWithCorrectStatusTranslations,
  populateNotificationsWithRedirectLinksAndStatusColors,
  setNotificationBannerData,
  updateStoredRedirectUrl,
} from '../../../../main/controllers/helpers/TribunalOrderOrRequestHelper';
import { YesOrNo } from '../../../../main/definitions/case';
import {
  PseResponseType,
  SendNotificationType,
  SendNotificationTypeItem,
} from '../../../../main/definitions/complexTypes/sendNotificationTypeItem';
import {
  Applicant,
  NotificationSubjects,
  Parties,
  ResponseRequired,
  Rule92Types,
  TranslationKeys,
  languages,
} from '../../../../main/definitions/constants';
import { HubLinkNames, HubLinkStatus } from '../../../../main/definitions/hub';
import { AnyRecord } from '../../../../main/definitions/util-types';
import * as LaunchDarkly from '../../../../main/modules/featureFlag/launchDarkly';
import citizenHubRaw from '../../../../main/resources/locales/en/translation/citizen-hub.json';
import commonRaw from '../../../../main/resources/locales/en/translation/common.json';
import respondentOrderOrRequestRaw from '../../../../main/resources/locales/en/translation/tribunal-order-or-request-details.json';
import mockUserCaseWithCitizenHubLinks from '../../../../main/resources/mocks/mockUserCaseWithCitizenHubLinks';
import {
  mockECCNotification,
  mockNotificationItem,
  mockNotificationItemOther,
  mockNotificationRespondOnlyReq,
  mockNotificationResponseReq,
  mockNotificationSubmitted,
  mockNotificationViewed,
  mockNotificationWithResponses,
  mockNotificationWithViewedResponses,
  notificationWithResponses,
} from '../../mocks/mockNotificationItem';
import { mockRequestWithTranslation } from '../../mocks/mockRequest';
import { getOrderOrRequestTribunalResponse, selectedRequestOrOrder } from '../../mocks/mockUserCaseComplete';

describe('Tribunal order or request helper', () => {
  const translationJsons = { ...respondentOrderOrRequestRaw, ...citizenHubRaw, ...commonRaw };
  const req = mockRequestWithTranslation({}, translationJsons);
  const notificationItem = mockNotificationItem;
  const notificationItemOther = mockNotificationItemOther;
  const notificationItemWithResponses = mockNotificationWithResponses;
  const mockLdClient = jest.spyOn(LaunchDarkly, 'getFlagValue');
  mockLdClient.mockResolvedValue(true);
  const summaryListClass = 'govuk-!-font-weight-regular-m';

  const translations: AnyRecord = {
    ...req.t(TranslationKeys.TRIBUNAL_ORDER_OR_REQUEST_DETAILS, { returnObjects: true }),
    ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
    ...req.t(TranslationKeys.CITIZEN_HUB, { returnObjects: true }),
  };

  it('should return expected tribunal order details content', async () => {
    const pageContent = getTribunalOrderOrRequestDetails(translations, notificationItemWithResponses, req.url);
    const responseContent = await getNotificationResponses(notificationWithResponses, translations, req);
    expect(pageContent[0].key).toEqual({ classes: summaryListClass, text: 'Hearing' });
    expect(pageContent[0].value).toEqual({ text: 'Hearing' });
    expect(pageContent[1].key).toEqual({ classes: summaryListClass, text: 'Date sent' });
    expect(pageContent[1].value).toEqual({ text: '2 May 2019' });
    expect(pageContent[2].key).toEqual({ classes: summaryListClass, text: 'Sent by' });
    expect(pageContent[2].value).toEqual({ text: 'Tribunal' });
    expect(pageContent[3].key).toEqual({
      classes: summaryListClass,
      text: 'Case management order or request?',
    });
    expect(pageContent[3].value).toEqual({ text: 'Case management order' });
    expect(pageContent[4].key).toEqual({
      classes: summaryListClass,
      text: 'Response due',
    });
    expect(pageContent[4].value).toEqual({ text: YesOrNo.YES });
    expect(pageContent[5].key).toEqual({
      classes: summaryListClass,
      text: 'Party or parties to respond',
    });
    expect(pageContent[5].value).toEqual({ text: Parties.BOTH_PARTIES });
    expect(pageContent[6].key).toEqual({
      classes: summaryListClass,
      text: 'Additional information',
    });
    expect(pageContent[6].value).toEqual({ text: 'Additional info' });
    expect(pageContent[7].key).toEqual({
      classes: summaryListClass,
      text: 'Description',
    });
    expect(pageContent[7].value).toEqual({ text: 'Short description' });
    expect(pageContent[8].key).toEqual({
      classes: summaryListClass,
      text: 'Document',
    });
    expect(pageContent[8].value).toEqual({
      html: "<a href='/getSupportingMaterial/uuid' target='_blank' class='govuk-link'>test.pdf (pdf, 1000Bytes)</a>",
    });
    expect(pageContent[9].key).toEqual({
      classes: summaryListClass,
      text: 'Case management order made by',
    });
    expect(pageContent[9].value).toEqual({ text: 'Judge' });
    expect(pageContent[10].key).toEqual({
      classes: summaryListClass,
      text: 'Name',
    });
    expect(pageContent[10].value).toEqual({ text: 'Bob' });
    expect(pageContent[11].key).toEqual({
      classes: summaryListClass,
      text: 'Sent to',
    });
    expect(pageContent[11].value).toEqual({ text: Parties.BOTH_PARTIES });
    expect(responseContent[0][0].key).toEqual({
      classes: summaryListClass,
      text: 'Response from',
    });
    expect(responseContent[0][0].value).toEqual({ text: Applicant.CLAIMANT });
    expect(responseContent[0][1].key).toEqual({
      classes: summaryListClass,
      text: 'Response date',
    });
    expect(responseContent[0][1].value).toEqual({ text: '2 May 2019' });
    expect(responseContent[0][2].key).toEqual({
      classes: summaryListClass,
      text: 'What is your response to the tribunal?',
    });
    expect(responseContent[0][2].value).toEqual({ text: 'Some claimant response text' });
    expect(responseContent[0][3].key).toEqual({
      classes: summaryListClass,
      text: 'Supporting material',
    });
    expect(responseContent[0][3].value).toEqual({ text: undefined });
    expect(responseContent[0][4].key).toEqual({
      classes: summaryListClass,
      text: 'Do you want to copy this correspondence to the other party to satisfy the Rules of Procedure?',
    });
    expect(responseContent[0][4].value).toEqual({ text: YesOrNo.YES });
    expect(responseContent[1][0].key).toEqual({
      classes: summaryListClass,
      text: 'Response from',
    });
    expect(responseContent[1][0].value).toEqual({ text: Applicant.RESPONDENT });
    expect(responseContent[1][1].key).toEqual({
      classes: summaryListClass,
      text: 'Response date',
    });
    expect(responseContent[1][1].value).toEqual({ text: '10 May 2019' });
    expect(responseContent[1][2].key).toEqual({
      classes: summaryListClass,
      text: 'What is your response to the tribunal?',
    });
    expect(responseContent[1][2].value).toEqual({ text: 'Some respondent response text' });
    expect(responseContent[1][3].key).toEqual({
      classes: summaryListClass,
      text: 'Supporting material',
    });
    expect(responseContent[1][3].value).toEqual({ text: undefined });
    expect(responseContent[1][4].key).toEqual({
      classes: summaryListClass,
      text: 'Do you want to copy this correspondence to the other party to satisfy the Rules of Procedure?',
    });
    expect(responseContent[1][4].value).toEqual({ text: YesOrNo.YES });
    expect(responseContent[2][0].key).toEqual({
      classes: summaryListClass,
      text: 'Response',
    });
    expect(responseContent[2][0].value).toEqual({ text: 'tribunal response title text' });
    expect(responseContent[2][1].key).toEqual({
      classes: summaryListClass,
      text: 'Date sent',
    });
    expect(responseContent[2][1].value).toEqual({ text: '3 May 2019' });
    expect(responseContent[2][2].key).toEqual({
      classes: summaryListClass,
      text: 'Sent by',
    });
    expect(responseContent[2][2].value).toEqual({ text: Rule92Types.TRIBUNAL });
    expect(responseContent[2][3].key).toEqual({
      classes: summaryListClass,
      text: 'Case management order or request?',
    });
    expect(responseContent[2][3].value).toEqual({ text: 'Case management order' });
    expect(responseContent[2][4].key).toEqual({
      classes: summaryListClass,
      text: 'Response due',
    });
    expect(responseContent[2][4].value).toEqual({ text: ResponseRequired.YES });
    expect(responseContent[2][5].key).toEqual({
      classes: summaryListClass,
      text: 'Party or parties to respond',
    });
    expect(responseContent[2][5].value).toEqual({ text: Parties.BOTH_PARTIES });
    expect(responseContent[2][6].key).toEqual({
      classes: summaryListClass,
      text: 'Additional information',
    });
    expect(responseContent[2][6].value).toEqual({ text: 'additional info' });
    expect(responseContent[2][7].key).toEqual({
      classes: summaryListClass,
      text: 'Description',
    });
    expect(responseContent[2][7].value).toEqual({ text: undefined });
    expect(responseContent[2][8].key).toEqual({
      classes: summaryListClass,
      text: 'Document',
    });
    expect(responseContent[2][8].value).toEqual({ text: undefined });
    expect(responseContent[2][9].key).toEqual({
      classes: summaryListClass,
      text: 'Request made by',
    });
    expect(responseContent[2][9].value).toEqual({ text: 'Legal officer' });
    expect(responseContent[2][10].key).toEqual({
      classes: summaryListClass,
      text: 'Name',
    });
    expect(responseContent[2][10].value).toEqual({ text: 'Judge Dredd' });
    expect(responseContent[2][11].key).toEqual({
      classes: summaryListClass,
      text: 'Sent to',
    });
    expect(responseContent[2][11].value).toEqual({ text: Parties.BOTH_PARTIES });
  });

  it('should display the correct banner content for claimant response to tribunal request', () => {
    const result = getClaimantTribunalResponseBannerContent(
      [notificationItemWithResponses],
      languages.ENGLISH_URL_PARAMETER
    );

    expect(result).toEqual([
      {
        copyToOtherParty: YesOrNo.YES,
        redirectUrl: '/tribunal-order-or-request-details/6423be5b-0b82-462a-af1d-5f1df39686ab?lng=en',
      },
    ]);
  });

  it('should not display a claimant response notification banner if the claimant responses have been viewed', () => {
    const result = getClaimantTribunalResponseBannerContent(
      [mockNotificationWithViewedResponses],
      languages.ENGLISH_URL_PARAMETER
    );
    expect(result).toEqual([]);
  });

  it('should not display a claimant response notification banner if there are no claimant responses', () => {
    const result = getClaimantTribunalResponseBannerContent(
      [mockNotificationItemOther],
      languages.ENGLISH_URL_PARAMETER
    );
    expect(result).toEqual([]);
  });

  it('should return expected tribunal request details content', () => {
    notificationItem.value.sendNotificationCaseManagement = 'Request';
    notificationItem.value.sendNotificationRequestMadeBy = 'Legal officer';
    notificationItem.value.sendNotificationWhoCaseOrder = undefined;
    const pageContent = getTribunalOrderOrRequestDetails(translations, notificationItem, req.url);

    expect(pageContent[3].key).toEqual({
      classes: summaryListClass,
      text: 'Case management order or request?',
    });
    expect(pageContent[3].value).toEqual({ text: 'Request' });

    expect(pageContent[9].key).toEqual({
      classes: summaryListClass,
      text: 'Request made by',
    });
    expect(pageContent[9].value).toEqual({ text: 'Legal officer' });
  });

  it('should filter only orders, requests or Other (General correspondence)', () => {
    const notificationWithoutOrderOrRequest = {
      value: {
        sendNotificationCaseManagement: undefined,
      } as SendNotificationType,
    } as SendNotificationTypeItem;

    const filteredNotifications = filterSendNotifications([
      notificationWithoutOrderOrRequest,
      notificationItem,
      notificationItemOther,
    ]);
    expect(filteredNotifications).toHaveLength(2);
    expect(filteredNotifications[0].value.sendNotificationSubjectString).toStrictEqual(
      NotificationSubjects.ORDER_OR_REQUEST
    );
    expect(filteredNotifications[1].value.sendNotificationSubjectString).toStrictEqual(
      NotificationSubjects.GENERAL_CORRESPONDENCE
    );
  });

  it('should filter only ECC notifications', async () => {
    const eccNotifications = await filterECCNotifications([
      notificationItem,
      notificationItemOther,
      mockECCNotification,
    ]);

    expect(eccNotifications).toHaveLength(1);
    expect(eccNotifications[0].value.sendNotificationSubjectString).toStrictEqual(NotificationSubjects.ECC);
  });

  it('should return empty array when no ECC notifications', async () => {
    mockLdClient.mockResolvedValue(false);
    const eccNotifications = await filterECCNotifications([notificationItem, notificationItemOther]);

    expect(eccNotifications).toHaveLength(0);
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

  it('should populate order/request item with redirect link and status', () => {
    const populatedOrderOrRequest = populateAllOrdersItemsWithCorrectStatusTranslations(
      [notificationItem],
      translations,
      'url'
    )[0];
    expect(populatedOrderOrRequest.redirectUrl).toEqual(
      '/tribunal-order-or-request-details/2c6ae9f6-66cd-4a6b-86fa-0eabcb64bf28?lng=en'
    );
    expect(populatedOrderOrRequest.displayStatus).toEqual('Not viewed yet');
  });

  it('should keep order/request item with response with redirect link', () => {
    const pseResponse = {
      id: '0173ccd0-e20c-41bf-9a1c-37e97c728efc',
      value: {
        from: 'Claimant',
      },
    } as PseResponseType;

    const item = {
      id: '2c6ae9f6-66cd-4a6b-86fa-0eabcb64bf28',
      value: {
        respondCollection: [pseResponse],
      },
      redirectUrl: 'original-url',
    } as SendNotificationTypeItem;

    const items = [item];

    updateStoredRedirectUrl(items, 'url');

    expect(items[0].redirectUrl).toEqual('original-url');
  });

  it('should update order/request item with stored response with redirect link', () => {
    const pseResponse = {
      id: '0173ccd0-e20c-41bf-9a1c-37e97c728efc',
      value: {
        from: 'Claimant',
      },
    } as PseResponseType;

    const item = {
      id: '2c6ae9f6-66cd-4a6b-86fa-0eabcb64bf28',
      value: {
        respondStoredCollection: [pseResponse],
      },
      redirectUrl: 'original-url',
    } as SendNotificationTypeItem;

    const items = [item];

    updateStoredRedirectUrl(items, 'url');

    expect(items[0].redirectUrl).toEqual(
      '/stored-to-submit-tribunal/2c6ae9f6-66cd-4a6b-86fa-0eabcb64bf28/0173ccd0-e20c-41bf-9a1c-37e97c728efc?lng=en'
    );
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

  it('should populate correct status when viewed general correspondence', () => {
    mockNotificationViewed.value.sendNotificationSubjectString = NotificationSubjects.GENERAL_CORRESPONDENCE;
    const populatedNotification = populateNotificationsWithRedirectLinksAndStatusColors(
      [mockNotificationViewed],
      'url',
      translations
    )[0];
    expect(populatedNotification.redirectUrl).toEqual(
      '/general-correspondence-notification-details/2c6ae9f6-66cd-4a6b-86fa-0eabcb64bf28?lng=en'
    );
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

  it('should activate tribunal orders and requests section with not-viewed status', async () => {
    const userCase = { ...mockUserCaseWithCitizenHubLinks };
    const notificationWithOrder = {
      value: {
        sendNotificationCaseManagement: 'Order',
        sendNotificationSelectParties: Parties.RESPONDENT_ONLY,
        sendNotificationResponseTribunal: ResponseRequired.YES,
        sendNotificationSubjectString: NotificationSubjects.ORDER_OR_REQUEST,
      } as SendNotificationType,
    } as SendNotificationTypeItem;

    await activateTribunalOrdersAndRequestsLink([notificationWithOrder], userCase);
    expect(userCase.hubLinksStatuses[HubLinkNames.TribunalOrders]).toStrictEqual(HubLinkStatus.NOT_VIEWED);
  });

  it('should activate tribunal orders and requests section with not-viewed status for ECC', async () => {
    const userCase = { ...mockUserCaseWithCitizenHubLinks };
    const notificationWithOrder = {
      value: {
        sendNotificationCaseManagement: 'Order',
        sendNotificationSelectParties: Parties.RESPONDENT_ONLY,
        sendNotificationResponseTribunal: ResponseRequired.YES,
        sendNotificationSubjectString: NotificationSubjects.ECC,
      } as SendNotificationType,
    } as SendNotificationTypeItem;

    await activateTribunalOrdersAndRequestsLink([notificationWithOrder], userCase);
    expect(userCase.hubLinksStatuses[HubLinkNames.TribunalOrders]).toStrictEqual(HubLinkStatus.NOT_VIEWED);
  });

  it('should activate tribunal orders and requests section with not-started status', async () => {
    const userCase = { ...mockUserCaseWithCitizenHubLinks };
    const notificationWithOrder = {
      value: {
        sendNotificationCaseManagement: 'Order',
        sendNotificationSelectParties: Parties.CLAIMANT_ONLY,
        sendNotificationResponseTribunal: ResponseRequired.YES,
        sendNotificationSubjectString: NotificationSubjects.ORDER_OR_REQUEST,
      } as SendNotificationType,
    } as SendNotificationTypeItem;

    await activateTribunalOrdersAndRequestsLink([notificationWithOrder], userCase);
    expect(userCase.hubLinksStatuses[HubLinkNames.TribunalOrders]).toStrictEqual(HubLinkStatus.NOT_STARTED_YET);
  });

  it('tribunal orders and requests section should be not started when a response is required', async () => {
    const userCase = { ...mockUserCaseWithCitizenHubLinks };
    const notificationWithOrder = {
      value: {
        sendNotificationCaseManagement: 'Order',
        sendNotificationSelectParties: Parties.CLAIMANT_ONLY,
        sendNotificationResponseTribunal: ResponseRequired.YES,
        sendNotificationSubjectString: NotificationSubjects.ORDER_OR_REQUEST,
      } as SendNotificationType,
    } as SendNotificationTypeItem;

    await activateTribunalOrdersAndRequestsLink([notificationWithOrder], userCase);
    expect(userCase.hubLinksStatuses[HubLinkNames.TribunalOrders]).toStrictEqual(HubLinkStatus.NOT_STARTED_YET);
  });

  it('tribunal orders and requests section should be not viewed when not viewed and a response is not required', async () => {
    const userCase = { ...mockUserCaseWithCitizenHubLinks };
    const notificationWithOrder = {
      value: {
        sendNotificationCaseManagement: 'Order',
        sendNotificationSelectParties: Parties.RESPONDENT_ONLY,
        sendNotificationResponseTribunal: ResponseRequired.YES,
        sendNotificationSubjectString: NotificationSubjects.ORDER_OR_REQUEST,
      } as SendNotificationType,
    } as SendNotificationTypeItem;

    await activateTribunalOrdersAndRequestsLink([notificationWithOrder], userCase);
    expect(userCase.hubLinksStatuses[HubLinkNames.TribunalOrders]).toStrictEqual(HubLinkStatus.NOT_VIEWED);
  });

  it('tribunal orders and requests section should be viewed when viewed and a response is not required', async () => {
    const userCase = { ...mockUserCaseWithCitizenHubLinks };
    const notificationWithOrder = {
      value: {
        sendNotificationCaseManagement: 'Order',
        sendNotificationSelectParties: Parties.RESPONDENT_ONLY,
        sendNotificationResponseTribunal: ResponseRequired.YES,
        sendNotificationSubjectString: NotificationSubjects.ORDER_OR_REQUEST,
        notificationState: 'viewed',
      } as SendNotificationType,
    } as SendNotificationTypeItem;

    await activateTribunalOrdersAndRequestsLink([notificationWithOrder], userCase);
    expect(userCase.hubLinksStatuses[HubLinkNames.TribunalOrders]).toStrictEqual(HubLinkStatus.VIEWED);
  });

  it('tribunal orders and requests section should be submitted when response is required and has been sent', async () => {
    const userCase = { ...mockUserCaseWithCitizenHubLinks };
    const notificationSubmitted = {
      value: {
        sendNotificationCaseManagement: 'Order',
        sendNotificationSelectParties: Parties.CLAIMANT_ONLY,
        sendNotificationResponseTribunal: ResponseRequired.YES,
        sendNotificationSubjectString: NotificationSubjects.ORDER_OR_REQUEST,
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
    await activateTribunalOrdersAndRequestsLink([notificationSubmitted], userCase);
    expect(userCase.hubLinksStatuses[HubLinkNames.TribunalOrders]).toStrictEqual(HubLinkStatus.SUBMITTED);
  });

  it('tribunal orders and requests section should be not started when a response is required for any notification', async () => {
    const userCase = { ...mockUserCaseWithCitizenHubLinks };
    const notificationWithOrder = {
      value: {
        sendNotificationCaseManagement: 'Order',
        sendNotificationSelectParties: Parties.CLAIMANT_ONLY,
        sendNotificationResponseTribunal: ResponseRequired.YES,
        sendNotificationSubjectString: NotificationSubjects.ORDER_OR_REQUEST,
      } as SendNotificationType,
    } as SendNotificationTypeItem;
    const notificationNoResponseRequired = {
      value: {
        sendNotificationCaseManagement: 'Order',
        notificationState: 'viewed',
        sendNotificationNotify: Parties.BOTH_PARTIES,
        sendNotificationResponseTribunal: 'No',
        sendNotificationSubjectString: NotificationSubjects.ORDER_OR_REQUEST,
      } as SendNotificationType,
    } as SendNotificationTypeItem;

    await activateTribunalOrdersAndRequestsLink([notificationWithOrder, notificationNoResponseRequired], userCase);
    expect(userCase.hubLinksStatuses[HubLinkNames.TribunalOrders]).toStrictEqual(HubLinkStatus.NOT_STARTED_YET);
  });

  it('should be not viewed when any remain not viewed and a response not required for any notification', async () => {
    const userCase = { ...mockUserCaseWithCitizenHubLinks };
    const notificationSubmitted = {
      value: {
        sendNotificationCaseManagement: 'Order',
        sendNotificationSelectParties: Parties.CLAIMANT_ONLY,
        sendNotificationResponseTribunal: ResponseRequired.YES,
        sendNotificationSubjectString: NotificationSubjects.ORDER_OR_REQUEST,
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
        sendNotificationNotify: Parties.BOTH_PARTIES,
        sendNotificationResponseTribunal: 'No',
        sendNotificationSubjectString: NotificationSubjects.ORDER_OR_REQUEST,
      } as SendNotificationType,
    } as SendNotificationTypeItem;

    await activateTribunalOrdersAndRequestsLink([notificationSubmitted, notificationNoResponseRequired], userCase);
    expect(userCase.hubLinksStatuses[HubLinkNames.TribunalOrders]).toStrictEqual(HubLinkStatus.NOT_VIEWED);
  });

  it('tribunal orders and requests section should be submitted when all notifications are viewed or submitted', async () => {
    const userCase = { ...mockUserCaseWithCitizenHubLinks };
    const notificationSubmitted = {
      value: {
        sendNotificationCaseManagement: 'Order',
        sendNotificationSelectParties: Parties.CLAIMANT_ONLY,
        sendNotificationResponseTribunal: ResponseRequired.YES,
        sendNotificationSubjectString: NotificationSubjects.ORDER_OR_REQUEST,
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
        sendNotificationNotify: Parties.BOTH_PARTIES,
        sendNotificationResponseTribunal: 'No',
        sendNotificationSubjectString: NotificationSubjects.ORDER_OR_REQUEST,
      } as SendNotificationType,
    } as SendNotificationTypeItem;

    await activateTribunalOrdersAndRequestsLink([notificationSubmitted, notificationNoResponseRequired], userCase);
    expect(userCase.hubLinksStatuses[HubLinkNames.TribunalOrders]).toStrictEqual(HubLinkStatus.SUBMITTED);
  });

  it('should be viewed when all notifications are viewed and they did not require a response', async () => {
    const userCase = { ...mockUserCaseWithCitizenHubLinks };

    const notification = {
      value: {
        sendNotificationCaseManagement: 'Order',
        notificationState: 'viewed',
        sendNotificationNotify: Parties.BOTH_PARTIES,
        sendNotificationResponseTribunal: 'No',
        sendNotificationSubjectString: NotificationSubjects.ORDER_OR_REQUEST,
      } as SendNotificationType,
    } as SendNotificationTypeItem;
    const notificationNoResponseRequired = {
      value: {
        sendNotificationCaseManagement: 'Order',
        notificationState: 'viewed',
        sendNotificationNotify: Parties.BOTH_PARTIES,
        sendNotificationResponseTribunal: 'No',
        sendNotificationSubjectString: NotificationSubjects.ORDER_OR_REQUEST,
      } as SendNotificationType,
    } as SendNotificationTypeItem;

    await activateTribunalOrdersAndRequestsLink([notification, notificationNoResponseRequired], userCase);
    expect(userCase.hubLinksStatuses[HubLinkNames.TribunalOrders]).toStrictEqual(HubLinkStatus.VIEWED);
  });

  it('tribunal orders and requests section should remain as not yet available when order / request notifications do not exist', async () => {
    const userCase = { ...mockUserCaseWithCitizenHubLinks };
    userCase.hubLinksStatuses[HubLinkNames.TribunalOrders] = HubLinkStatus.NOT_YET_AVAILABLE;

    await activateTribunalOrdersAndRequestsLink([], userCase);
    expect(userCase.hubLinksStatuses[HubLinkNames.TribunalOrders]).toStrictEqual(HubLinkStatus.NOT_YET_AVAILABLE);
  });

  it('tribunal orders and requests section should remain as not yet available request when no response required', async () => {
    const userCase = { ...mockUserCaseWithCitizenHubLinks };

    const notification = {
      value: {
        sendNotificationCaseManagement: 'Order',
        notificationState: 'viewed',
        sendNotificationNotify: Parties.RESPONDENT_ONLY,
        sendNotificationResponseTribunal: 'No',
        sendNotificationSubjectString: NotificationSubjects.ORDER_OR_REQUEST,
      } as SendNotificationType,
    } as SendNotificationTypeItem;
    const notificationNoResponseRequired = {
      value: {
        sendNotificationCaseManagement: 'Order',
        notificationState: 'viewed',
        sendNotificationNotify: Parties.RESPONDENT_ONLY,
        sendNotificationResponseTribunal: 'No',
        sendNotificationSubjectString: NotificationSubjects.ORDER_OR_REQUEST,
      } as SendNotificationType,
    } as SendNotificationTypeItem;
    userCase.hubLinksStatuses[HubLinkNames.TribunalOrders] = HubLinkStatus.NOT_YET_AVAILABLE;

    await activateTribunalOrdersAndRequestsLink([notification, notificationNoResponseRequired], userCase);
    expect(userCase.hubLinksStatuses[HubLinkNames.TribunalOrders]).toStrictEqual(HubLinkStatus.NOT_YET_AVAILABLE);
  });

  describe('filterActionableNotifications', () => {
    const makeUnviewedNotification = (): SendNotificationType => {
      return { ...selectedRequestOrOrder.value, notificationState: undefined };
    };

    test('should show unviewed notification', async () => {
      const notification: SendNotificationTypeItem = { id: '1', value: makeUnviewedNotification() };

      const actual = filterActionableNotifications([notification]);
      expect(actual).toHaveLength(1);

      setNotificationBannerData(notification);
      expect(notification.showAlert).toBeTruthy();
      expect(notification.needsResponse).toBeFalsy();
    });

    test('should not show viewed notification', async () => {
      const notification: SendNotificationTypeItem = {
        id: '1',
        value: { ...makeUnviewedNotification(), notificationState: HubLinkStatus.VIEWED },
      };

      const actual = filterActionableNotifications([notification]);
      expect(actual).toHaveLength(0);

      setNotificationBannerData(notification);
      expect(notification.showAlert).toBeFalsy();
      expect(notification.needsResponse).toBeFalsy();
    });

    test('should not show notification to responent only', async () => {
      const notification: SendNotificationTypeItem = {
        id: '1',
        value: {
          ...makeUnviewedNotification(),
          sendNotificationNotify: Parties.RESPONDENT_ONLY,
        },
      };

      const actual = filterActionableNotifications([notification]);
      expect(actual).toHaveLength(0);

      setNotificationBannerData(notification);
      expect(notification.showAlert).toBeFalsy();
      expect(notification.needsResponse).toBeFalsy();
    });

    test('should not show viewed notification with respondent only tribunal response', async () => {
      const notification: SendNotificationTypeItem = {
        id: '1',
        value: {
          ...makeUnviewedNotification(),
          notificationState: HubLinkStatus.VIEWED,
          sendNotificationNotify: Parties.BOTH_PARTIES,
          respondNotificationTypeCollection: [
            {
              id: '1',
              value: {
                ...getOrderOrRequestTribunalResponse(),
                respondNotificationPartyToNotify: Parties.RESPONDENT_ONLY,
              },
            },
          ],
        },
      };

      const actual = filterActionableNotifications([notification]);
      expect(actual).toHaveLength(0);

      setNotificationBannerData(notification);
      expect(notification.showAlert).toBeFalsy();
      expect(notification.needsResponse).toBeFalsy();
    });

    test('should show viewed notification that requires a claimant response and has none', async () => {
      const notification: SendNotificationTypeItem = {
        id: '1',
        value: {
          ...makeUnviewedNotification(),
          notificationState: HubLinkStatus.VIEWED,
          sendNotificationResponseTribunal: ResponseRequired.YES,
        },
      };

      const actual = filterActionableNotifications([notification]);
      expect(actual).toHaveLength(1);

      setNotificationBannerData(notification);
      expect(notification.showAlert).toBeTruthy();
      expect(notification.needsResponse).toBeTruthy();
    });

    test('should not show viewed notification that requires a claimant response and has one', async () => {
      const notification: SendNotificationTypeItem = {
        id: '1',
        value: {
          ...makeUnviewedNotification(),
          notificationState: HubLinkStatus.VIEWED,
          sendNotificationResponseTribunal: ResponseRequired.YES,
          respondCollection: [{ id: '1', value: { from: Applicant.CLAIMANT } }],
        },
      };

      const actual = filterActionableNotifications([notification]);
      expect(actual).toHaveLength(0);

      setNotificationBannerData(notification);
      expect(notification.showAlert).toBeFalsy();
      expect(notification.needsResponse).toBeFalsy();
    });

    test('should show viewed notification with an unviewed tribunal response', () => {
      const notification: SendNotificationTypeItem = {
        id: '1',
        value: {
          ...makeUnviewedNotification(),
          notificationState: HubLinkStatus.VIEWED,
          respondNotificationTypeCollection: [{ id: '1', value: getOrderOrRequestTribunalResponse() }],
        },
      };

      const actual = filterActionableNotifications([notification]);
      expect(actual).toHaveLength(1);

      setNotificationBannerData(notification);
      expect(notification.showAlert).toBeTruthy();
      expect(notification.needsResponse).toBeTruthy();
    });

    test('should show viewed notification when response requires a response from claimant and has none', () => {
      const notification: SendNotificationTypeItem = {
        id: '1',
        value: {
          ...makeUnviewedNotification(),
          notificationState: HubLinkStatus.VIEWED,
          respondNotificationTypeCollection: [
            { id: '1', value: { ...getOrderOrRequestTribunalResponse(), isClaimantResponseDue: ResponseRequired.YES } },
          ],
        },
      };

      const actual = filterActionableNotifications([notification]);
      expect(actual).toHaveLength(1);

      setNotificationBannerData(notification);
      expect(notification.showAlert).toBeTruthy();
      expect(notification.needsResponse).toBeTruthy();
    });

    test('should not show viewed notification when claimant has responded', () => {
      const notification: SendNotificationTypeItem = {
        id: '1',
        value: {
          ...makeUnviewedNotification(),
          notificationState: HubLinkStatus.VIEWED,
          respondNotificationTypeCollection: [
            {
              id: '1',
              value: {
                ...getOrderOrRequestTribunalResponse(),
                state: HubLinkStatus.VIEWED,
                isClaimantResponseDue: undefined,
              },
            },
          ],
        },
      };

      const actual = filterActionableNotifications([notification]);
      expect(actual).toHaveLength(0);

      setNotificationBannerData(notification);
      expect(notification.showAlert).toBeFalsy();
    });
  });
});
