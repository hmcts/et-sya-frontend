import fs from 'fs';
import path from 'path';

import { expect } from 'chai';
import request from 'supertest';

import { app } from '../../../main/app';
import { PageUrls } from '../../../main/definitions/constants';

const noticeEndJsonRaw = fs.readFileSync(
  path.resolve(__dirname, '../../../main/resources/locales/en/translation/notice-end.json'),
  'utf-8'
);
const noticeEndJson = JSON.parse(noticeEndJsonRaw);

const titleClass = 'govuk-heading-xl';
const expectedTitle = noticeEndJson.h1;
const buttonId = 'main-form-submit';
const dateFieldClass = 'govuk-date-input__item';

let htmlRes: Document;
describe('Notice end page', () => {
  beforeAll(async () => {
    await request(app)
      .get(PageUrls.NOTICE_END)
      .then(res => {
        htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
      });
  });

  it('should display title', () => {
    const title = htmlRes.getElementsByClassName(titleClass);
    expect(title[0].innerHTML).contains(expectedTitle, 'When does your notice period end?');
  });

  it('should display date input fields', () => {
    const dateFields = htmlRes.getElementsByClassName(dateFieldClass);
    expect(dateFields.length).equal(3, `only ${dateFields.length} found`);
  });

  it('should display save and continue button', () => {
    const button = htmlRes.getElementById(buttonId);
    console.log(`Button name is ${button.innerHTML}`);
    expect(button.innerHTML).contains('Save and continue', 'Save and continue');
  });
});
