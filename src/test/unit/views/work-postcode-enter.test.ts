import { expect } from 'chai';
import request from 'supertest';

import { mockApp } from '../mocks/mockApp';

const PAGE_URL = '/work-postcode-enter';
const titleClass = 'govuk-heading-xl';
const pClass = 'govuk-body';
const buttonClass = 'govuk-button';
const expectedTitle = 'What’s the postcode where you worked or work?';
const expectedInputLabel = 'Enter a UK postcode';
const expectedP1 =
  'This will decide which Employment Tribunal office deals with your claim. If you worked at home, enter your home postcode.';
const expectedP2 =
  'If you’re claiming against someone you did not work for, enter the postcode of where they are based.';
const inputs = '[class*="workPostcodeEnter"]';

let htmlRes: Document;
describe('Address postcode enter page', () => {
  beforeAll(async () => {
    await request(
      mockApp({
        userCase: {
          addressEnterPostcode: 'LS12DE',
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

  it('should display second paragraph', () => {
    const p1 = htmlRes.getElementsByClassName(pClass);
    expect(p1[7].innerHTML).contains(expectedP2, 'P2 does not exist');
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
