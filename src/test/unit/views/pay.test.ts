import fs from 'fs';
import path from 'path';

import { PageUrls } from '../../../main/definitions/constants';
import { mockApp } from '../mocks/mockApp';

import { expect } from 'chai';
import request from 'supertest';

const payJsonRaw = fs.readFileSync(
  path.resolve(__dirname, '../../../main/resources/locales/en/translation/pay.json'),
  'utf-8'
);
const payJson = JSON.parse(payJsonRaw);

const titleClass = 'govuk-heading-xl';
const expectedTitle = payJson.h1;
const buttonClass = 'govuk-button';
const radios = 'govuk-radios';
const inputs = 'govuk-input--width-10';

let htmlRes: Document;
describe('Pay page', () => {
  beforeAll(async () => {
    await request(mockApp({}))
      .get(PageUrls.PAY)
      .then(res => {
        htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
      });
  });

  it('should display title', () => {
    const title = htmlRes.getElementsByClassName(titleClass);
    expect(title[0].innerHTML).contains(expectedTitle, 'Page title does not exist');
  });

  it('should have 2 input fields', () => {
    const inputFields = htmlRes.getElementsByClassName(inputs);
    expect(inputFields.length).equal(2, `only ${inputFields.length} found`);
  });

  it('should display radio buttons', () => {
    const radioButtons = htmlRes.getElementsByClassName(radios);
    expect(radioButtons.length).equal(1, `only ${radioButtons.length} found`);
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
