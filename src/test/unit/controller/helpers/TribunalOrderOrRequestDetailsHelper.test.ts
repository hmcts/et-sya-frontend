import {
  activateTribunalOrdersAndRequestsLink,
  filterOutSpecialNotifications,
  getClaimantTribunalResponseBannerContent,
  getNotificationResponses,
  getTribunalOrderOrRequestDetails,
  setNotificationBannerData,
} from '../../../../main/controllers/helpers/TribunalOrderOrRequestDetailsHelper';
import { YesOrNo } from '../../../../main/definitions/case';
import {
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
import respondentOrderOrRequestRaw from '../../../../main/resources/locales/en/translation/notification-details.json';
import notificationSubjectsRaw from '../../../../main/resources/locales/en/translation/notification-subjects.json';
import mockUserCaseWithCitizenHubLinks from '../../../../main/resources/mocks/mockUserCaseWithCitizenHubLinks';
import {
  mockNotificationItem,
  mockNotificationItemOther,
  mockNotificationRespondOnlyReq,
  mockNotificationSubmitted,
  mockNotificationViewed,
  mockNotificationWithResponses,
  mockNotificationWithViewedResponses,
  notificationWithResponses,
} from '../../mocks/mockNotificationItem';
import { mockRequestWithTranslation } from '../../mocks/mockRequest';
import { mockTribunalResponse } from '../../mocks/mockTribunalResponse';
import { getOrderOrRequestTribunalResponse, selectedRequestOrOrder } from '../../mocks/mockUserCaseComplete';

describe('Tribunal order or request Details helper', () => {
  const translationJsons = {
    ...respondentOrderOrRequestRaw,
    ...notificationSubjectsRaw,
    ...citizenHubRaw,
    ...commonRaw,
  };
  const req = mockRequestWithTranslation({}, translationJsons);
  const notificationItem = mockNotificationItem;
  const notificationItemWithResponses = mockNotificationWithResponses;
  const mockLdClient = jest.spyOn(LaunchDarkly, 'getFlagValue');
  mockLdClient.mockResolvedValue(true);
  const summaryListClass = 'govuk-!-font-weight-regular-m';

  const translations: AnyRecord = {
    ...req.t(TranslationKeys.NOTIFICATION_DETAILS, { returnObjects: true }),
    ...req.t(TranslationKeys.NOTIFICATION_SUBJECTS, { returnObjects: true }),
    ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
    ...req.t(TranslationKeys.CITIZEN_HUB, { returnObjects: true }),
  };

  it('should return expected tribunal order details content', async () => {
    const pageContent = getTribunalOrderOrRequestDetails(translations, notificationItemWithResponses, req.url);
    const responseContent = await getNotificationResponses(notificationWithResponses, translations, req);
    expect(pageContent[0].key).toEqual({ classes: summaryListClass, text: 'Hearing' });
    expect(pageContent[0].value).toEqual({ text: 'Hearing' });
    expect(pageContent[1].key).toEqual({ classes: summaryListClass, text: 'Notification Subject' });
    expect(pageContent[1].value).toEqual({ text: 'Case management orders / requests' });
    expect(pageContent[2].key).toEqual({ classes: summaryListClass, text: 'Date sent' });
    expect(pageContent[2].value).toEqual({ text: '2 May 2019' });
    expect(pageContent[3].key).toEqual({ classes: summaryListClass, text: 'Sent by' });
    expect(pageContent[3].value).toEqual({ text: 'Tribunal' });
    expect(pageContent[4].key).toEqual({
      classes: summaryListClass,
      text: 'Case management order or request?',
    });
    expect(pageContent[4].value).toEqual({ text: 'Case management order' });
    expect(pageContent[5].key).toEqual({
      classes: summaryListClass,
      text: 'Response due',
    });
    expect(pageContent[5].value).toEqual({ text: YesOrNo.YES });
    expect(pageContent[6].key).toEqual({
      classes: summaryListClass,
      text: 'Party or parties to respond',
    });
    expect(pageContent[6].value).toEqual({ text: Parties.BOTH_PARTIES });
    expect(pageContent[7].key).toEqual({
      classes: summaryListClass,
      text: 'Additional information',
    });
    expect(pageContent[7].value).toEqual({ text: 'Additional info' });
    expect(pageContent[8].key).toEqual({
      classes: summaryListClass,
      text: 'Description',
    });
    expect(pageContent[8].value).toEqual({ text: 'Short description' });
    expect(pageContent[9].key).toEqual({
      classes: summaryListClass,
      text: 'Document',
    });
    expect(pageContent[9].value).toEqual({
      html: "<a href='/getSupportingMaterial/uuid' target='_blank' class='govuk-link'>test.pdf (pdf, 1000Bytes)</a>",
    });
    expect(pageContent[10].key).toEqual({
      classes: summaryListClass,
      text: 'Case management order made by',
    });
    expect(pageContent[10].value).toEqual({ text: 'Judge' });
    expect(pageContent[11].key).toEqual({
      classes: summaryListClass,
      text: 'Name',
    });
    expect(pageContent[11].value).toEqual({ text: 'Bob' });
    expect(pageContent[12].key).toEqual({
      classes: summaryListClass,
      text: 'Sent to',
    });
    expect(pageContent[12].value).toEqual({ text: Parties.BOTH_PARTIES });

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
      text: 'Response',
    });
    expect(responseContent[1][0].value).toEqual({ text: 'tribunal response title text' });
    expect(responseContent[1][1].key).toEqual({
      classes: summaryListClass,
      text: 'Date sent',
    });
    expect(responseContent[1][1].value).toEqual({ text: '3 May 2019' });
    expect(responseContent[1][2].key).toEqual({
      classes: summaryListClass,
      text: 'Sent by',
    });
    expect(responseContent[1][2].value).toEqual({ text: Rule92Types.TRIBUNAL });
    expect(responseContent[1][3].key).toEqual({
      classes: summaryListClass,
      text: 'Case management order or request?',
    });
    expect(responseContent[1][3].value).toEqual({ text: 'Case management order' });
    expect(responseContent[1][4].key).toEqual({
      classes: summaryListClass,
      text: 'Response due',
    });
    expect(responseContent[1][4].value).toEqual({ text: ResponseRequired.YES });
    expect(responseContent[1][5].key).toEqual({
      classes: summaryListClass,
      text: 'Party or parties to respond',
    });
    expect(responseContent[1][5].value).toEqual({ text: Parties.BOTH_PARTIES });
    expect(responseContent[1][6].key).toEqual({
      classes: summaryListClass,
      text: 'Additional information',
    });
    expect(responseContent[1][6].value).toEqual({ text: 'additional info' });
    expect(responseContent[1][7].key).toEqual({
      classes: summaryListClass,
      text: 'Description',
    });
    expect(responseContent[1][7].value).toEqual({ text: undefined });
    expect(responseContent[1][8].key).toEqual({
      classes: summaryListClass,
      text: 'Document',
    });
    expect(responseContent[1][8].value).toEqual({ text: undefined });
    expect(responseContent[1][9].key).toEqual({
      classes: summaryListClass,
      text: 'Request made by',
    });
    expect(responseContent[1][9].value).toEqual({ text: 'Legal officer' });
    expect(responseContent[1][10].key).toEqual({
      classes: summaryListClass,
      text: 'Name',
    });
    expect(responseContent[1][10].value).toEqual({ text: 'Judge Dredd' });
    expect(responseContent[1][11].key).toEqual({
      classes: summaryListClass,
      text: 'Sent to',
    });
    expect(responseContent[1][11].value).toEqual({ text: Parties.BOTH_PARTIES });

    expect(responseContent[2][0].key).toEqual({
      classes: summaryListClass,
      text: 'Response from',
    });
    expect(responseContent[2][0].value).toEqual({ text: Applicant.RESPONDENT });
    expect(responseContent[2][1].key).toEqual({
      classes: summaryListClass,
      text: 'Response date',
    });
    expect(responseContent[2][1].value).toEqual({ text: '10 May 2019' });
    expect(responseContent[2][2].key).toEqual({
      classes: summaryListClass,
      text: 'What is your response to the tribunal?',
    });
    expect(responseContent[2][2].value).toEqual({ text: 'Some respondent response text' });
    expect(responseContent[2][3].key).toEqual({
      classes: summaryListClass,
      text: 'Supporting material',
    });
    expect(responseContent[2][3].value).toEqual({ text: undefined });
    expect(responseContent[2][4].key).toEqual({
      classes: summaryListClass,
      text: 'Do you want to copy this correspondence to the other party to satisfy the Rules of Procedure?',
    });
    expect(responseContent[2][4].value).toEqual({ text: YesOrNo.YES });
  });

  it('should return expected tribunal request details content', () => {
    notificationItem.value.sendNotificationCaseManagement = 'Request';
    notificationItem.value.sendNotificationRequestMadeBy = 'Legal officer';
    notificationItem.value.sendNotificationWhoCaseOrder = undefined;
    const pageContent = getTribunalOrderOrRequestDetails(translations, notificationItem, req.url);

    expect(pageContent[4].key).toEqual({
      classes: summaryListClass,
      text: 'Case management order or request?',
    });
    expect(pageContent[4].value).toEqual({ text: 'Request' });

    expect(pageContent[10].key).toEqual({
      classes: summaryListClass,
      text: 'Request made by',
    });
    expect(pageContent[10].value).toEqual({ text: 'Legal officer' });
  });

  describe('getClaimantTribunalResponseBannerContent', () => {
    it('should display the correct banner content for claimant response to tribunal request', () => {
      const result = getClaimantTribunalResponseBannerContent(
        [notificationItemWithResponses],
        languages.ENGLISH_URL_PARAMETER
      );

      expect(result).toEqual([
        {
          copyToOtherParty: YesOrNo.YES,
          redirectUrl: '/notification-details/6423be5b-0b82-462a-af1d-5f1df39686ab?lng=en',
          sendNotificationSubject: [NotificationSubjects.ORDER_OR_REQUEST],
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
  });

  describe('setNotificationBannerData - populate', () => {
    it('should populate notification with correct status when not required to respond', () => {
      const populatedNotification = setNotificationBannerData([mockNotificationRespondOnlyReq], 'url')[0];
      expect(populatedNotification.showAlert).toEqual(true);
      expect(populatedNotification.needsResponse).toEqual(false);
    });

    it('should populate correct status when viewed and not required to respond', () => {
      const populatedNotification = setNotificationBannerData([mockNotificationViewed], 'url')[0];
      expect(populatedNotification.showAlert).toEqual(false);
      expect(populatedNotification.needsResponse).toBeUndefined();
    });

    it('should populate correct status when viewed general correspondence', () => {
      mockNotificationViewed.value.sendNotificationSubjectString = NotificationSubjects.GENERAL_CORRESPONDENCE;

      const populatedNotification = setNotificationBannerData([mockNotificationViewed], 'url')[0];
      expect(populatedNotification.showAlert).toBeFalsy();
      expect(populatedNotification.needsResponse).toBeUndefined();
    });

    it('should populate correct status when required to respond and has responded', () => {
      const populatedNotification = setNotificationBannerData([mockNotificationSubmitted], 'url')[0];
      expect(populatedNotification.showAlert).toEqual(false);
      expect(populatedNotification.needsResponse).toBeUndefined();
    });

    it('should populate correct status when claimant has replied and tribunal responds', () => {
      mockNotificationSubmitted.value.sendNotificationSelectParties = 'Claimant only';
      mockNotificationSubmitted.value.respondNotificationTypeCollection = [mockTribunalResponse];
      const populatedNotification = setNotificationBannerData([mockNotificationSubmitted], 'url')[0];
      expect(populatedNotification.showAlert).toBeTruthy();
      expect(populatedNotification.needsResponse).toBeTruthy();
    });
  });

  describe('activateTribunalOrdersAndRequestsLink', () => {
    it('should activate tribunal orders and requests section with not-viewed status', async () => {
      const userCase = { ...mockUserCaseWithCitizenHubLinks };
      const notificationWithOrder = {
        value: {
          sendNotificationCaseManagement: 'Order',
          sendNotificationSelectParties: Parties.RESPONDENT_ONLY,
          sendNotificationResponseTribunal: ResponseRequired.YES,
          sendNotificationSubjectString: NotificationSubjects.ORDER_OR_REQUEST,
          notificationState: HubLinkStatus.NOT_VIEWED,
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
          notificationState: HubLinkStatus.NOT_VIEWED,
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
          notificationState: HubLinkStatus.NOT_STARTED_YET,
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
          notificationState: HubLinkStatus.NOT_STARTED_YET,
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
          notificationState: HubLinkStatus.NOT_VIEWED,
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
          notificationState: HubLinkStatus.SUBMITTED,
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
          notificationState: HubLinkStatus.NOT_STARTED_YET,
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
          notificationState: HubLinkStatus.NOT_VIEWED,
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
          notificationState: HubLinkStatus.SUBMITTED,
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
  });

  describe('setNotificationBannerData - show', () => {
    const makeUnviewedNotification = (): SendNotificationType => {
      return { ...selectedRequestOrOrder.value };
    };

    test('should show unviewed notification', async () => {
      const notification: SendNotificationTypeItem = { id: '1', value: makeUnviewedNotification() };

      setNotificationBannerData([notification], 'url');
      expect(notification.showAlert).toBeTruthy();
      expect(notification.needsResponse).toBeFalsy();
    });

    test('should not show viewed notification', async () => {
      const notification: SendNotificationTypeItem = {
        id: '1',
        value: { ...makeUnviewedNotification(), notificationState: HubLinkStatus.VIEWED },
      };

      setNotificationBannerData([notification], 'url');
      expect(notification.showAlert).toBeFalsy();
      expect(notification.needsResponse).toBeFalsy();
    });

    test('should not show notification to respondent only', async () => {
      const notification: SendNotificationTypeItem = {
        id: '1',
        value: {
          ...makeUnviewedNotification(),
          sendNotificationNotify: Parties.RESPONDENT_ONLY,
        },
      };

      setNotificationBannerData([notification], 'url');
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

      setNotificationBannerData([notification], 'url');
      expect(notification.showAlert).toBeFalsy();
      expect(notification.needsResponse).toBeFalsy();
    });

    test('should show notification that requires a claimant response and has none', async () => {
      const notification: SendNotificationTypeItem = {
        id: '1',
        value: {
          ...makeUnviewedNotification(),
          notificationState: HubLinkStatus.NOT_STARTED_YET,
          sendNotificationResponseTribunal: ResponseRequired.YES,
        },
      };

      setNotificationBannerData([notification], 'url');
      expect(notification.showAlert).toBeTruthy();
      expect(notification.needsResponse).toBeTruthy();
    });

    test('should not show notification that requires a claimant response and has one', async () => {
      const notification: SendNotificationTypeItem = {
        id: '1',
        value: {
          ...makeUnviewedNotification(),
          notificationState: HubLinkStatus.SUBMITTED,
          sendNotificationResponseTribunal: ResponseRequired.YES,
          respondCollection: [{ id: '1', value: { from: Applicant.CLAIMANT } }],
        },
      };

      setNotificationBannerData([notification], 'url');
      expect(notification.showAlert).toBeFalsy();
      expect(notification.needsResponse).toBeFalsy();
    });

    test('should show notification which requires a response from claimant and has none', () => {
      const notification: SendNotificationTypeItem = {
        id: '1',
        value: {
          ...makeUnviewedNotification(),
          notificationState: HubLinkStatus.NOT_STARTED_YET,
          respondNotificationTypeCollection: [
            { id: '1', value: { ...getOrderOrRequestTribunalResponse(), isClaimantResponseDue: YesOrNo.YES } },
          ],
        },
      };

      setNotificationBannerData([notification], 'url');
      expect(notification.showAlert).toBeTruthy();
      expect(notification.needsResponse).toBeTruthy();
    });
  });

  describe('filterOutHearingOnlyNotifications', () => {
    test('should show filtered notification', async () => {
      const notifications: SendNotificationTypeItem[] = [
        {
          id: '1',
          value: {
            date: '1 December 2023',
            sendNotificationSubjectString: 'Response (ET3)',
            sendNotificationTitle: '1 Show',
          },
        },
        {
          id: '2',
          value: {
            date: '2 December 2023',
            sendNotificationSubjectString: 'Employer Contract Claim',
            sendNotificationTitle: '2 Show',
          },
        },
        {
          id: '3',
          value: {
            date: '3 December 2023',
            sendNotificationSubjectString: 'Employer Contract Claim, Response (ET3)',
            sendNotificationTitle: '3 Show',
          },
        },
        {
          id: '4',
          value: {
            date: '4 December 2023',
            sendNotificationSubjectString: 'Hearing',
            sendNotificationTitle: '4 Do not show',
          },
        },
        {
          id: '5',
          value: {
            date: '5 December 2023',
            sendNotificationSubjectString: 'Hearing, Response (ET3)',
            sendNotificationTitle: '5 Show',
          },
        },
      ];
      const result = filterOutSpecialNotifications(notifications);
      expect(result).toHaveLength(4);
      expect(result[0].value.sendNotificationTitle).toEqual('1 Show');
      expect(result[1].value.sendNotificationTitle).toEqual('2 Show');
      expect(result[2].value.sendNotificationTitle).toEqual('3 Show');
      expect(result[3].value.sendNotificationTitle).toEqual('5 Show');
    });
  });
});
