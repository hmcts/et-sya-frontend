import fs from 'fs';
import path from 'path';

import { expect } from 'chai';
import request from 'supertest';

import { mockApp } from '../mocks/mockApp';

const jsonRaw = fs.readFileSync(
  path.resolve(__dirname, '../../../main/resources/locales/en/translation/review-additional-claimants.json'),
  'utf-8'
);
const json = JSON.parse(jsonRaw);

const PAGE_URL = '/review-additional-claimants';
const titleClass = 'govuk-heading-xl';
const expectedTitle = json.h1;

let htmlRes: Document;
describe('Review other claimants page', () => {
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

  it('should display radio buttons for add another claimant', () => {
    const radioButtons = htmlRes.getElementsByClassName('govuk-radios--inline');
    expect(radioButtons.length).equal(1, 'Radio buttons not found');
  });

  it('should display spreadsheet option link after p2', () => {
    const link = htmlRes.querySelector('a[href^="/add-another-claimant"]');
    expect(link).to.not.equal(null, 'Spreadsheet option link not found');
  });
});
