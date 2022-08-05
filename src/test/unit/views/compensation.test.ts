import fs from 'fs';
import path from 'path';

import { expect } from 'chai';
import request from 'supertest';

import { PageUrls } from '../../../main/definitions/constants';
import { mockApp } from '../mocks/mockApp';

const compensationJSONRaw = fs.readFileSync(
  path.resolve(__dirname, '../../../main/resources/locales/en/translation/compensation.json'),
  'utf-8'
);
const compensationJSON = JSON.parse(compensationJSONRaw);

const titleClass = 'govuk-heading-xl';
const expectedTitle = compensationJSON.h1;
const buttonClass = 'govuk-button';
const textAreaClass = 'govuk-textarea';
const inputs = 'govuk-input--width-10';

let htmlRes: Document;
describe('Compensation page', () => {
  beforeAll(async () => {
    await request(mockApp({}))
      .get(PageUrls.COMPENSATION)
      .then(res => {
        htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
      });
  });

  it('should display title', () => {
    const title = htmlRes.getElementsByClassName(titleClass);
    expect(title[0].innerHTML).contains(expectedTitle, 'Page title does not exist');
  });

  it('should have 1 text area field', () => {
    const textAreaField = htmlRes.getElementsByClassName(textAreaClass);
    expect(textAreaField.length).equal(1, `only ${textAreaField.length} found`);
  });

  it('should have 1 currency input field', () => {
    const inputField = htmlRes.getElementsByClassName(inputs);
    expect(inputField.length).equal(1, `only ${inputField.length} found`);
  });

  it('should display save and continue button', () => {
    const button = htmlRes.getElementsByClassName(buttonClass);
    expect(button[0].innerHTML).contains('Save and continue', 'Could not find the button');
  });

  it('should display save as draft button', () => {
    const button = htmlRes.getElementsByClassName(buttonClass);
    expect(button[1].innerHTML).contains('Save as draft', 'Could not find the button');
  });
});
