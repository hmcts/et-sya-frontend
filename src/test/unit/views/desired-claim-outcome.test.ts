import fs from 'fs';
import path from 'path';

import { expect } from 'chai';
import request from 'supertest';

import { app } from '../../../main/app';
import { PageUrls } from '../../../main/definitions/constants';

const desiredClaimOutcomeJsonRaw = fs.readFileSync(
  path.resolve(__dirname, '../../../main/resources/locales/en/translation/desired-claim-outcome.json'),
  'utf-8'
);
const desiredClaimOutcomeJson = JSON.parse(desiredClaimOutcomeJsonRaw);

const titleClass = 'govuk-heading-xl';
const expectedTitle = desiredClaimOutcomeJson.h1;

let htmlRes: Document;
describe('Desired Claim Outcome page', () => {
  beforeAll(async () => {
    await request(app)
      .get(PageUrls.DESIRED_CLAIM_OUTCOME)
      .then(res => {
        htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
      });
  });

  it('should display title', () => {
    const title = htmlRes.getElementsByClassName(titleClass);
    expect(title[0].innerHTML).contains(expectedTitle, 'Page title does not exist');
  });
});
