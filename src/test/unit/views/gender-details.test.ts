import fs from 'fs';
import path from 'path';

import { expect } from 'chai';
import request from 'supertest';

import { mockApp } from '../mocks/mockApp';

const genderJsonRaw = fs.readFileSync(
  path.resolve(__dirname, '../../../main/resources/locales/en/translation/gender-details.json'),
  'utf-8'
);
const genderJson = JSON.parse(genderJsonRaw);

const PAGE_URL = '/gender-details';
const titleClass = 'govuk-heading-xl';
const expectedTitle = genderJson.h1;
const radios = 'govuk-radios';
const select = 'govuk-select';
const input = 'govuk-input--width-10';
const option = 'option';

let htmlRes: Document;
describe('Gender details page', () => {
  beforeAll(async () => {
    await request(mockApp({}))
      .get(PAGE_URL)
      .then(res => {
        htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
      });
  });

  it('should display title', () => {
    const title = htmlRes.getElementsByClassName(titleClass);
    expect(title[0].innerHTML).contains(expectedTitle, 'Page title does not exist');
  });

  it('should display 2 sets of radio buttons', () => {
    const radioButtons = htmlRes.getElementsByClassName(radios);
    expect(radioButtons.length).equal(2, `only ${radioButtons.length} found`);
  });

  it('should display an input field for the gender identity', () => {
    const inputField = htmlRes.getElementsByClassName(input);
    expect(inputField.length).equal(2, `only ${inputField.length} found`);
  });

  it('should display a select form element for the preferred title', () => {
    const selectField = htmlRes.getElementsByClassName(select);
    expect(selectField.length).equal(1, `only ${selectField.length} found`);
  });

  it('should display options for the select form', () => {
    const options = htmlRes.getElementsByTagName(option);
    expect(options.length).equal(8, `only ${options.length} found`);
  });
});
