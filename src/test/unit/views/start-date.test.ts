import fs from 'fs';
import path from 'path';

import { expect } from 'chai';
import request from 'supertest';

import { StillWorking } from '../../../main/definitions/case';
import { PageUrls } from '../../../main/definitions/constants';
import { mockApp } from '../mocks/mockApp';

const startDateJsonRaw = fs.readFileSync(
  path.resolve(__dirname, '../../../main/resources/locales/en/translation/start-date.json'),
  'utf-8'
);
const startDateJson = JSON.parse(startDateJsonRaw);

const titleClass = 'govuk-heading-xl';
const paragraphClass = 'govuk-body';
const expectedTitle = startDateJson.h1;
const buttonClass = 'govuk-button';

let htmlRes: Document;
describe('Start date page', () => {
  beforeAll(async () => {
    await request(
      mockApp({
        userCase: {
          isStillWorking: StillWorking.WORKING,
        },
      })
    )
      .get(PageUrls.START_DATE)
      .then(res => {
        htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
      });
  });

  it('should display title', () => {
    const title = htmlRes.getElementsByClassName(titleClass);
    expect(title[0].innerHTML).contains(expectedTitle, 'Page title does not exist');
  });

  it('should display continue button', () => {
    const button = htmlRes.getElementsByClassName(buttonClass);
    expect(button[0].innerHTML).contains('continue', 'Could not find the button');
  });

  describe('Start date page - Notice', () => {
    beforeAll(async () => {
      await request(
        mockApp({
          userCase: {
            isStillWorking: StillWorking.NOTICE,
          },
        })
      )
        .get(PageUrls.START_DATE)
        .then(res => {
          htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
        });
    });

    it('should display working or notice paragraph 1 text', () => {
      const expectedP1 = startDateJson.p1.workingOrNotice;
      const paragraph = htmlRes.getElementsByClassName(paragraphClass);
      expect(paragraph[0].innerHTML).contains(expectedP1, 'Page title does not exist');
    });
  });

  describe('Start date page - No longer working', () => {
    beforeAll(async () => {
      await request(
        mockApp({
          userCase: {
            isStillWorking: StillWorking.NO_LONGER_WORKING,
          },
        })
      )
        .get(PageUrls.START_DATE)
        .then(res => {
          htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
        });
    });

    it('should display no longer working paragraph 1 text', () => {
      const expectedP1 = startDateJson.p1.noLongerWorking;
      const paragraph = htmlRes.getElementsByClassName(paragraphClass);
      expect(paragraph[0].innerHTML).contains(expectedP1, 'Page title does not exist');
    });
  });
});
