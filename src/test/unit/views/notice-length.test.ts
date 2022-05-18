import fs from 'fs';
import path from 'path';

import { expect } from 'chai';
import request from 'supertest';

import { WeeksOrMonths } from '../../../main/definitions/case';
import { PageUrls } from '../../../main/definitions/constants';
import { mockApp } from '../mocks/mockApp';

const noticeLengthJsonRaw = fs.readFileSync(
  path.resolve(__dirname, '../../../main/resources/locales/en/translation/notice-length.json'),
  'utf-8'
);
const noticeLengthJson = JSON.parse(noticeLengthJsonRaw);

const titleClass = 'govuk-heading-xl';
const input = 'govuk-input--width-3';
const expectedTitleWeeks = noticeLengthJson.h1.noticeWeeks;
const expectedTitleMonths = noticeLengthJson.h1.noticeMonths;

let htmlRes: Document;
describe('Notice length page - weeks', () => {
  beforeAll(async () => {
    await request(
      mockApp({
        userCase: {
          noticePeriodUnit: WeeksOrMonths.WEEKS,
        },
      })
    )
      .get(PageUrls.NOTICE_LENGTH)
      .then(res => {
        htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
      });
  });

  it('should display title', () => {
    const expectedTitle = expectedTitleWeeks;
    const title = htmlRes.getElementsByClassName(titleClass);
    expect(title[0].innerHTML).contains(expectedTitle, 'Page title does not exist');
  });

  it('should display input field', () => {
    const inputField = htmlRes.getElementsByClassName(input);
    expect(inputField.length).equal(1, `only ${inputField.length} found`);
  });
});

describe('Notice length page - months', () => {
  beforeAll(async () => {
    await request(
      mockApp({
        userCase: {
          noticePeriodUnit: WeeksOrMonths.MONTHS,
        },
      })
    )
      .get(PageUrls.NOTICE_LENGTH)
      .then(res => {
        htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
      });
  });

  it('should display title', () => {
    const expectedTitle = expectedTitleMonths;
    const title = htmlRes.getElementsByClassName(titleClass);
    expect(title[0].innerHTML).contains(expectedTitle, 'Page title does not exist');
  });

  it('should display input field', () => {
    const inputField = htmlRes.getElementsByClassName(input);
    expect(inputField.length).equal(1, `only ${inputField.length} found`);
  });
});
