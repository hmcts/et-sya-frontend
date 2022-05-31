import fs from 'fs';
import path from 'path';

import { expect } from 'chai';
import request from 'supertest';

import { PageUrls } from '../../../main/definitions/constants';
import { mockApp } from '../mocks/mockApp';

const endDateJsonRaw = fs.readFileSync(
  path.resolve(__dirname, '../../../main/resources/locales/en/translation/end-date.json'),
  'utf-8'
);
const endDateJson = JSON.parse(endDateJsonRaw);

const titleClass = 'govuk-heading-xl';
const expectedTitle = endDateJson.h1;
const buttonClass = 'govuk-button';

let htmlRes: Document;
describe('End date page', () => {
  beforeAll(async () => {
    await request(mockApp({}))
      .get(PageUrls.END_DATE)
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
    expect(button[0].innerHTML).contains('continue', 'Could not find the button');
  });
});
