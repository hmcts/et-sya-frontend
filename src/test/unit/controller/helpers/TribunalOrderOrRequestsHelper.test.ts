import axios, { AxiosResponse } from 'axios';

import { getSendNotifications } from '../../../../main/controllers/helpers/TribunalOrderOrRequestsHelper';
import { HubLinkStatus } from '../../../../main/definitions/hub';
import * as LaunchDarkly from '../../../../main/modules/featureFlag/launchDarkly';
import citizenHubRaw from '../../../../main/resources/locales/en/translation/citizen-hub.json';
import contactTheTribunalRaw from '../../../../main/resources/locales/en/translation/contact-the-tribunal.json';
import notificationsRaw from '../../../../main/resources/locales/en/translation/notifications.json';
import { CaseApi } from '../../../../main/services/CaseService';
import * as caseService from '../../../../main/services/CaseService';
import {
  mockECCNotification,
  mockNotificationItem,
  mockNotificationResponseReq,
} from '../../mocks/mockNotificationItem';
import { mockRequestWithTranslation } from '../../mocks/mockRequest';

describe('Tribunal Notifications Helper', () => {
  const mockLdClient = jest.spyOn(LaunchDarkly, 'getFlagValue');
  mockLdClient.mockResolvedValue(true);

  const getCaseApiClientMock = jest.spyOn(caseService, 'getCaseApi');
  const caseApi = new CaseApi(axios as jest.Mocked<typeof axios>);
  const axiosResponse: AxiosResponse = {
    data: {
      classification: 'PUBLIC',
      size: 10575,
      mimeType: 'pdf',
      originalDocumentName: 'sample.pdf',
      createdOn: '2025-08-01T14:39:32.000+00:00',
      createdBy: '7',
      lastModifiedBy: '7',
      modifiedOn: '2025-08-03T14:40:49.000+00:00',
      metadata: {
        jurisdiction: '',
        case_id: '1',
        case_type_id: '',
      },
    },
    status: 200,
    statusText: '',
    headers: undefined,
    config: undefined,
  };
  getCaseApiClientMock.mockReturnValue(caseApi);
  caseApi.getDocumentDetails = jest.fn().mockResolvedValue(axiosResponse);

  const translationJsons = {
    ...contactTheTribunalRaw,
    ...citizenHubRaw,
    ...notificationsRaw,
  };

  describe('getSendNotifications', () => {
    it('should populate notification with status and colour', async () => {
      const req = mockRequestWithTranslation({}, translationJsons);
      req.session.userCase.sendNotificationCollection = [mockNotificationItem];
      const populatedNotification = await getSendNotifications(req);
      expect(populatedNotification[0].redirectUrl).toEqual(
        '/notification-details/2c6ae9f6-66cd-4a6b-86fa-0eabcb64bf28?lng=en'
      );
      expect(populatedNotification[0].statusColor).toEqual('--red');
      expect(populatedNotification[0].displayStatus).toEqual('Not viewed yet');
    });

    it('should populate notification with correct status when required to respond and no response exists', async () => {
      const req = mockRequestWithTranslation({}, translationJsons);
      req.session.userCase.sendNotificationCollection = [mockNotificationResponseReq];
      const populatedNotification = await getSendNotifications(req);
      expect(populatedNotification[0].statusColor).toEqual('--red');
      expect(populatedNotification[0].displayStatus).toEqual('Not started yet');
    });

    it('should populate notification with stored status and link', async () => {
      const req = mockRequestWithTranslation({}, translationJsons);
      req.session.userCase.sendNotificationCollection = [mockNotificationItem];
      req.session.userCase.sendNotificationCollection[0].value.notificationState = 'stored';
      req.session.userCase.sendNotificationCollection[0].value.respondStoredCollection = [
        {
          id: '0173ccd0-e20c-41bf-9a1c-37e97c728efc',
          value: {
            from: 'Claimant',
          },
        },
      ];
      const populatedNotification = await getSendNotifications(req);
      expect(populatedNotification[0].redirectUrl).toEqual(
        '/stored-to-submit-tribunal/2c6ae9f6-66cd-4a6b-86fa-0eabcb64bf28/0173ccd0-e20c-41bf-9a1c-37e97c728efc?lng=en'
      );
      expect(populatedNotification[0].displayStatus).toEqual('Stored');
      expect(populatedNotification[0].statusColor).toEqual('--yellow');
    });

    it('should filter and show ECC notifications when eccFlag is true', async () => {
      const req = mockRequestWithTranslation({}, translationJsons);
      req.session.userCase.sendNotificationCollection = [mockECCNotification];
      mockLdClient.mockResolvedValue(true);
      const populatedNotification = await getSendNotifications(req);

      expect(populatedNotification).toHaveLength(1);
    });

    it('should populate notification with acknowledgementOfClaimLetterDetail viewed', async () => {
      const req = mockRequestWithTranslation({}, translationJsons);
      const { userCase, user } = req.session;
      user.accessToken = 'token';
      userCase.hubLinksStatuses = {
        et1ClaimForm: HubLinkStatus.SUBMITTED_AND_VIEWED,
      };
      userCase.acknowledgementOfClaimLetterDetail = [
        {
          id: 'doc1',
          description: 'Doc Ack 1',
          type: '2.7',
        },
      ];

      const result = await getSendNotifications(req);

      expect(result).toEqual([
        {
          date: '1 August 2025',
          redirectUrl: '/case-document/acknowledgement-of-claim?lng=en',
          sendNotificationTitle: 'Notice of a Claim and Notice of Hearing',
          displayStatus: 'Viewed',
          statusColor: '--green',
        },
      ]);
    });

    it('should populate notification with acknowledgementOfClaimLetterDetail not viewed', async () => {
      const req = mockRequestWithTranslation({}, translationJsons);
      const { userCase, user } = req.session;
      user.accessToken = 'token';
      userCase.hubLinksStatuses = {
        et1ClaimForm: HubLinkStatus.NOT_VIEWED,
      };
      userCase.acknowledgementOfClaimLetterDetail = [
        {
          id: 'doc1',
          description: 'Doc Ack 1',
          type: '2.7',
        },
      ];

      const result = await getSendNotifications(req);

      expect(result).toEqual([
        {
          date: '1 August 2025',
          redirectUrl: '/case-document/acknowledgement-of-claim?lng=en',
          sendNotificationTitle: 'Notice of a Claim and Notice of Hearing',
          displayStatus: 'Not viewed yet',
          statusColor: '--red',
        },
      ]);
    });

    it('should populate notification with responseAcknowledgementDocumentDetail', async () => {
      const req = mockRequestWithTranslation({}, translationJsons);
      const { userCase, user } = req.session;
      user.accessToken = 'token';
      userCase.responseAcknowledgementDocumentDetail = [
        {
          id: 'doc1',
          description: 'Doc Resp Ack 1',
          type: '2.11',
        },
      ];

      const result = await getSendNotifications(req);

      expect(result).toEqual([
        {
          date: '1 August 2025',
          redirectUrl: '/case-document/response-acknowledgement?lng=en',
          sendNotificationTitle: 'Acknowledgement of response',
          displayStatus: 'Ready to view',
          statusColor: '--blue',
        },
      ]);
    });

    it('should populate notification with responseRejectionDocumentDetail', async () => {
      const req = mockRequestWithTranslation({}, translationJsons);
      const { userCase, user } = req.session;
      user.accessToken = 'token';
      userCase.responseRejectionDocumentDetail = [
        {
          id: 'doc1',
          description: 'Doc Resp Ack 1',
          type: '2.12',
        },
      ];

      const result = await getSendNotifications(req);

      expect(result).toEqual([
        {
          date: '1 August 2025',
          redirectUrl: '/case-document/response-rejection?lng=en',
          sendNotificationTitle: 'Rejection of Response',
          displayStatus: 'Ready to view',
          statusColor: '--blue',
        },
      ]);
    });

    it('should populate page with all empty', async () => {
      const req = mockRequestWithTranslation({}, translationJsons);
      const result = await getSendNotifications(req);
      expect(result).toEqual([]);
    });
  });
});
