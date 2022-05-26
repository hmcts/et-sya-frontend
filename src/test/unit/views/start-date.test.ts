import fs from 'fs';
import path from 'path';

import { expect } from 'chai';
import request from 'supertest';

import { app } from '../../../main/app';
import { PageUrls } from '../../../main/definitions/constants';

const startDateJsonRaw = fs.readFileSync(
  path.resolve(__dirname, '../../../main/resources/locales/en/translation/start-date.json'),
  'utf-8'
);
const startDateJson = JSON.parse(startDateJsonRaw);

const titleClass = 'govuk-heading-xl';
const paragraphClass = 'govuk-body';
const expectedTitle = startDateJson.h1;
const expectedP1 = startDateJson.p1;
const expectedP2 = startDateJson.p2;
const buttonClass = 'govuk-button';
const inputs = 'govuk-date-input__item';
const expectedInputLabel1 = 'Day';
const expectedInputLabel2 = 'Month';
const expectedInputLabel3 = 'Year';

let htmlRes: Document;
describe('Employment start date page', () => {
  beforeAll(async () => {
    await request(app)
      .get(PageUrls.START_DATE)
      .then(res => {
        htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
      });
  });

  it('should display page title', () => {
    const title = htmlRes.getElementsByClassName(titleClass);
    expect(title[0].innerHTML).contains(expectedTitle, 'Page title does not exist');
  });

  it('should display paragraph 1 text', () => {
    const p1 = htmlRes.getElementsByClassName(paragraphClass);
    expect(p1[0].innerHTML).contains(expectedP1, 'Page title does not exist');
  });

  it('should display paragraph 2 text', () => {
    const p2 = htmlRes.getElementsByClassName(paragraphClass);
    expect(p2[0].innerHTML).contains(expectedP2, 'Page title does not exist');
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

  it('should display save and continue button', () => {
    const button = htmlRes.getElementsByClassName(buttonClass);
    expect(button[0].innerHTML).contains('Save and continue', 'Could not find the button');
  });

  it('should display Save as draft button', () => {
    const button = htmlRes.getElementsByClassName(buttonClass);
    expect(button[1].innerHTML).contains('Save as draft', 'Could not find the button');
  });
});
