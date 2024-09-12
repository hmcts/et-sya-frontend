import { expect } from 'chai';
import request from 'supertest';

import { mockApp } from '../mocks/mockApp';

const titleClass = 'govuk-heading-xl';
const expectedTitle = 'Did you work at';
const hintClass = 'govuk-hint';
const expectedHint =
  "Select 'Yes' if this is the address where you were based. " +
  "Select 'No' if you were based at a different address or worked from home.";

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
    const hint = htmlRes.getElementsByClassName(hintClass);
    expect(hint[0].innerHTML).contains(expectedHint, 'Hint text does not exist');
  });
});
