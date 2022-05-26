import fs from 'fs';
import path from 'path';

import { expect } from 'chai';
import request from 'supertest';

import { app } from '../../../main/app';
import { PageUrls } from '../../../main/definitions/constants';

const summariseYourClaimJsonRaw = fs.readFileSync(
  path.resolve(__dirname, '../../../main/resources/locales/en/translation/summarise-your-claim.json'),
  'utf-8'
);
const summairiseYourClaimJson = JSON.parse(summariseYourClaimJsonRaw);

const titleClass = 'govuk-heading-xl';
const detailsClass = 'govuk-details';
const buttonClass = 'govuk-button';
const textInputId = 'claim-summary-text';
const fileUploadId = 'claim-summary-file';
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

  it('should display expandable details section', () => {
    const details = htmlRes.getElementsByClassName(detailsClass);
    expect(details.length).equals(6, 'Incorrect number of expandable details sections');
  });

  it('should display textarea', () => {
    const textarea = htmlRes.getElementById(textInputId);
    expect(textarea.id).equals(textInputId, 'Could not find textarea');
  });

  it('should display file upload', () => {
    const fileUpload = htmlRes.getElementById(fileUploadId);
    expect(fileUpload.id).equals(fileUploadId, 'Could not find file upload');
  });

  it('should display save and continue button', () => {
    const button = htmlRes.getElementsByClassName(buttonClass);
    expect(button[0].innerHTML).contains('Save and continue', 'Could not find the button');
  });

  it('should display Save as draft button', () => {
    const button = htmlRes.getElementsByClassName(buttonClass);
    expect(button[1].innerHTML).contains('Save as draft', 'Could not find the button');
  });
});
