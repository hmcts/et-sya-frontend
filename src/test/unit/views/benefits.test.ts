import fs from 'fs';
import path from 'path';

import { expect } from 'chai';
import request from 'supertest';

import { app } from '../../../main/app';
import { PageUrls } from '../../../main/definitions/constants';

const benefitsJsonRaw = fs.readFileSync(
  path.resolve(__dirname, '../../../main/resources/locales/en/translation/benefits.json'),
  'utf-8'
);
const benefitsJson = JSON.parse(benefitsJsonRaw);

const titleClass = 'govuk-heading-xl';
const expectedTitle = benefitsJson.h1;
const buttonClass = 'govuk-button';

let htmlRes: Document;
describe('Benefits page', () => {
  beforeAll(async () => {
    await request(app)
      .get(PageUrls.BENEFITS)
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
