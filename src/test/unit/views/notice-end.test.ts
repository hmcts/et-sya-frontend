import fs from 'fs';
import path from 'path';

import { expect } from 'chai';
import request from 'supertest';

import { PageUrls } from '../../../main/definitions/constants';
import { mockApp } from '../mocks/mockApp';

const noticeEndJsonRaw = fs.readFileSync(
  path.resolve(__dirname, '../../../main/resources/locales/en/translation/notice-end.json'),
  'utf-8'
);
const noticeEndJson = JSON.parse(noticeEndJsonRaw);

const titleClass = 'govuk-heading-xl';
const expectedTitle = noticeEndJson.h1;
const expectedHint = noticeEndJson.hint;
const buttonId = 'main-form-submit';
const dateFieldClass = 'govuk-date-input__item';

let htmlRes: Document;
describe('Notice end page', () => {
  beforeAll(async () => {
    await request(mockApp({}))
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

  it('should display hint', () => {
    const hint = htmlRes.getElementsByClassName('govuk-hint');
    expect(hint[0].innerHTML).contains(expectedHint, 'hint text not found');
  });

  it('should display save and continue button', () => {
    const button = htmlRes.getElementById(buttonId);
    expect(button.innerHTML).contains('Save and continue', 'Save and continue');
  });
});
