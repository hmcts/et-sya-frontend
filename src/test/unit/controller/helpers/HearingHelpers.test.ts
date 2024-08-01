import {
  getHearingCollection,
  isHearingExist,
  isNotificationWithFutureHearing,
} from '../../../../main/controllers/helpers/HearingHelpers';
import { HearingModel } from '../../../../main/definitions/api/caseApiResponse';
import { SendNotificationTypeItem } from '../../../../main/definitions/complexTypes/sendNotificationTypeItem';
import { Parties } from '../../../../main/definitions/constants';
import { HearingDetails } from '../../../../main/definitions/hearingDetails';
import { HubLinkStatus } from '../../../../main/definitions/hub';
import citizenHubTranslation from '../../../../main/resources/locales/en/translation/citizen-hub.json';
import { mockHearingCollection } from '../../mocks/mockHearing';

describe('Hearing Helpers - isHearingExist', () => {
  it('should return true with future date', () => {
    const actual = isHearingExist(mockHearingCollection);
    expect(actual).toEqual(true);
  });

  it('should return undefined if no hearing', () => {
    const actual = isHearingExist(undefined);
    expect(actual).toEqual(undefined);
  });
});

describe('Hearing Helpers - getHearingCollection', () => {
  const translations = { ...citizenHubTranslation };

  it('should render the hearing details page', () => {
    const sendNotificationCollection = [
      {
        id: 'daeade9a-52df-48f6-9ef8-4eb210dac9e3',
        value: {
          sendNotificationNotify: Parties.BOTH_PARTIES,
          sendNotificationSubject: ['Hearing'],
          sendNotificationSelectHearing: {
            selectedCode: '123abc',
          },
          notificationState: HubLinkStatus.VIEWED,
        },
      },
    ];
    const actual = getHearingCollection(mockHearingCollection, sendNotificationCollection, translations);
    const expected: HearingDetails[] = [
      {
        hearingNumber: '3333',
        Hearing_type: 'Hearing',
        hearingDateRows: [
          {
            date: new Date('2028-07-04T14:00:00.000'),
            status: 'Listed',
            venue: 'Field House',
          },
        ],
        notifications: [
          {
            displayStatus: 'Viewed',
            id: 'daeade9a-52df-48f6-9ef8-4eb210dac9e3',
            redirectUrl: '/tribunal-order-or-request-details/daeade9a-52df-48f6-9ef8-4eb210dac9e3',
            statusColor: '--green',
            value: {
              notificationState: HubLinkStatus.VIEWED,
              sendNotificationNotify: Parties.BOTH_PARTIES,
              sendNotificationSelectHearing: { selectedCode: '123abc' },
              sendNotificationSubject: ['Hearing'],
            },
          },
        ],
      },
    ];
    expect(actual).toEqual(expected);
  });

  it('should render the hearing details page without notification', () => {
    const actual = getHearingCollection(mockHearingCollection, undefined, translations);
    const expected: HearingDetails[] = [
      {
        hearingNumber: '3333',
        Hearing_type: 'Hearing',
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
    const actual = getHearingCollection(undefined, undefined, translations);
    const expected: HearingDetails[] = [];
    expect(actual).toEqual(expected);
  });
});

describe('Hearing Helpers - isNotificationWithFutureHearing', () => {
  const notification = {
    id: '72fde617-8ced-46e6-adbf-03cee33cd391',
    value: {
      number: '1',
      sendNotificationNotify: 'Both parties',
      sendNotificationSubject: ['Hearing'],
      sendNotificationSelectHearing: {
        selectedCode: 'ab76e211-cc08-45f8-b86e-61e775a09253',
      },
    },
  } as SendNotificationTypeItem;

  const hearings = [
    {
      id: '8217a109-f4e0-46d3-b073-7a4a4b88df89',
      value: {
        hearingDateCollection: [
          {
            id: 'ab76e211-cc08-45f8-b86e-61e775a09253',
            value: {
              listedDate: new Date('2099-07-04T14:00:00.000'),
            },
          },
        ],
      },
    },
  ] as HearingModel[];

  it('should return true with future hearing', () => {
    const actual = isNotificationWithFutureHearing(notification);
    expect(true).toEqual(actual);
  });

  it('should return false if sendNotificationSubject is not Hearing', () => {
    notification.value.sendNotificationSubject = ['Judgment'];
    const actual = isNotificationWithFutureHearing(notification);
    expect(actual).toEqual(false);
  });

  it('should return undefined if sendNotificationSubject is undefined', () => {
    notification.value.sendNotificationSubject = undefined;
    const actual = isNotificationWithFutureHearing(notification);
    expect(actual).toEqual(undefined);
  });

  it('should return false if sendNotificationNotify is Respondent only', () => {
    notification.value.sendNotificationNotify = 'Respondent only';
    const actual = isNotificationWithFutureHearing(notification);
    expect(actual).toEqual(false);
  });

  it('should return undefined if undefined is undefined', () => {
    const actual = isNotificationWithFutureHearing(undefined);
    expect(actual).toEqual(undefined);
  });

  it('should return false if hearingDateCollection is undefined', () => {
    hearings[0].value.hearingDateCollection = undefined;
    const actual = isNotificationWithFutureHearing(notification);
    expect(actual).toEqual(false);
  });

  it('should return false if hearings is undefined', () => {
    const actual = isNotificationWithFutureHearing(notification);
    expect(actual).toEqual(false);
  });
});
