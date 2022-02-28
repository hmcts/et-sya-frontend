import fs from 'fs';
import path from 'path';

import { expect } from 'chai';
import request from 'supertest';

import { app } from '../../../main/app';
import { PageUrls } from '../../../main/definitions/constants';

const claimStepsJsonRaw = fs.readFileSync(
  path.resolve(__dirname, '../../../main/resources/locales/en/translation/steps-to-making-your-claim.json'),
  'utf-8'
);
const claimStepsJson = JSON.parse(claimStepsJsonRaw);

const titleClass = 'govuk-heading-xl';
const expectedTitle = claimStepsJson.h1;

let htmlRes: Document;
describe('Claim steps page', () => {
  beforeAll(async () => {
    await request(app)
      .get(PageUrls.CLAIM_STEPS)
      .then(res => {
        htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
      });
  });

  it('should display title', () => {
    const title = htmlRes.getElementsByClassName(titleClass);
    expect(title[0].innerHTML).contains(expectedTitle, 'Page title does not exist');
  });
});
