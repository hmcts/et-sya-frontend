import fs from 'fs';
import path from 'path';

import { expect } from 'chai';
import request from 'supertest';

import { PageUrls } from '../../../main/definitions/constants';
import { mockApp } from '../mocks/mockApp';

const pensionJsonRaw = fs.readFileSync(
  path.resolve(__dirname, '../../../main/resources/locales/en/translation/pension.json'),
  'utf-8'
);
const pensionJson = JSON.parse(pensionJsonRaw);

const titleClass = 'govuk-fieldset__legend';
const expectedTitle = pensionJson.h1;
const buttonClass = 'govuk-button';
const inputs = 'govuk-input--width-10';
const radios = 'govuk-radios';

let htmlRes: Document;
describe('Pension page', () => {
  beforeAll(async () => {
    await request(mockApp({}))
      .get(PageUrls.PENSION)
      .then(res => {
        htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
      });
  });

  it('should display title', () => {
    const title = htmlRes.getElementsByClassName(titleClass);
    expect(title[0].innerHTML).contains(expectedTitle, 'Page title does not exist');
  });

  it('should display radio buttons', () => {
    const radioButtons = htmlRes.getElementsByClassName(radios);
    expect(radioButtons.length).equal(1, `only ${radioButtons.length} found`);
  });

  it('should have 1 input field', () => {
    const inputFields = htmlRes.getElementsByClassName(inputs);
    expect(inputFields.length).equal(1, `only ${inputFields.length} found`);
  });

  it('should display save and continue button', () => {
    const button = htmlRes.getElementsByClassName(buttonClass);
    expect(button[5].innerHTML).contains('Save and continue', 'Could not find the button');
  });

  it('should display Save as draft button', () => {
    const button = htmlRes.getElementsByClassName(buttonClass);
    expect(button[6].innerHTML).contains('Save as draft', 'Could not find the button');
  });
});
