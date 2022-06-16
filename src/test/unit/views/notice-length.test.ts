import fs from 'fs';
import path from 'path';

import { expect } from 'chai';
import request from 'supertest';

import { StillWorking, WeeksOrMonths } from '../../../main/definitions/case';
import { PageUrls } from '../../../main/definitions/constants';
import { mockApp } from '../mocks/mockApp';

const noticeLengthWeeksJsonRaw = fs.readFileSync(
  path.resolve(__dirname, '../../../main/resources/locales/en/translation/notice-length-weeks.json'),
  'utf-8'
);
const noticeLengthMonthsJsonRaw = fs.readFileSync(
  path.resolve(__dirname, '../../../main/resources/locales/en/translation/notice-length-months.json'),
  'utf-8'
);
const noticeLengthWeeksJson = JSON.parse(noticeLengthWeeksJsonRaw);
const noticeLengthMonthsJson = JSON.parse(noticeLengthMonthsJsonRaw);

const titleClass = 'govuk-heading-xl';
const input = 'govuk-input--width-3';
const expectedTitleWeeksNotice = noticeLengthWeeksJson.h1.notice;
const expectedTitleMonthsNotice = noticeLengthMonthsJson.h1.notice;
const expectedTitleWeeksNonNotice = noticeLengthWeeksJson.h1.nonNotice;
const expectedTitleMonthsNonNotice = noticeLengthMonthsJson.h1.nonNotice;

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
    const expectedTitle = expectedTitleWeeksNotice;
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
    const expectedTitle = expectedTitleMonthsNotice;
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
