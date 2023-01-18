import { expect } from 'chai';
import request from 'supertest';

import { mockApp } from '../mocks/mockApp';

const PAGE_URL = '/work-postcode';
const titleClass = 'govuk-heading-xl';
const pClass = 'govuk-body';
const buttonClass = 'govuk-button';
const expectedTitle = 'What’s the postcode where you worked or work?';
const expectedP1 =
  'We need this to help progress your claim. If you work or worked at home occasionally or full time, enter the postcode where you would go to work for the employer.';
const expectedP2 =
  'If you’re claiming against someone you’ve not worked for - as best as you can, enter the postcode of where they’re based.';
const inputs = '[class*="workPostcode"]';
const expectedInputLabel = 'Postcode';

let htmlRes: Document;
describe('Work postcode page', () => {
  beforeAll(async () => {
    await request(mockApp({}))
      .get(PAGE_URL)
      .then(res => {
        htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
      });
  });

  it('should display title', () => {
    const title = htmlRes.getElementsByClassName(titleClass);
    expect(title[0].innerHTML).contains(expectedTitle, 'Page title does not exist');
  });

  it('should display firt paragraph', () => {
    const p1 = htmlRes.getElementsByClassName(pClass);
    expect(p1[6].innerHTML).contains(expectedP1, 'P1 does not exist');
  });

  it('should display second paragraph', () => {
    const p1 = htmlRes.getElementsByClassName(pClass);
    expect(p1[7].innerHTML).contains(expectedP2, 'P2 does not exist');
  });

  it('should display 1 input field', () => {
    const inputFields = htmlRes.querySelectorAll(inputs);
    expect(inputFields.length).equal(1, `incorrect number of inputs found, there was ${inputFields.length} found`);
  });

  it('should display the single text input with a valid labels', () => {
    const inputFields = htmlRes.querySelectorAll(inputs);
    expect(inputFields[0].innerHTML).contains(
      expectedInputLabel,
      `Could not find an input field with label ${expectedInputLabel}`
    );
  });

  it('should display continue button', () => {
    const button = htmlRes.getElementsByClassName(buttonClass);
    expect(button[5].innerHTML).contains('Continue', 'Could not find the button');
  });
});
