import fs from 'fs';
import path from 'path';

import { expect } from 'chai';
import request from 'supertest';

import { mockApp } from '../mocks/mockApp';

const PAGE_URL = '/return-to-existing';
const translationRaw = fs.readFileSync(
  path.resolve(__dirname, '../../../main/resources/locales/en/translation/return-to-existing.json'),
  'utf-8'
);
const returnToClaimJson = JSON.parse(translationRaw);
const commonJsonRaw = fs.readFileSync(
  path.resolve(__dirname, '../../../main/resources/locales/en/translation/common.json'),
  'utf-8'
);
const commonJsonRawJson = JSON.parse(commonJsonRaw);
const titleClass = 'govuk-heading-xl';
const radioClass = 'govuk-radios__item';
const expectedTitle = returnToClaimJson.h1;
const pClass = 'govuk-body';
const expectedDraftHeading = returnToClaimJson.draftHeading;
const expectedDraftIntro = returnToClaimJson.draftIntro;
const expectedSubmittedHeading = returnToClaimJson.submittedHeading;
const buttonClass = 'govuk-button';
const expectedRadioLabel1 = returnToClaimJson.optionText1;
const expectedRadioLabel2 = returnToClaimJson.optionText2;
const expectedButtonText = commonJsonRawJson.continue;

let htmlRes: Document;
describe('Return to existing claim page', () => {
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

  it('should display draft heading paragraph', () => {
    const p = htmlRes.getElementsByClassName(pClass);
    expect(p[6].innerHTML).contains(expectedDraftHeading, 'Draft heading does not exist');
  });

  it('should display draft intro paragraph', () => {
    const p = htmlRes.getElementsByClassName(pClass);
    expect(p[7].innerHTML).contains(expectedDraftIntro, 'Draft intro paragraph does not exist');
  });

  it('should display submitted claim heading', () => {
    const p = htmlRes.getElementsByClassName(pClass);
    expect(p[8].innerHTML).contains(expectedSubmittedHeading, 'Submitted heading does not exist');
  });

  it('should display save and continue button', () => {
    const button = htmlRes.getElementsByClassName(buttonClass);
    expect(button[5].innerHTML).contains(expectedButtonText, 'Could not find the button');
  });

  it('should display 6 radio buttons (2 top-level and 2 sub-options each)', () => {
    const radioButtons = htmlRes.getElementsByClassName(radioClass);
    expect(radioButtons.length).equal(6, '6 radio buttons not found');
  });

  it('should display top-level radio buttons with valid text', () => {
    const radioButtons = htmlRes.getElementsByClassName(radioClass);
    expect(radioButtons[0].innerHTML).contains(
      expectedRadioLabel1,
      'Could not find the radio button with label ' + expectedRadioLabel1
    );
    expect(radioButtons[3].innerHTML).contains(
      expectedRadioLabel2,
      'Could not find the radio button with label ' + expectedRadioLabel2
    );
  });
});
