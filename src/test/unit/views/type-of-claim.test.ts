import fs from 'fs';
import path from 'path';

import { expect } from 'chai';
import request from 'supertest';

import { app } from '../../../main/app';

const typeOfClaimJSONRaw = fs.readFileSync(
  path.resolve(__dirname, '../../../main/resources/locales/en/translation/type-of-claim.json'),
  'utf-8'
);
const typeOfClaimJSON = JSON.parse(typeOfClaimJSONRaw);

const PAGE_URL = '/type-of-claim';
const titleClass = 'govuk-fieldset__heading';
const expectedTitle = typeOfClaimJSON.h1;
const buttonClass = 'govuk-button';
const inputs = 'govuk-checkboxes__input';
const labels = 'govuk-checkboxes__item';
const expectedInputLabel = 'govuk-label';

let htmlRes: Document;
describe('Type of Claim page', () => {
  beforeAll(async () => {
    await request(app)
      .get(PAGE_URL)
      .then(res => {
        htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
      });
  });

  it('should display title', () => {
    const title = htmlRes.getElementsByClassName(titleClass);
    expect(title[0].innerHTML).contains(expectedTitle, 'Page title does not exist');
  });

  it('should display continue button', () => {
    const button = htmlRes.getElementsByClassName(buttonClass);
    expect(button[5].innerHTML).contains('Save and continue', 'Could not find the button');
  });

  it('should display checkboxes', () => {
    const checkboxes = htmlRes.getElementsByClassName(inputs);
    expect(checkboxes.length).equal(5, `only ${checkboxes.length} found`);
  });

  it('should display inputs with valid labels', () => {
    const radioButtons = htmlRes.getElementsByClassName(labels);
    expect(radioButtons[0].innerHTML).contains(
      expectedInputLabel,
      'Could not find the radio button with label ' + expectedInputLabel
    );
  });
});
