import fs from 'fs';
import path from 'path';

import { expect } from 'chai';
import request from 'supertest';

import { mockApp } from '../mocks/mockApp';

const jsonRaw = fs.readFileSync(
  path.resolve(__dirname, '../../../main/resources/locales/en/translation/remove-additional-claimant.json'),
  'utf-8'
);
const json = JSON.parse(jsonRaw);

const PAGE_URL = '/remove-additional-claimant?index=0';
const expectedTitle = json.h1;

let htmlRes: Document;
describe('Remove other claimant page', () => {
  beforeAll(async () => {
    await request(mockApp({}))
      .get(PAGE_URL)
      .then(res => {
        htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
      });
  });

  it('should display title', () => {
    const body = htmlRes.body.innerHTML;
    expect(body).contains(expectedTitle, 'Page title does not exist');
  });

  it('should display radio buttons', () => {
    const radioButtons = htmlRes.getElementsByClassName('govuk-radios');
    expect(radioButtons.length).equal(1, 'Radio buttons not found');
  });
});
