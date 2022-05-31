import fs from 'fs';
import path from 'path';

import { expect } from 'chai';
import request from 'supertest';

import { PageUrls } from '../../../main/definitions/constants';
import { mockApp } from '../mocks/mockApp';

const newJobStartDateJsonRaw = fs.readFileSync(
  path.resolve(__dirname, '../../../main/resources/locales/en/translation/new-job-start-date.json'),
  'utf-8'
);
const newJobStartDateJson = JSON.parse(newJobStartDateJsonRaw);

const titleClass = 'govuk-heading-xl';
const expectedTitle = newJobStartDateJson.h1;
const buttonClass = 'govuk-button';
const inputs = 'govuk-date-input__item';
const expectedInputLabel1 = 'Day';
const expectedInputLabel2 = 'Month';
const expectedInputLabel3 = 'Year';

let htmlRes: Document;
describe('New Job Start Date page', () => {
  beforeAll(async () => {
    await request(mockApp({}))
      .get(PageUrls.NEW_JOB_START_DATE)
      .then(res => {
        htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
      });
  });

  it('should display title', () => {
    const title = htmlRes.getElementsByClassName(titleClass);
    expect(title[0].innerHTML).contains(expectedTitle, 'Page title does not exist');
  });

  it('should display 3 input fields', () => {
    const radioButtons = htmlRes.getElementsByClassName(inputs);
    expect(radioButtons.length).equal(3, `only ${radioButtons.length} found`);
  });

  it('should display inputs with valid labels', () => {
    const radioButtons = htmlRes.getElementsByClassName(inputs);
    expect(radioButtons[0].innerHTML).contains(
      expectedInputLabel1,
      'Could not find the radio button with label ' + expectedInputLabel1
    );
    expect(radioButtons[1].innerHTML).contains(
      expectedInputLabel2,
      'Could not find the radio button with label ' + expectedInputLabel2
    );
    expect(radioButtons[2].innerHTML).contains(
      expectedInputLabel3,
      'Could not find the radio button with label ' + expectedInputLabel3
    );
  });

  it('should display Save and continue button', () => {
    const button = htmlRes.getElementsByClassName(buttonClass);
    expect(button[0].innerHTML).contains('Save and continue', 'Could not find the button');
  });
});
