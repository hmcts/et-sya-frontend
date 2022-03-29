import fs from 'fs';
import path from 'path';

import { expect } from 'chai';
import request from 'supertest';

import { StillWorking } from '../../../main/definitions/case';
import { PageUrls } from '../../../main/definitions/constants';
import { mockApp } from '../mocks/mockApp';

const payBeforeTaxJsonRaw = fs.readFileSync(
  path.resolve(__dirname, '../../../main/resources/locales/en/translation/pay-before-tax.json'),
  'utf-8'
);
const payBeforeTaxJson = JSON.parse(payBeforeTaxJsonRaw);

const titleClass = 'govuk-heading-xl';
const buttonClass = 'govuk-button';

let htmlRes: Document;
describe('Pay before tax page - Still Working', () => {
  beforeAll(async () => {
    await request(
      mockApp({
        userCase: {
          isStillWorking: StillWorking.WORKING,
        },
      })
    )
      .get(PageUrls.PAY_BEFORE_TAX)
      .then(res => {
        htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
      });
  });

  it('should display title', () => {
    const expectedTitle = payBeforeTaxJson.h1.workingOrNotice;
    const title = htmlRes.getElementsByClassName(titleClass);
    expect(title[0].innerHTML).contains(expectedTitle, 'Page title does not exist');
  });

  it('should display continue button', () => {
    const button = htmlRes.getElementsByClassName(buttonClass);
    expect(button[0].innerHTML).contains('continue', 'Could not find the button');
  });
});

describe('Pay before tax page - Notice', () => {
  beforeAll(async () => {
    await request(
      mockApp({
        userCase: {
          isStillWorking: StillWorking.NOTICE,
        },
      })
    )
      .get(PageUrls.PAY_BEFORE_TAX)
      .then(res => {
        htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
      });
  });

  it('should display title', () => {
    const expectedTitle = payBeforeTaxJson.h1.workingOrNotice;
    const title = htmlRes.getElementsByClassName(titleClass);
    expect(title[0].innerHTML).contains(expectedTitle, 'Page title does not exist');
  });
});

describe('Pay before tax page - No Longer Working', () => {
  beforeAll(async () => {
    await request(
      mockApp({
        userCase: {
          isStillWorking: StillWorking.NO_LONGER_WORKING,
        },
      })
    )
      .get(PageUrls.PAY_BEFORE_TAX)
      .then(res => {
        htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
      });
  });

  it('should display title', () => {
    const expectedTitle = payBeforeTaxJson.h1.noLongerWorking;
    const title = htmlRes.getElementsByClassName(titleClass);
    expect(title[0].innerHTML).contains(expectedTitle, 'Page title does not exist');
  });
});
