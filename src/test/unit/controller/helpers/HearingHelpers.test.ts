import { isHearingExist, isNotificationWithFutureHearing } from '../../../../main/controllers/helpers/HearingHelpers';
import { HearingModel } from '../../../../main/definitions/api/caseApiResponse';
import { SendNotificationTypeItem } from '../../../../main/definitions/complexTypes/sendNotificationTypeItem';
import { mockHearingCollection } from '../../mocks/mockHearing';

describe('Hearing Helpers - isHearingExist', () => {
  it('should return true with future date', () => {
    const expected = isHearingExist(mockHearingCollection);
    expect(expected).toEqual(true);
  });

  it('should return undefined if no hearing', () => {
    const expected = isHearingExist(undefined);
    expect(expected).toEqual(undefined);
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
    const expected = isNotificationWithFutureHearing(notification);
    expect(expected).toEqual(true);
  });

  it('should return false if selectedCode is invalid', () => {
    notification.value.sendNotificationSelectHearing.selectedCode = '204730f4-fa71-4952-a71d-d794a31c2553';
    const expected = isNotificationWithFutureHearing(notification);
    expect(expected).toEqual(false);
  });

  it('should return undefined if sendNotificationSelectHearing is undefined', () => {
    notification.value.sendNotificationSelectHearing = undefined;
    const expected = isNotificationWithFutureHearing(notification);
    expect(expected).toEqual(undefined);
  });

  it('should return false if sendNotificationSubject is not Hearing', () => {
    notification.value.sendNotificationSubject = ['Judgment'];
    const expected = isNotificationWithFutureHearing(notification);
    expect(expected).toEqual(false);
  });

  it('should return undefined if sendNotificationSubject is undefined', () => {
    notification.value.sendNotificationSubject = undefined;
    const expected = isNotificationWithFutureHearing(notification);
    expect(expected).toEqual(undefined);
  });

  it('should return false if sendNotificationNotify is Respondent only', () => {
    notification.value.sendNotificationNotify = 'Respondent only';
    const expected = isNotificationWithFutureHearing(notification);
    expect(expected).toEqual(false);
  });

  it('should return undefined if undefined is undefined', () => {
    const expected = isNotificationWithFutureHearing(undefined);
    expect(expected).toEqual(undefined);
  });

  it('should return false if hearingDateCollection is undefined', () => {
    hearings[0].value.hearingDateCollection = undefined;
    const expected = isNotificationWithFutureHearing(notification);
    expect(expected).toEqual(false);
  });

  it('should return false if hearings is undefined', () => {
    const expected = isNotificationWithFutureHearing(notification);
    expect(expected).toEqual(false);
  });
});
