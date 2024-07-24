import { shouldShowHearingInFuture } from '../../../../main/controllers/helpers/HearingHelpers';
import { HearingModel } from '../../../../main/definitions/api/caseApiResponse';

describe('Hearing Helpers - isHearingInFuture', () => {
  let collection: HearingModel[] = [];

  beforeEach(() => {
    collection = [
      {
        id: '12345-abc-12345',
        value: {
          Hearing_type: 'Hearing',
          Hearing_notes: 'notes',
          Hearing_stage: 'Stage 1',
          Hearing_venue: {
            value: {
              code: 'RCJ',
              label: 'RCJ',
            },
            list_items: [
              {
                code: 'Field House',
                label: 'Field House',
              },
              {
                code: 'Fox Court rm 1',
                label: 'Fox Court rm 1',
              },
              {
                code: 'London Central',
                label: 'London Central',
              },
              {
                code: 'RCJ',
                label: 'RCJ',
              },
            ],
            selectedCode: 'RCJ',
            selectedLabel: 'RCJ',
          },
          hearingFormat: ['In person', 'Telephone', 'Video'],
          hearingNumber: '3333',
          hearingSitAlone: 'Sit Alone',
          judicialMediation: 'Yes',
          hearingEstLengthNum: 22,
          hearingPublicPrivate: 'Public',
          hearingDateCollection: [],
        },
      },
    ];
  });

  it('should return true with future date', () => {
    collection[0].value.hearingDateCollection.push({
      id: '123abc',
      value: {
        listedDate: new Date('2099-07-04T14:00:00.000'),
        Hearing_status: 'Listed',
      },
    });
    const expected = shouldShowHearingInFuture(collection);
    expect(expected).toEqual(true);
  });

  it('should return true with 2 hearingDateCollection', () => {
    collection[0].value.hearingDateCollection.push(
      {
        id: '123abc',
        value: {
          listedDate: new Date('2000-07-04T14:00:00.000'),
          Hearing_status: 'Listed',
        },
      },
      {
        id: '456abc',
        value: {
          listedDate: new Date('2099-07-04T14:00:00.000'),
          Hearing_status: 'Listed',
        },
      }
    );
    const expected = shouldShowHearingInFuture(collection);
    expect(expected).toEqual(true);
  });

  it('should return true with 2 collection', () => {
    collection.push(collection[0]);
    collection[0].value.hearingDateCollection.push({
      id: '123abc',
      value: {
        listedDate: new Date('2000-07-04T14:00:00.000'),
        Hearing_status: 'Listed',
      },
    });
    collection[1].value.hearingDateCollection.push({
      id: '456abc',
      value: {
        listedDate: new Date('2099-07-04T14:00:00.000'),
        Hearing_status: 'Listed',
      },
    });
    const expected = shouldShowHearingInFuture(collection);
    expect(expected).toEqual(true);
  });

  it('should return false with passed date', () => {
    collection[0].value.hearingDateCollection.push({
      id: '123abc',
      value: {
        listedDate: new Date('2000-07-04T14:00:00.000'),
        Hearing_status: 'Listed',
      },
    });
    const expected = shouldShowHearingInFuture(collection);
    expect(expected).toEqual(false);
  });

  it('should return false with not Listed status', () => {
    collection[0].value.hearingDateCollection.push({
      id: '123abc',
      value: {
        listedDate: new Date('2099-07-04T14:00:00.000'),
        Hearing_status: 'Postponed',
      },
    });
    const expected = shouldShowHearingInFuture(collection);
    expect(expected).toEqual(false);
  });

  it('should return undefined if no hearing', () => {
    const expected = shouldShowHearingInFuture(undefined);
    expect(expected).toEqual(false);
  });

  it('should return undefined if no hearingDateCollection', () => {
    collection[0].value.hearingDateCollection = undefined;
    const expected = shouldShowHearingInFuture(collection);
    expect(expected).toEqual(false);
  });
});
