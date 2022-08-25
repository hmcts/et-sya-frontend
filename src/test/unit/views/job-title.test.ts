import { expect } from 'chai';
import request from 'supertest';

import { mockApp } from '../mocks/mockApp';

const PAGE_URL = '/job-title';
const titleClass = 'govuk-heading-xl';
const pClass = 'govuk-body';
const buttonClass = 'govuk-button';
const expectedTitle = 'Employment details';
const expectedP1 =
  'Tell us some details about working for the organisation or person you’re making your claim against.';
const expectedP2 = 'These details will be used to help progress your claim.';
const inputs = '[class*="jobTitle"]';
const expectedInputLabel = 'Job title';

let htmlRes: Document;
describe('Job Title page', () => {
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
    expect(p1[4].innerHTML).contains(expectedP1, 'P1 does not exist');
  });

  it('should display second paragraph', () => {
    const p1 = htmlRes.getElementsByClassName(pClass);
    expect(p1[5].innerHTML).contains(expectedP2, 'P2 does not exist');
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
    expect(button[4].innerHTML).contains('continue', 'Could not find the button');
  });
});
