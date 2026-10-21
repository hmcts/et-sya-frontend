import fs from 'fs';
import path from 'path';

import { expect } from 'chai';
import request from 'supertest';

import { mockApp } from '../mocks/mockApp';

const jsonRaw = fs.readFileSync(
  path.resolve(__dirname, '../../../main/resources/locales/en/translation/additional-claimant-personal-details.json'),
  'utf-8'
);
const json = JSON.parse(jsonRaw);

const PAGE_URL = '/additional-claimant-personal-details';
const titleClass = 'govuk-heading-xl';
const expectedTitle = json.h1;

let htmlRes: Document;
describe('Other claimant personal details page', () => {
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

  it('should display the title input', () => {
    const input = htmlRes.getElementById('additionalClaimantTitle');
    expect(input).to.not.be.null;
  });

  it('should display the first name input', () => {
    const input = htmlRes.getElementById('additionalClaimantFirstName');
    expect(input).to.not.be.null;
  });

  it('should display the last name input', () => {
    const input = htmlRes.getElementById('additionalClaimantLastName');
    expect(input).to.not.be.null;
  });

  it('should display the email input', () => {
    const input = htmlRes.getElementById('additionalClaimantEmail');
    expect(input).to.not.be.null;
  });
});
