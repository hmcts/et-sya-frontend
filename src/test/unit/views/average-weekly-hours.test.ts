import fs from 'fs';
import path from 'path';

import { expect } from 'chai';
import request from 'supertest';

import { StillWorking } from '../../../main/definitions/case';
import { PageUrls } from '../../../main/definitions/constants';
import { mockApp } from '../mocks/mockApp';

const averageWeeklyHoursJsonRaw = fs.readFileSync(
  path.resolve(__dirname, '../../../main/resources/locales/en/translation/average-weekly-hours.json'),
  'utf-8'
);
const averageWeeklyHoursJson = JSON.parse(averageWeeklyHoursJsonRaw);

const titleClass = 'govuk-heading-xl';
const buttonClass = 'govuk-button';
const input = 'govuk-input--width-3';

let htmlRes: Document;
describe('Average weekly hours page Still Working', () => {
  beforeAll(async () => {
    await request(
      mockApp({
        userCase: {
          isStillWorking: StillWorking.WORKING,
        },
      })
    )
      .get(PageUrls.AVERAGE_WEEKLY_HOURS)
      .then(res => {
        htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
      });
  });

  it('should display title', () => {
    const expectedTitle = averageWeeklyHoursJson.h1.workingOrNotice;
    const title = htmlRes.getElementsByClassName(titleClass);
    expect(title[0].innerHTML).contains(expectedTitle, 'Page title does not exist');
  });

  it('should display input field', () => {
    const inputField = htmlRes.getElementsByClassName(input);
    expect(inputField.length).equal(1, `only ${inputField.length} found`);
  });

  it('should display continue button', () => {
    const button = htmlRes.getElementsByClassName(buttonClass);
    expect(button[0].innerHTML).contains('continue', 'Could not find the button');
  });
});

describe('Average weekly hours page Notice', () => {
  beforeAll(async () => {
    await request(
      mockApp({
        userCase: {
          isStillWorking: StillWorking.NOTICE,
        },
      })
    )
      .get(PageUrls.AVERAGE_WEEKLY_HOURS)
      .then(res => {
        htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
      });
  });

  it('should display title', () => {
    const expectedTitle = averageWeeklyHoursJson.h1.workingOrNotice;
    const title = htmlRes.getElementsByClassName(titleClass);
    expect(title[0].innerHTML).contains(expectedTitle, 'Page title does not exist');
  });

  it('should display input field', () => {
    const inputField = htmlRes.getElementsByClassName(input);
    expect(inputField.length).equal(1, `only ${inputField.length} found`);
  });

  it('should display continue button', () => {
    const button = htmlRes.getElementsByClassName(buttonClass);
    expect(button[0].innerHTML).contains('continue', 'Could not find the button');
  });
});

describe('Average weekly hours page No Longer Working', () => {
  beforeAll(async () => {
    await request(
      mockApp({
        userCase: {
          isStillWorking: StillWorking.NO_LONGER_WORKING,
        },
      })
    )
      .get(PageUrls.AVERAGE_WEEKLY_HOURS)
      .then(res => {
        htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
      });
  });

  it('should display title', () => {
    const expectedTitle = averageWeeklyHoursJson.h1.noLongerWorking;
    const title = htmlRes.getElementsByClassName(titleClass);
    expect(title[0].innerHTML).contains(expectedTitle, 'Page title does not exist');
  });

  it('should display input field', () => {
    const inputField = htmlRes.getElementsByClassName(input);
    expect(inputField.length).equal(1, `only ${inputField.length} found`);
  });

  it('should display continue button', () => {
    const button = htmlRes.getElementsByClassName(buttonClass);
    expect(button[0].innerHTML).contains('continue', 'Could not find the button');
  });
});
