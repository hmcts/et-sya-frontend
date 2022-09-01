import fs from 'fs';
import path from 'path';

import { expect } from 'chai';
import request from 'supertest';

import { app } from '../../../main/app';

const validNoAcasReasonJSONRaw = fs.readFileSync(
  path.resolve(__dirname, '../../../main/resources/locales/en/translation/valid-no-acas-reason.json'),
  'utf-8'
);
const validNoAcasReasonJSON = JSON.parse(validNoAcasReasonJSONRaw);

const PAGE_URL = '/do-you-have-a-valid-no-acas-reason';
const titleClass = 'govuk-heading-xl';
const expectedTitle = validNoAcasReasonJSON.h1;
const warningClass = 'govuk-warning-text';
const buttonClass = 'govuk-button';
const inputs = 'govuk-radios--inline';
const expectedInputLabel = 'label';

let htmlRes: Document;
describe('Acas Single Claim page', () => {
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
    expect(button[5].innerHTML).contains('Continue', 'Could not find the button');
  });

  it('should display radio buttons', () => {
    const radioButtons = htmlRes.getElementsByClassName(inputs);
    expect(radioButtons.length).equal(1, `only ${radioButtons.length} found`);
  });

  it('should display inputs with valid labels', () => {
    const radioButtons = htmlRes.getElementsByClassName(inputs);
    expect(radioButtons[0].innerHTML).contains(
      expectedInputLabel,
      'Could not find the radio button with label ' + expectedInputLabel
    );
  });

  it('should display important content', () => {
    const importantContent = htmlRes.getElementsByClassName(warningClass);
    expect(importantContent.length).equal(1, 'Important content does not exist');
  });
});
