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
const expectedP1 =
  'You’ll need to use either a <span class="govuk-!-font-weight-bold">‘save and return number’</span> or your new <span class="govuk-!-font-weight-bold">‘Employment Tribunal account’</span> to return to an existing claim.';
const expectedP2 = returnToClaimJson.p2;
const expectedP3 = 'Don\'t have these details <a href="/checklist?lng=en" class="govuk-link">Start a new claim.</a>';
const buttonClass = 'govuk-button';
const expectedRadioLabel1 = returnToClaimJson.optionText1;
const expectedRadioLabel2 = returnToClaimJson.optionText2;
const expectedRadioLabel3 = returnToClaimJson.optionText3;
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

  it('should display paragraphs with valid text', () => {
    const p = htmlRes.getElementsByClassName(pClass);
    expect(p[6].innerHTML).contains(expectedP1, 'Paragraph does not exist');
    expect(p[7].innerHTML).contains(expectedP2, 'Paragraph does not exist');
    expect(p[8].innerHTML).contains(expectedP3, 'Paragraph does not exist');
  });

  it('should display save and continue button', () => {
    const button = htmlRes.getElementsByClassName(buttonClass);
    expect(button[5].innerHTML).contains(expectedButtonText, 'Could not find the button');
  });

  it('should display 3 radio buttons', () => {
    const radioButtons = htmlRes.getElementsByClassName(radioClass);
    expect(radioButtons.length).equal(3, '3 radio buttons not found');
  });

  it('should display radio buttons with valid text', () => {
    const radioButtons = htmlRes.getElementsByClassName(radioClass);
    expect(radioButtons[0].innerHTML).contains(
      expectedRadioLabel1,
      'Could not find the radio button with label ' + expectedRadioLabel1
    );
    expect(radioButtons[1].innerHTML).contains(
      expectedRadioLabel2,
      'Could not find the radio button with label ' + expectedRadioLabel2
    );
    expect(radioButtons[2].innerHTML).contains(
      expectedRadioLabel3,
      'Could not find the radio button with label ' + expectedRadioLabel3
    );
  });
});
