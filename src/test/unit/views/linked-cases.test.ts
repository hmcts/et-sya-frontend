import fs from 'fs';
import path from 'path';

import { expect } from 'chai';
import request from 'supertest';

import { PageUrls } from '../../../main/definitions/constants';
import { mockApp } from '../mocks/mockApp';

const linkedCasesJsonRaw = fs.readFileSync(
  path.resolve(__dirname, '../../../main/resources/locales/en/translation/linked-cases.json'),
  'utf-8'
);
const linkedCasesJson = JSON.parse(linkedCasesJsonRaw);

const titleClass = 'govuk-heading-xl';
const expectedTitle = linkedCasesJson.h1;
const buttonClass = 'govuk-button';
const inputs = 'govuk-radios__item';

let htmlRes: Document;
describe('Linked Cases page', () => {
  beforeAll(async () => {
    await request(mockApp({}))
      .get(PageUrls.LINKED_CASES)
      .then(res => {
        htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
      });
  });

  it('should display page heading', () => {
    const title = htmlRes.getElementsByClassName(titleClass);
    expect(title[0].innerHTML).contains(expectedTitle, 'Page title does not exist');
  });

  it('should display save and continue button', () => {
    const button = htmlRes.getElementsByClassName(buttonClass);
    expect(button[5].innerHTML).contains('Save and continue', 'Could not find the button');
  });

  it('should display radios', () => {
    const radios = htmlRes.getElementsByClassName(inputs);
    expect(radios.length).equal(2, `only ${radios.length} found`);
  });
});
