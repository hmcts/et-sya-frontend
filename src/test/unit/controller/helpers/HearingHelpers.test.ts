import {
  getHearingCollection,
  isHearingExist,
  shouldShowHearingBanner,
} from '../../../../main/controllers/helpers/HearingHelpers';
import { SendNotificationTypeItem } from '../../../../main/definitions/complexTypes/sendNotificationTypeItem';
import { NotificationSubjects, Parties } from '../../../../main/definitions/constants';
import { HearingDetails } from '../../../../main/definitions/hearingDetails';
import { HubLinkStatus } from '../../../../main/definitions/hub';
import { AnyRecord } from '../../../../main/definitions/util-types';
import hearingDetailsTranslation from '../../../../main/resources/locales/en/translation/hearing-details.json';
import { mockHearingCollection } from '../../mocks/mockHearing';
import { mockRequestWithTranslation } from '../../mocks/mockRequest';

describe('Hearing Helpers', () => {
  describe('isHearingExist', () => {
    it('should return true with future date', () => {
      const expected = isHearingExist(mockHearingCollection);
      expect(expected).toEqual(true);
    });

    it('should return undefined if no hearing', () => {
      const expected = isHearingExist(undefined);
      expect(expected).toEqual(undefined);
    });
  });

  describe('getHearingCollection', () => {
    const translations: AnyRecord = { ...hearingDetailsTranslation };
    const request = mockRequestWithTranslation({}, translations);

    it('should render the hearing details page', () => {
      const sendNotificationCollection = [
        {
          id: 'daeade9a-52df-48f6-9ef8-4eb210dac9e3',
          value: {
            date: '11 April 2025',
            sendNotificationTitle: 'Hearing-1',
            sendNotificationNotify: Parties.BOTH_PARTIES,
            sendNotificationSubject: ['Hearing'],
            sendNotificationSelectHearing: {
              selectedCode: '123abc',
            },
            notificationState: HubLinkStatus.VIEWED,
          },
        },
      ];
      const actual = getHearingCollection(mockHearingCollection, sendNotificationCollection, request);
      const expected: HearingDetails[] = [
        {
          hearingNumber: '3333',
          hearingType: 'Hearing',
          hearingDateRows: [
            {
              date: new Date('2028-07-04T14:00:00.000'),
              status: 'Listed',
              venue: 'Field House',
            },
          ],
          notifications: [
            {
              date: '11 April 2025',
              displayStatus: 'Viewed',
              notificationTitle: 'Hearing-1',
              redirectUrl: '/notification-details/daeade9a-52df-48f6-9ef8-4eb210dac9e3',
              statusColor: '--green',
            },
          ],
        },
      ];
      expect(actual).toEqual(expected);
    });

    it('should render the hearing details page without notification', () => {
      const actual = getHearingCollection(mockHearingCollection, undefined, request);
      const expected: HearingDetails[] = [
        {
          hearingNumber: '3333',
          hearingType: 'Hearing',
          hearingDateRows: [
            {
              date: new Date('2028-07-04T14:00:00.000'),
              status: 'Listed',
              venue: 'Field House',
            },
          ],
          notifications: [],
        },
      ];
      expect(actual).toEqual(expected);
    });

    it('should render the hearing details page without hearing', () => {
      const actual = getHearingCollection(undefined, undefined, request);
      const expected: HearingDetails[] = [];
      expect(actual).toEqual(expected);
    });
  });

  describe('shouldShowHearingBanner', () => {
    it('should return false for empty notifications', () => {
      const result = shouldShowHearingBanner([]);
      expect(result).toEqual(false);
    });

    it('should return false for undefined notifications', () => {
      const result = shouldShowHearingBanner(undefined);
      expect(result).toEqual(false);
    });

    it('should return true for valid hearing notification not viewed and not RESPONDENT_ONLY', () => {
      const notifications: SendNotificationTypeItem[] = [
        {
          value: {
            sendNotificationNotify: Parties.BOTH_PARTIES,
            sendNotificationSubject: [NotificationSubjects.HEARING],
            notificationState: HubLinkStatus.NOT_VIEWED,
          },
        },
      ];
      const result = shouldShowHearingBanner(notifications);
      expect(result).toEqual(true);
    });

    it('should return false if notification is for RESPONDENT_ONLY', () => {
      const notifications: SendNotificationTypeItem[] = [
        {
          value: {
            sendNotificationNotify: Parties.RESPONDENT_ONLY,
            sendNotificationSubject: [NotificationSubjects.HEARING],
            notificationState: HubLinkStatus.NOT_VIEWED,
          },
        },
      ];
      const result = shouldShowHearingBanner(notifications);
      expect(result).toEqual(false);
    });

    it('should return false if notification is already viewed', () => {
      const notifications: SendNotificationTypeItem[] = [
        {
          value: {
            sendNotificationNotify: Parties.BOTH_PARTIES,
            sendNotificationSubject: [NotificationSubjects.HEARING],
            notificationState: HubLinkStatus.VIEWED,
          },
        },
      ];
      const result = shouldShowHearingBanner(notifications);
      expect(result).toEqual(false);
    });

    it('should return false if subject does not include HEARING', () => {
      const notifications: SendNotificationTypeItem[] = [
        {
          value: {
            sendNotificationNotify: Parties.BOTH_PARTIES,
            sendNotificationSubject: [NotificationSubjects.ORDER_OR_REQUEST],
            notificationState: HubLinkStatus.NOT_VIEWED,
          },
        },
      ];
      const result = shouldShowHearingBanner(notifications);
      expect(result).toEqual(false);
    });

    it('should return true if at least one notification meets all conditions', () => {
      const notifications: SendNotificationTypeItem[] = [
        {
          value: {
            sendNotificationNotify: Parties.RESPONDENT_ONLY,
            sendNotificationSubject: [NotificationSubjects.ORDER_OR_REQUEST],
            notificationState: HubLinkStatus.NOT_VIEWED,
          },
        },
        {
          value: {
            sendNotificationNotify: Parties.BOTH_PARTIES,
            sendNotificationSubject: [NotificationSubjects.HEARING],
            notificationState: HubLinkStatus.NOT_VIEWED,
          },
        },
      ];
      const result = shouldShowHearingBanner(notifications);
      expect(result).toEqual(true);
    });
  });
});
