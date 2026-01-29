import fs from 'fs';
import path from 'path';

import { expect } from 'chai';
import request from 'supertest';

import { app } from '../../../main/app';
import { PageUrls } from '../../../main/definitions/constants';

const yourDetailsFormJsonRaw = fs.readFileSync(
  path.resolve(__dirname, '../../../main/resources/locales/en/translation/your-details-form.json'),
  'utf-8'
);
const yourDetailsFormJson = JSON.parse(yourDetailsFormJsonRaw);

const titleClass = 'govuk-heading-xl';
const pClass = 'govuk-body';
const buttonClass = 'govuk-button';

let htmlRes: Document;

describe('Your details form page', () => {
  beforeAll(async () => {
    await request(app)
      .get(PageUrls.YOUR_DETAILS_FORM)
      .then(res => {
        htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
      });
  });

  it('should display title', () => {
    const title = htmlRes.getElementsByClassName(titleClass);
    expect(title[0].innerHTML).contains(yourDetailsFormJson.pageTitle, 'Page title does not exist');
  });

  it('should display first paragraph', () => {
    const p = htmlRes.getElementsByClassName(pClass);
    expect(p[6].innerHTML).contains(yourDetailsFormJson.p1, 'P1 does not exist');
  });

  it('should display submission reference input', () => {
    const input = htmlRes.getElementById('submissionReference');
    expect(input).to.exist;
  });

  it('should display claimant name input', () => {
    const input = htmlRes.getElementById('claimantName');
    expect(input).to.exist;
  });

  it('should display continue button', () => {
    const button = htmlRes.getElementsByClassName(buttonClass);
    expect(button[5].innerHTML).contains('Continue', 'Could not find the button');
  });
});
