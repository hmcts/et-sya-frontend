import fs from 'fs';
import path from 'path';

import { expect } from 'chai';
import request from 'supertest';

import { app } from '../../../main/app';
import { PageUrls } from '../../../main/definitions/constants';

const noticePayJsonRaw = fs.readFileSync(
  path.resolve(__dirname, '../../../main/resources/locales/en/translation/notice-pay.json'),
  'utf-8'
);
const noticePayJson = JSON.parse(noticePayJsonRaw);

const titleClass = 'govuk-heading-xl';
const expectedTitle = noticePayJson.h1;
const buttonId = 'main-form-submit';
const noticePayInputFieldClass = 'govuk-input govuk-input--width-2';
const radioButtonLabels = 'govuk-label govuk-radios__label';
let htmlRes: Document;

describe('Notice pay page', () => {
  beforeAll(async () => {
    await request(app)
      .get(PageUrls.NOTICE_PAY)
      .then(res => {
        htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
      });
  });

  it('should display title', () => {
    const title = htmlRes.getElementsByClassName(titleClass);
    expect(title[0].innerHTML).contains(expectedTitle, 'Are you getting paid for working your notice period?');
  });

  it('should display continue button', () => {
    const button = htmlRes.getElementById(buttonId);
    expect(button.innerHTML).contains('Save and continue', 'Save and continue');
  });

  it('should display yes or no radios', () => {
    const radioLabels = htmlRes.getElementsByClassName(radioButtonLabels);
    expect(radioLabels.length).equals(6);
  });

  it('should display first hint when user click yes', () => {
    const inputFields = htmlRes.getElementsByClassName(noticePayInputFieldClass);
    expect(inputFields.length).equals(2);
  });
});
