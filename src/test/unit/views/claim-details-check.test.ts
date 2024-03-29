import fs from 'fs';
import path from 'path';

import { expect } from 'chai';
import request from 'supertest';

import { PageUrls } from '../../../main/definitions/constants';
import { mockApp } from '../mocks/mockApp';

const claimDetailsCheckJsonRaw = fs.readFileSync(
  path.resolve(__dirname, '../../../main/resources/locales/en/translation/claim-details-check.json'),
  'utf-8'
);
const claimDetailsCheckJson = JSON.parse(claimDetailsCheckJsonRaw);

const titleClass = 'govuk-fieldset__legend';
const expectedTitle = claimDetailsCheckJson.heading;
const radios = 'govuk-radios__item';
const expectedRadioLabel1 = claimDetailsCheckJson.yes;
const expectedRadioLabel2 = claimDetailsCheckJson.no;
const buttonClass = 'govuk-button';

let htmlRes: Document;

describe('Claim details check page', () => {
  beforeAll(async () => {
    await request(mockApp({}))
      .get(PageUrls.CLAIM_DETAILS_CHECK)
      .then(res => {
        htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
      });
  });
  it('should display title', () => {
    const title = htmlRes.getElementsByClassName(titleClass);
    expect(title[0].innerHTML).contains(expectedTitle, 'Page title does not exist');
  });

  it('should display radio buttons', () => {
    const radioButtons = htmlRes.getElementsByClassName(radios);
    expect(radioButtons.length).equal(2, 'radio buttons not found');
  });

  it('should display radio buttons with valid text', () => {
    const radioButtons = htmlRes.getElementsByClassName(radios);
    expect(radioButtons[0].innerHTML).contains(
      expectedRadioLabel1,
      'Could not find the radio button with label ' + expectedRadioLabel1
    );
    expect(radioButtons[1].innerHTML).contains(
      expectedRadioLabel2,
      'Could not find the radio button with label ' + expectedRadioLabel2
    );
  });

  it('should display save and continue button', () => {
    const button = htmlRes.getElementsByClassName(buttonClass);
    expect(button[5].innerHTML).contains('Save and continue', 'Could not find the button');
  });

  it('should display Save as draft button', () => {
    const button = htmlRes.getElementsByClassName(buttonClass);
    expect(button[6].innerHTML).contains('Save as draft', 'Could not find the button');
  });
});
