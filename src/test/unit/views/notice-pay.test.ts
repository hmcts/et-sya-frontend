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
});
