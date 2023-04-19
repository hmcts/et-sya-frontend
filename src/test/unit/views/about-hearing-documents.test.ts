import { expect } from 'chai';
import request from 'supertest';

import { mockApp } from '../mocks/mockApp';

const PAGE_URL = '/about-hearing-documents';
const titleClass = 'govuk-heading-xl';
const buttonClass = 'govuk-button';
const expectedTitle = 'About your hearing documents';
const radioButtonQuestion = 'govuk-radios govuk-radios';
const inputs = 'govuk-label govuk-radios__label';
const expectedRadioButton = '1 Hearing - RCJ - 4 Jul 2023';
let htmlRes: Document;

describe('About hearing documents page', () => {
  beforeAll(async () => {
    await request(
      mockApp({
        userCase: {
          hearingCollection: [
            {
              id: '123abc',
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
                    id: '321abc',
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
                  {
                    id: 'bcdefg123',
                    value: {
                      listedDate: new Date('2023-03-19T00:00:00.000'),
                      Hearing_status: 'Listed',
                      hearingVenueDay: {
                        value: {
                          code: 'Fox Court rm 1',
                          label: 'Fox Court rm 1',
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
                        selectedCode: 'Fox Court rm 1',
                        selectedLabel: 'Fox Court rm 1',
                      },
                      hearingTimingStart: new Date('2023-03-19T00:00:00.000'),
                      hearingTimingFinish: new Date('2023-03-19T00:00:00.000'),
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

  it('should display radios', () => {
    const radios = htmlRes.getElementsByClassName(radioButtonQuestion);
    expect(radios.length).equal(3, `only ${radios.length} found`);
  });

  it('first question should contain the correct number of radios buttons, only displaying hearings for future dates', () => {
    const allQuestions = htmlRes.getElementsByClassName(radioButtonQuestion);
    const question1 = allQuestions[0];
    const radios = question1.getElementsByClassName(inputs);
    expect(radios.length).equal(1, `only ${radios.length} found`);
  });
  it('first radio button of first question should display the numbered hearing with location and formatted date', () => {
    const allQuestions = htmlRes.getElementsByClassName(radioButtonQuestion);
    const question1 = allQuestions[0];
    const radios = question1.getElementsByClassName(inputs);
    expect(radios[0].innerHTML).contains(expectedRadioButton, 'Radio button is not correct');
  });
  it('second question should contain the correct number of radios buttons', () => {
    const allQuestions = htmlRes.getElementsByClassName(radioButtonQuestion);
    const question2 = allQuestions[1];
    const radios = question2.getElementsByClassName(inputs);
    expect(radios.length).equal(2, `only ${radios.length} found`);
  });
  it('third question should contain the correct number of radios buttons', () => {
    const allQuestions = htmlRes.getElementsByClassName(radioButtonQuestion);
    const question3 = allQuestions[2];
    const radios = question3.getElementsByClassName(inputs);
    expect(radios.length).equal(3, `only ${radios.length} found`);
  });
});
