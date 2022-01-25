import { expect } from 'chai';
import { app } from '../../../main/app';
import request from 'supertest';
import fs from 'fs';
import path from 'path';

const PAGE_URL = '/return-to-existing';
const translationRaw = fs.readFileSync(path.resolve(__dirname, '../../../main/resources/locales/en/translation/return-to-existing.json'), 'utf-8');
const returnToClaimJson = JSON.parse(translationRaw);
const commonJsonRaw = fs.readFileSync(path.resolve(__dirname, '../../../main/resources/locales/en/translation/common.json'), 'utf-8');
const commonJsonRawJson = JSON.parse(commonJsonRaw);
const titleClass = 'govuk-heading-xl';
const radioClass = 'govuk-radios__item';
const expectedTitle = returnToClaimJson.h1;
const buttonClass = 'govuk-button';
const expectedRadioLabel1 = returnToClaimJson.optionText1;
const expectedRadioLabel2 = returnToClaimJson.optionText2;
const expectedButtonText = commonJsonRawJson.continue;

let htmlRes: Document;
describe('Return to existing claim page', () => {
  beforeAll(async () => {
    await request(app).get(PAGE_URL).then(res => {
      htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
    });
  });

  it('should display title', () => {
    const title = htmlRes.getElementsByClassName(titleClass);
    expect(title[0].innerHTML).contains(expectedTitle, 'Page title does not exist');
  });

  it('should display save and continue button', () => {
    const button = htmlRes.getElementsByClassName(buttonClass);
    expect(button[0].innerHTML).contains(expectedButtonText, 'Could not find the button');
  });

  it('should display 2 radio buttons', () => {
    const radioButtons = htmlRes.getElementsByClassName(radioClass);
    expect(radioButtons.length).equal(2, '2 radio buttons not found');
  });

  it('should display radio buttons with valid text', () => {
    const radioButtons = htmlRes.getElementsByClassName(radioClass);
    expect(radioButtons[0].innerHTML).contains(expectedRadioLabel1, 'Could not find the radio button with label ' + expectedRadioLabel1);
    expect(radioButtons[1].innerHTML).contains(expectedRadioLabel2, 'Could not find the radio button with label ' + expectedRadioLabel2);
  });
});