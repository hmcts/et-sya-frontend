import fs from 'fs';
import path from 'path';

import { expect } from 'chai';
import request from 'supertest';

import { mockApp } from '../mocks/mockApp';

const sexAndTitleJsonRaw = fs.readFileSync(
  path.resolve(__dirname, '../../../main/resources/locales/en/translation/sex-and-title.json'),
  'utf-8'
);
const sexAndTitleJson = JSON.parse(sexAndTitleJsonRaw);

const PAGE_URL = '/sex-and-title';
const titleClass = 'govuk-heading-xl';
const expectedTitle = sexAndTitleJson.h1;
const radios = 'govuk-radios';
const input = 'govuk-input--width-10';

let htmlRes: Document;
describe('Sex and preferred title page', () => {
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

  it('should display radio buttons', () => {
    const radioButtons = htmlRes.getElementsByClassName(radios);
    expect(radioButtons.length).equal(1, `only ${radioButtons.length} found`);
  });

  it('should display an input field for the title', () => {
    const inputField = htmlRes.getElementsByClassName(input);
    expect(inputField.length).equal(1, `only ${inputField.length} found`);
  });
});
