export const mockHearingCollection = [
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

const futureDate1 = new Date();
const futureDate2 = new Date();
futureDate1.setDate(new Date().getDate() + 30);
futureDate2.setDate(new Date().getDate() + 60);

export const mockHearingCollectionFutureDates = [
  {
    id: '12345abc',
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
          id: '3890feaa-ad4b-4822-9040-3bc09279450a',
          value: {
            listedDate: futureDate1,
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
            hearingTimingStart: new Date(futureDate1),
            hearingTimingFinish: new Date(futureDate1),
          },
        },
        {
          id: 'asdfasdfasfa',
          value: {
            listedDate: new Date(futureDate2),
            Hearing_status: 'Listed',
            hearingVenueDay: {
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
            hearingTimingStart: new Date(futureDate2),
            hearingTimingFinish: new Date(futureDate2),
          },
        },
      ],
    },
  },
];
