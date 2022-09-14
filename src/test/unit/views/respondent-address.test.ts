import fs from 'fs';
import path from 'path';

import { expect } from 'chai';
import request from 'supertest';

import { mockApp } from '../mocks/mockApp';

const translationRaw = fs.readFileSync(
  path.resolve(__dirname, '../../../main/resources/locales/en/translation/respondent-address.json'),
  'utf-8'
);
const respondentAddressJson = JSON.parse(translationRaw);

const respondentName = 'Globo Gym';
const titleClass = 'govuk-heading-xl';
const insetClass = 'govuk-inset-text';
const expectedTitle = respondentAddressJson.h1 + respondentName;
const buttonClass = 'govuk-button';
const inputs = '[class*="address"]';
const expectedInputLabel1 = 'Address line 1';
const expectedInputLabel2 = 'Address line 2 (optional)';
const expectedInputLabel3 = 'Town or city';
const expectedInputLabel4 = 'Country';
const expectedInputLabel5 = 'Postcode or area code (optional)';

let htmlRes: Document;
describe('Respondent Address Page', () => {
  beforeAll(async () => {
    await request(
      mockApp({
        userCase: {
          respondents: [
            {
              respondentNumber: 1,
              respondentName,
            },
          ],
        },
      })
    )
      .get('/respondent/1/respondent-address')
      .then(res => {
        htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
      });
  });

  it('should display title', () => {
    const title = htmlRes.getElementsByClassName(titleClass);
    expect(title[0].innerHTML).contains(expectedTitle, 'Page title does not exist');
  });

  it('should display insetText', () => {
    const title = htmlRes.getElementsByClassName(insetClass);
    expect(title[0].innerHTML).contains(respondentAddressJson.insetText, 'Inset text does not exist');
  });

  it("should display the 'Find Address' button for respondent", () => {
    const button = htmlRes.getElementsByClassName(buttonClass);
    expect(button[5].innerHTML).contains('Find address', 'Could not find the button');
  });

  it('should have 5 input address fields for respondent which are conditionally displayed', () => {
    const inputFields = htmlRes.querySelectorAll(inputs);
    expect(inputFields.length).equal(5, `only ${inputFields.length} found`);
  });

  it('should display inputs with valid labels', () => {
    const inputFields = htmlRes.querySelectorAll(inputs);
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
