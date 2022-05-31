import fs from 'fs';
import path from 'path';

import { expect } from 'chai';
import request from 'supertest';

import { mockApp } from '../mocks/mockApp';

const telNumberJSONRaw = fs.readFileSync(
  path.resolve(__dirname, '../../../main/resources/locales/en/translation/telephone-number.json'),
  'utf-8'
);
const telNumberJSON = JSON.parse(telNumberJSONRaw);

const PAGE_URL = '/telephone-number';
const titleClass = 'govuk-heading-xl';
const helperClass = 'govuk-label';
const expectedTitle = telNumberJSON.h1;
const expectedHelperText = telNumberJSON.hint;
const buttonClass = 'govuk-button';
const inputs = '[class*="telephone-number"]';
const expectedInputLabel = 'UK telephone number';

let htmlRes: Document;
describe('Telephone number page', () => {
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

  it('should display helper text', () => {
    const helper = htmlRes.getElementsByClassName(helperClass);
    expect(helper[0].innerHTML).contains(expectedHelperText, 'Could not find helper text');
  });

  it('should display save and continue button', () => {
    const button = htmlRes.getElementsByClassName(buttonClass);
    expect(button[0].innerHTML).contains('Save and continue', 'Could not find the button');
  });

  it('should display Save as draft button', () => {
    const button = htmlRes.getElementsByClassName(buttonClass);
    expect(button[1].innerHTML).contains('Save as draft', 'Could not find the button');
  });

  it('should display 1 input field', () => {
    const inputFields = htmlRes.querySelectorAll(inputs);
    expect(inputFields.length).equal(1, `only ${inputFields.length} found`);
  });

  it('should display inputs with valid labels', () => {
    const inputFields = htmlRes.querySelectorAll(inputs);
    expect(inputFields[0].innerHTML).contains(
      expectedInputLabel,
      `Could not find an input field with label ${expectedInputLabel}`
    );
  });
});
