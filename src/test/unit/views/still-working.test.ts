import fs from 'fs';
import path from 'path';

import { expect } from 'chai';
import request from 'supertest';

import { app } from '../../../main/app';
import { PageUrls } from '../../../main/definitions/constants';

const stillWorkingJsonRaw = fs.readFileSync(
  path.resolve(__dirname, '../../../main/resources/locales/en/translation/still-working.json'),
  'utf-8'
);
const stillWorkingJson = JSON.parse(stillWorkingJsonRaw);

const titleClass = 'govuk-heading-xl';
const expectedTitle = stillWorkingJson.h1;
const radios = 'govuk-radios__item';
const expectedRadioLabel1 = stillWorkingJson.optionText1;
const expectedRadioLabel2 = stillWorkingJson.optionText2;
const expectedRadioLabel3 = stillWorkingJson.optionText3;
const buttonClass = 'govuk-button';

let htmlRes: Document;

describe('Are you still working page', () => {
  beforeAll(async () => {
    await request(app)
      .get(PageUrls.STILL_WORKING)
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
    expect(radioButtons.length).equal(3, 'radio buttons not found');
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
    expect(radioButtons[2].innerHTML).contains(
      expectedRadioLabel3,
      'Could not find the radio button with label ' + expectedRadioLabel3
    );
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
