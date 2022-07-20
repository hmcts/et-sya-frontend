import fs from 'fs';
import path from 'path';

import { expect } from 'chai';
import request from 'supertest';

import { PageUrls } from '../../../main/definitions/constants';
import { mockApp } from '../mocks/mockApp';

const newJobPayJsonRaw = fs.readFileSync(
  path.resolve(__dirname, '../../../main/resources/locales/en/translation/new-job-pay.json'),
  'utf-8'
);
const newJobPayJson = JSON.parse(newJobPayJsonRaw);

const titleClass = 'govuk-heading-xl';
const expectedTitle = newJobPayJson.h1;
const buttonClass = 'govuk-button';
const radios = 'govuk-radios';
const inputs = 'govuk-input--width-10';

let htmlRes: Document;
describe('New Job Pay page', () => {
  beforeAll(async () => {
    await request(mockApp({}))
      .get(PageUrls.NEW_JOB_PAY)
      .then(res => {
        htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
      });
  });

  it('should display title', () => {
    const title = htmlRes.getElementsByClassName(titleClass);
    expect(title[0].innerHTML).contains(expectedTitle, 'Page title does not exist');
  });

  it('should have 1 input field', () => {
    const inputField = htmlRes.getElementsByClassName(inputs);
    expect(inputField.length).equal(1, `only ${inputField.length} found`);
  });

  it('should display radio buttons', () => {
    const radioButtons = htmlRes.getElementsByClassName(radios);
    expect(radioButtons.length).equal(1, `only ${radioButtons.length} found`);
  });

  it('should display Save and continue button', () => {
    const button = htmlRes.getElementsByClassName(buttonClass);
    expect(button[0].innerHTML).contains('Save and continue', 'Could not find the button');
  });
});
