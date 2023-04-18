import { expect } from 'chai';
import request from 'supertest';

import { mockApp } from '../mocks/mockApp';

const PAGE_URL = '/about-hearing-documents';
const titleClass = 'govuk-heading-xl';
const buttonClass = 'govuk-button';
const expectedTitle = 'About your hearing documents';
let htmlRes: Document;

describe('About hearing documents page', () => {
  beforeAll(async () => {
    await request(
      mockApp({
        userCase: {
          hearingCollection: [
            {
              id: '236c8a94-e485-4034-bbdb-99f982679138',
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
                      listedDate: new Date('2023-07-04T14:00:00.000'),
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
                      hearingTimingStart: new Date('2023-04-13T11:00:00.000'),
                      hearingTimingFinish: new Date('2023-04-13T11:00:00.000'),
                    },
                  },
                ],
              },
            },
          ],
        },
      })
    )
      .get(PAGE_URL)
      .then(res => {
        htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
      });
  });

  it('should display title', () => {
    const title = htmlRes.getElementsByClassName(titleClass);
    expect(title[0].innerHTML).contains(expectedTitle, 'Page title does not exist');
  });

  it('should display continue button', () => {
    const button = htmlRes.getElementsByClassName(buttonClass);
    expect(button[5].innerHTML).contains('Continue', 'Could not find the continue button');
  });
});
