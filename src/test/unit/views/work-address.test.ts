import { expect } from 'chai';
import request from 'supertest';

import { mockApp } from '../mocks/mockApp';

const titleClass = 'govuk-heading-xl';
const expectedTitle = 'Did you work at 1 The street?';
const hintClass = 'govuk-hint';
const expectedHint =
  "Choose 'Yes' if you worked from home occasionally or full-time for the same address listed for the respondent.";

let htmlRes: Document;
describe('Work address', () => {
  beforeAll(async () => {
    await request(
      mockApp({
        userCase: {
          respondents: [
            {
              respondentAddress1: '1 The street',
              respondentNumber: 1,
              respondentName: 'Globo Gym',
            },
          ],
        },
      })
    )
      .get('/respondent/1/work-address')
      .then(res => {
        htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
      });
  });

  it('should display title', () => {
    const title = htmlRes.getElementsByClassName(titleClass);
    expect(title[0].innerHTML).contains(expectedTitle, 'Page title does not exist');
  });

  it('should display hint', () => {
    const title = htmlRes.getElementsByClassName(hintClass);
    expect(title[0].innerHTML).contains(expectedHint, 'Hint text does not exist');
  });
});
