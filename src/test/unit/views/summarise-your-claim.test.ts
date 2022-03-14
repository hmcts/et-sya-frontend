import fs from 'fs';
import path from 'path';

import { expect } from 'chai';
import request from 'supertest';

import { app } from '../../../main/app';
import { PageUrls } from '../../../main/definitions/constants';

const summairiseYourClaimJsonRaw = fs.readFileSync(
  path.resolve(__dirname, '../../../main/resources/locales/en/translation/summarise-your-claim.json'),
  'utf-8'
);
const summairiseYourClaimJson = JSON.parse(summairiseYourClaimJsonRaw);

const titleClass = 'govuk-heading-xl';
const expectedTitle = summairiseYourClaimJson.h1;

let htmlRes: Document;
describe('Summarise Your Claim page', () => {
  beforeAll(async () => {
    await request(app)
      .get(PageUrls.SUMMARISE_YOUR_CLAIM)
      .then(res => {
        htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
      });
  });

  it('should display title', () => {
    const title = htmlRes.getElementsByClassName(titleClass);
    expect(title[0].innerHTML).contains(expectedTitle, 'Page title does not exist');
  });
});
