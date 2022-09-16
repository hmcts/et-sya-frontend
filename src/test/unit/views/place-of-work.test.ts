import fs from 'fs';
import path from 'path';

import { expect } from 'chai';
import request from 'supertest';

import { mockApp } from '../mocks/mockApp';

const PAGE_URL = '/respondent/1/place-of-work';

const translationRaw = fs.readFileSync(
  path.resolve(__dirname, '../../../main/resources/locales/en/translation/place-of-work.json'),
  'utf-8'
);
const placeOfWorkJson = JSON.parse(translationRaw);
const addressJsonRaw = fs.readFileSync(
  path.resolve(__dirname, '../../../main/resources/locales/en/translation/enter-address.json'),
  'utf-8'
);

const addressJson = JSON.parse(addressJsonRaw);
const titleClass = 'govuk-heading-xl';
const buttonClass = 'govuk-!-margin-right-2';
const expectedInputLabel = addressJson.enterPostcode;
const labelClass = 'govuk-label';
const inputClass = 'govuk-input';
const postcodeId = 'postcode';
const addressInputs = '[class*="address"]';
const expectedInputLabel1 = 'Address line 1';
const expectedInputLabel2 = 'Address line 2 (optional)';
const expectedInputLabel3 = 'Town or city';
const expectedInputLabel4 = 'Country';
const expectedInputLabel5 = 'Postcode or area code (optional)';

let htmlRes: Document;

describe('Place Of Work Page', () => {
  beforeAll(async () => {
    await request(mockApp({}))
      .get(PAGE_URL)
      .then(res => {
        htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
      });
  });

  it('should display postcode label', () => {
    const inputLabel = htmlRes.getElementsByClassName(labelClass);
    expect(inputLabel[0].innerHTML).contains(expectedInputLabel, 'input label does not exist');
  });

  it('should display postcode input', () => {
    const inputs = htmlRes.getElementsByClassName(inputClass);
    expect(inputs[0].id).contains(postcodeId, 'input does not exist');
  });

  it('should display find address button', () => {
    const button = htmlRes.getElementsByClassName(buttonClass);
    expect(button[0].innerHTML).contains('Find address', 'Could not find the button');
  });

  it('should display title', () => {
    const expectedTitle = placeOfWorkJson.h1;
    const title = htmlRes.getElementsByClassName(titleClass);
    expect(title[0].innerHTML).contains(expectedTitle, 'Page title does not exist');
  });

  it('should have 5 input address fields for respondent which are conditionally displayed', () => {
    const inputFields = htmlRes.querySelectorAll(addressInputs);
    expect(inputFields.length).equal(5, `only ${inputFields.length} found`);
  });

  it('should display inputs with valid labels for work address', () => {
    const inputFields = htmlRes.querySelectorAll(addressInputs);
    expect(inputFields[0].innerHTML).contains(
      expectedInputLabel1,
      `Could not find an input field with label ${expectedInputLabel1}`
    );
    expect(inputFields[1].innerHTML).contains(
      expectedInputLabel2,
      `Could not find an input field with label ${expectedInputLabel2}`
    );
    expect(inputFields[2].innerHTML).contains(
      expectedInputLabel3,
      `Could not find an input field with label ${expectedInputLabel3}`
    );
    expect(inputFields[3].innerHTML).contains(
      expectedInputLabel4,
      `Could not find an input field with label ${expectedInputLabel4}`
    );
    expect(inputFields[4].innerHTML).contains(
      expectedInputLabel5,
      `Could not find an input field with label ${expectedInputLabel5}`
    );
  });
});
