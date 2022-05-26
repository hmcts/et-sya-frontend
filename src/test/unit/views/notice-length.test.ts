import fs from 'fs';
import path from 'path';

import { expect } from 'chai';
import request from 'supertest';

import { StillWorking, WeeksOrMonths } from '../../../main/definitions/case';
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
const expectedTitleWeeksNonNotice = noticeLengthJson.h1.nonNoticeWeeks;
const expectedTitleMonthsNonNotice = noticeLengthJson.h1.nonNoticeMonths;

let htmlRes: Document;
describe('Notice length page - weeks - on notice', () => {
  beforeAll(async () => {
    await request(
      mockApp({
        userCase: {
          isStillWorking: StillWorking.NOTICE,
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

describe('Notice length page - months - on notice', () => {
  beforeAll(async () => {
    await request(
      mockApp({
        userCase: {
          isStillWorking: StillWorking.NOTICE,
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

describe('Notice length page - weeks - not on notice', () => {
  beforeAll(async () => {
    await request(
      mockApp({
        userCase: {
          isStillWorking: StillWorking.WORKING || StillWorking.NO_LONGER_WORKING,
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
    const expectedTitle = expectedTitleWeeksNonNotice;
    const title = htmlRes.getElementsByClassName(titleClass);
    expect(title[0].innerHTML).contains(expectedTitle, 'Page title does not exist');
  });

  it('should display input field', () => {
    const inputField = htmlRes.getElementsByClassName(input);
    expect(inputField.length).equal(1, `only ${inputField.length} found`);
  });
});

describe('Notice length page - months - not on notice', () => {
  beforeAll(async () => {
    await request(
      mockApp({
        userCase: {
          isStillWorking: StillWorking.WORKING || StillWorking.NO_LONGER_WORKING,
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
    const expectedTitle = expectedTitleMonthsNonNotice;
    const title = htmlRes.getElementsByClassName(titleClass);
    expect(title[0].innerHTML).contains(expectedTitle, 'Page title does not exist');
  });

  it('should display input field', () => {
    const inputField = htmlRes.getElementsByClassName(input);
    expect(inputField.length).equal(1, `only ${inputField.length} found`);
  });
});
