import fs from 'fs';
import path from 'path';

import { expect } from 'chai';
import request from 'supertest';

import { app } from '../../../main/app';

const genderJsonRaw = fs.readFileSync(
  path.resolve(__dirname, '../../../main/resources/locales/en/translation/gender-details.json'),
  'utf-8'
);
const genderJson = JSON.parse(genderJsonRaw);

const PAGE_URL = '/gender-details';
const titleClass = 'govuk-heading-xl';
const expectedTitle = genderJson.h1;

let htmlRes: Document;
describe('Gender details page', () => {
  beforeAll(async () => {
    await request(app)
      .get(PAGE_URL)
      .then(res => {
        htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
      });
  });

  it('should display title', () => {
    const title = htmlRes.getElementsByClassName(titleClass);
    expect(title[0].innerHTML).contains(expectedTitle, 'Page title does not exist');
  });
});
