import { expect } from 'chai';
import { app } from '../../../main/app';
import request from 'supertest';

import fs from 'fs';
import path from 'path';

const updatePreferenceJsonRaw = fs.readFileSync(path.resolve(__dirname, '../../../main/resources/locales/en/translation/update-preference.json'), 'utf-8');
const updatePreferenceJson = JSON.parse(updatePreferenceJsonRaw);

const PAGE_URL = '/how-would-you-like-to-be-updated-about-your-claim';
const titleClass = 'govuk-heading-xl';
const expectedTitle = updatePreferenceJson.h1;
const buttonClass = 'govuk-button-group';
const radioClass = 'govuk-radios__item';
const expectedRadioLabel1 = 'Email';
const expectedRadioLabel2 = 'Post';

let htmlRes: Document;
describe('Update preferences page', () => {
  beforeAll(async () => {
    await request(app).get(PAGE_URL).then(res => {
      htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
    });
  });

  it('should display title', () => {
    const title = htmlRes.getElementsByClassName(titleClass);
    expect(title[0].innerHTML).contains(expectedTitle, 'Page title does not exist');
  });

  it('should display Save and continue button', () => {
    const button = htmlRes.getElementsByClassName(buttonClass);
    expect(button[0].innerHTML).contains('Save and continue', 'Could not find the button');
  });

  it('should display Save for later button', () => {
    const button = htmlRes.getElementsByClassName(buttonClass);
    expect(button[0].innerHTML).contains('Save for later', 'Could not find the button');
  });

  it('should display 2 radio buttons', () => {
    const radioButtons = htmlRes.getElementsByClassName(radioClass);
    expect(radioButtons.length).equal(2, '2 radio buttons not found');
  });

  it('should display radio buttons with valid text',  () => {
    const radioButtons = htmlRes.getElementsByClassName(radioClass);
    expect(radioButtons[0].innerHTML).contains(expectedRadioLabel1, 'Could not find the radio button with label ' + expectedRadioLabel1);
    expect(radioButtons[1].innerHTML).contains(expectedRadioLabel2, 'Could not find the radio button with label ' + expectedRadioLabel2);
  });

});
