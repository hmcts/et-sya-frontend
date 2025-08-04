import { getSendNotifications } from '../../../../main/controllers/helpers/TribunalOrderOrRequestsHelper';
import * as LaunchDarkly from '../../../../main/modules/featureFlag/launchDarkly';
import citizenHubRaw from '../../../../main/resources/locales/en/translation/citizen-hub.json';
import commonRaw from '../../../../main/resources/locales/en/translation/common.json';
import respondentOrderOrRequestRaw from '../../../../main/resources/locales/en/translation/notification-details.json';
import notificationSubjectsRaw from '../../../../main/resources/locales/en/translation/notification-subjects.json';
import {
  mockECCNotification,
  mockNotificationItem,
  mockNotificationResponseReq,
} from '../../mocks/mockNotificationItem';
import { mockRequestWithTranslation } from '../../mocks/mockRequest';

describe('Tribunal Notifications Helper', () => {
  const mockLdClient = jest.spyOn(LaunchDarkly, 'getFlagValue');
  mockLdClient.mockResolvedValue(true);
  const translationJsons = {
    ...respondentOrderOrRequestRaw,
    ...notificationSubjectsRaw,
    ...citizenHubRaw,
    ...commonRaw,
  };

  describe('getSendNotifications', () => {
    it('should populate notification with status and color', async () => {
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
  });
});
