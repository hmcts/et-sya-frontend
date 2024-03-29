import fs from 'fs';
import path from 'path';

import { expect } from 'chai';
import request from 'supertest';

import { StillWorking } from '../../../main/definitions/case';
import { PageUrls } from '../../../main/definitions/constants';
import { mockApp } from '../mocks/mockApp';

const noticePeriodWorkingJsonRaw = fs.readFileSync(
  path.resolve(__dirname, '../../../main/resources/locales/en/translation/notice-period-working.json'),
  'utf-8'
);
const noticePeriodNoLongerWorkingJsonRaw = fs.readFileSync(
  path.resolve(__dirname, '../../../main/resources/locales/en/translation/notice-period-no-longer-working.json'),
  'utf-8'
);
const noticePeriodWorkingJson = JSON.parse(noticePeriodWorkingJsonRaw);
const noticePeriodNoLongerWorkingJson = JSON.parse(noticePeriodNoLongerWorkingJsonRaw);

const titleClass = 'govuk-fieldset__legend';
const expectedTitleWorkingOrNotice = noticePeriodWorkingJson.legend;
const expectedTitleNoLongerWorking = noticePeriodNoLongerWorkingJson.legend;
const radios = 'govuk-radios';
const buttonClass = 'govuk-button';

let htmlRes: Document;
describe('Notice period page', () => {
  beforeAll(async () => {
    await request(
      mockApp({
        userCase: {
          isStillWorking: StillWorking.WORKING || StillWorking.NOTICE || StillWorking.NO_LONGER_WORKING,
        },
      })
    )
      .get(PageUrls.NOTICE_PERIOD)
      .then(res => {
        htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
      });
  });

  it('should display correct radio buttons', () => {
    const radioButtons = htmlRes.getElementsByClassName(radios);
    expect(radioButtons.length).equal(1, `only ${radioButtons.length} found`);
  });

  it('should display save and continue button', () => {
    const button = htmlRes.getElementsByClassName(buttonClass);
    expect(button[5].innerHTML).contains('Save and continue', 'Could not find the button');
  });

  it('should display Save as draft button', () => {
    const button = htmlRes.getElementsByClassName(buttonClass);
    expect(button[6].innerHTML).contains('Save as draft', 'Could not find the button');
  });
});

describe('Notice period - still working or notice', () => {
  beforeAll(async () => {
    await request(
      mockApp({
        userCase: {
          isStillWorking: StillWorking.WORKING || StillWorking.NOTICE,
        },
      })
    )
      .get(PageUrls.NOTICE_PERIOD)
      .then(res => {
        htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
      });
  });

  it('should display correct title', () => {
    const title = htmlRes.getElementsByClassName(titleClass);
    expect(title[0].innerHTML).contains(expectedTitleWorkingOrNotice, 'Page title does not exist');
  });
});

describe('Notice period - no longer working', () => {
  beforeAll(async () => {
    await request(
      mockApp({
        userCase: {
          isStillWorking: StillWorking.NO_LONGER_WORKING,
        },
      })
    )
      .get(PageUrls.NOTICE_PERIOD)
      .then(res => {
        htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
      });
  });

  it('should display correct title', () => {
    const title = htmlRes.getElementsByClassName(titleClass);
    expect(title[0].innerHTML).contains(expectedTitleNoLongerWorking, 'Page title does not exist');
  });
});
