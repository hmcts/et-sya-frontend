import { expect } from 'chai';
import request from 'supertest';

import { mockApp } from '../mocks/mockApp';

const titleClass = 'govuk-fieldset__heading';
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

  it('should wrap the radios in a fieldset with the question as the legend', () => {
    const fieldset = htmlRes.querySelector('fieldset.govuk-fieldset');
    expect(fieldset).not.equal(null, 'Fieldset does not exist');
    const legend = fieldset.firstElementChild;
    expect(legend.tagName).equal('LEGEND', 'Legend is not the first child of the fieldset');
    expect(legend.querySelector('h1').textContent).contains(expectedTitle);
    expect(legend.textContent).contains('1 The street', 'Address is not part of the legend');
    expect(fieldset.querySelectorAll('input[type="radio"]').length).equal(2);
  });

  it('should associate the hint with the fieldset', () => {
    const fieldset = htmlRes.querySelector('fieldset.govuk-fieldset');
    const hint = htmlRes.getElementsByClassName(hintClass)[0];
    expect(fieldset.getAttribute('aria-describedby')).contains(hint.id);
  });

  it('should have a single h1', () => {
    expect(htmlRes.getElementsByTagName('h1').length).equal(1);
  });
});
