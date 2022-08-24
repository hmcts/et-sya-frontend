import fs from 'fs';
import path from 'path';

import { expect } from 'chai';
import request from 'supertest';

import { PageUrls } from '../../../main/definitions/constants';
import { mockApp } from '../mocks/mockApp';

const claimTypePayJSONRaw = fs.readFileSync(
  path.resolve(__dirname, '../../../main/resources/locales/en/translation/claim-type-pay.json'),
  'utf-8'
);
const claimTypePayJSON = JSON.parse(claimTypePayJSONRaw);

const titleClass = 'govuk-heading-xl';
const expectedTitle = claimTypePayJSON.h1;
const buttonClass = 'govuk-button';
const inputs = 'govuk-checkboxes__input';
const labels = 'govuk-checkboxes__item';
const expectedInputLabel = 'govuk-label';

let htmlRes: Document;
describe('Claim Type Pay page', () => {
  beforeAll(async () => {
    await request(mockApp({}))
      .get(PageUrls.CLAIM_TYPE_PAY)
      .then(res => {
        htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
      });
  });

  it('should display title', () => {
    const title = htmlRes.getElementsByClassName(titleClass);
    expect(title[0].innerHTML).contains(expectedTitle, 'Page title does not exist');
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

  it('should display save and continue button', () => {
    const button = htmlRes.getElementsByClassName(buttonClass);
    expect(button[4].innerHTML).contains('Save and continue', 'Could not find the button');
  });

  it('should display save as draft button', () => {
    const button = htmlRes.getElementsByClassName(buttonClass);
    expect(button[5].innerHTML).contains('Save as draft', 'Could not find the button');
  });
});
