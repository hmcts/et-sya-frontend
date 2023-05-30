import { expect } from 'chai';
import request from 'supertest';

import { mockApp } from '../mocks/mockApp';

const PAGE_URL = '/respondent-postcode-enter';
const titleClass = 'govuk-heading-xl';
const pClass = 'govuk-body';
const buttonClass = 'govuk-button';
const expectedTitle = 'What is the address of ';
const expectedP1 = 'You should be able to find the address on your payslips, contract or other official documents.';
const inputs = '[class*="respondentPostcodeEnter"]';
const expectedInputLabel = 'Enter a UK postcode';

let htmlRes: Document;
describe('Respondent address postcode enter page', () => {
  beforeAll(async () => {
    await request(
      mockApp({
        userCase: {
          respondentEnterPostcode: 'LS12DE',
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

  it('should display first paragraph', () => {
    const p1 = htmlRes.getElementsByClassName(pClass);
    expect(p1[6].innerHTML).contains(expectedP1, 'P1 does not exist');
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
    expect(button[5].innerHTML).contains('Save and continue', 'Could not find the button');
  });
});
