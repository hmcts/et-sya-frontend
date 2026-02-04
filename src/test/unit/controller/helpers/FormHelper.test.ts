import { createLabelForHearing, createRadioBtnsForHearings } from '../../../../main/controllers/helpers/FormHelpers';
import { HearingModel } from '../../../../main/definitions/api/caseApiResponse';
import { mockHearingCollection } from '../../mocks/mockHearing';
describe('createRadioBtnsForHearings - create radio buttons for selecting a hearing', () => {
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
  it('should return a label, name and value for each hearing', () => {
    const radioButtons = createRadioBtnsForHearings(collection);
    expect(radioButtons[0]).toEqual(
      expect.objectContaining({
        label: expect.any(String),
        name: 'hearingDocumentsAreFor',
        value: mockHearingCollection[0].id,
      })
    );
  });

  it('should return undefined if no hearings are present for future dates', () => {
    collection[0].value.hearingDateCollection[0].value.listedDate = new Date('2022-07-04T14:00:00.000');
    const radioButtons = createRadioBtnsForHearings(collection);
    expect(radioButtons).toEqual(undefined);
  });

  it('should return undefined if hearing status is not Listed even if date is in future', () => {
    collection[0].value.hearingDateCollection[0].value.listedDate = new Date('2028-07-04T14:00:00.000');
    collection[0].value.hearingDateCollection[0].value.Hearing_status = 'Postponed';
    const radioButtons = createRadioBtnsForHearings(collection);
    expect(radioButtons).toEqual(undefined);
  });

  describe('createLabelForHearing - produce a formatted label with hearing venue and date', () => {
    it('should return a label, with hearing number, hearing type, location and formatted date', () => {
      collection[0].value.hearingDateCollection[0].value.listedDate = new Date('2038-07-04T14:00:00.000');
      const label = createLabelForHearing(collection[0]);
      expect(label).toEqual('3333 Hearing - RCJ - 4 July 2038');
    });
    it('should not return the hearing number if undefined', () => {
      collection[0].value.hearingDateCollection[0].value.listedDate = new Date('2038-07-04T14:00:00.000');
      collection[0].value.hearingNumber = undefined;
      const label = createLabelForHearing(collection[0]);
      expect(label).toEqual(' Hearing - RCJ - 4 July 2038');
    });
    it('should not return the hearing venue if undefined', () => {
      collection[0].value.hearingDateCollection[0].value.listedDate = new Date('2038-07-04T14:00:00.000');
      collection[0].value.Hearing_venue = undefined;
      const label = createLabelForHearing(collection[0]);
      expect(label).toEqual('3333 Hearing -  - 4 July 2038');
    });
    it('should return the earliest date in the furture from the hearing collection', () => {
      collection[0].value.hearingDateCollection[0].value.listedDate = new Date('2040-07-04T14:00:00.000');
      collection[0].value.hearingDateCollection.push({
        id: '123abc',
        value: {
          listedDate: new Date('2045-07-04T14:00:00.000'),
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
      });
      const label = createLabelForHearing(collection[0]);
      expect(label).toEqual('3333 Hearing - RCJ - 4 July 2040');
    });
    it('should return undefined if hearing status is not Listed', () => {
      collection[0].value.hearingDateCollection[0].value.listedDate = new Date('2038-07-04T14:00:00.000');
      collection[0].value.hearingDateCollection[0].value.Hearing_status = 'Heard';
      const label = createLabelForHearing(collection[0]);
      expect(label).toEqual(undefined);
    });
    it('should only include Listed hearings when multiple hearing dates exist', () => {
      collection[0].value.hearingDateCollection[0].value.listedDate = new Date('2035-07-04T14:00:00.000');
      collection[0].value.hearingDateCollection[0].value.Hearing_status = 'Postponed';
      collection[0].value.hearingDateCollection.push({
        id: '456def',
        value: {
          listedDate: new Date('2040-07-04T14:00:00.000'),
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
            ],
            selectedCode: 'Field House',
            selectedLabel: 'Field House',
          },
        },
      });
      const label = createLabelForHearing(collection[0]);
      expect(label).toEqual('3333 Hearing - RCJ - 4 July 2040');
    });
  });
});
