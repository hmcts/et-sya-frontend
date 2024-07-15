import { setNextListedDate } from '../../../../main/controllers/helpers/HearingHelpers';
import { HearingModel } from '../../../../main/definitions/api/caseApiResponse';

describe('Hearing Helpers - setNextListedDate', () => {
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
          hearingDateCollection: [
            {
              id: '123abc',
              value: {
                listedDate: new Date('2028-07-04T14:00:00.000'),
                Hearing_status: 'Listed',
                hearingVenueDay: {
                  value: {
                    code: 'Field House',
                    label: 'Field House',
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
                  selectedCode: 'Field House',
                  selectedLabel: 'Field House',
                },
                hearingTimingStart: new Date('2023-11-13T11:00:00.000'),
                hearingTimingFinish: new Date('2023-11-13T11:00:00.000'),
              },
            },
          ],
        },
      },
    ];
  });

  it('should return the list date', () => {
    const expected = setNextListedDate(collection);
    expect(expected).toEqual(new Date('2028-07-04T14:00:00.000'));
  });

  it('should return the earliest future date', () => {
    collection[0].value.hearingDateCollection.push({
      id: '123abc',
      value: {
        listedDate: new Date('2028-06-02T14:00:00.000'),
        Hearing_status: 'Listed',
      },
    });
    const expected = setNextListedDate(collection);
    expect(expected).toEqual(new Date('2028-06-02T14:00:00.000'));
  });

  it('should return undefined if no hearing', () => {
    const expected = setNextListedDate(undefined);
    expect(expected).toEqual(undefined);
  });

  it('should return undefined if no hearingDateCollection', () => {
    collection[0].value.hearingDateCollection = undefined;
    const expected = setNextListedDate(collection);
    expect(expected).toEqual(undefined);
  });

  it('should return undefined if no hearings are present for future dates', () => {
    collection[0].value.hearingDateCollection[0].value.listedDate = new Date('2000-07-04T14:00:00.000');
    const expected = setNextListedDate(collection);
    expect(expected).toEqual(undefined);
  });
});
