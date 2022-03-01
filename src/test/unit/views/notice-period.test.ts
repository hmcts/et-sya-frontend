import fs from 'fs';
import path from 'path';

import { expect } from 'chai';
import request from 'supertest';

import { app } from '../../../main/app';
import { PageUrls } from '../../../main/definitions/constants';

const noticePeriodJsonRaw = fs.readFileSync(
  path.resolve(__dirname, '../../../main/resources/locales/en/translation/notice-period.json'),
  'utf-8'
);
const noticePeriodJson = JSON.parse(noticePeriodJsonRaw);

const titleClass = 'govuk-heading-xl';
const expectedTitle = noticePeriodJson.h1;
const radios = 'govuk-radios';
const input = 'govuk-input--width-2';

let htmlRes: Document;
describe('Have you got a notice period?', () => {
  beforeAll(async () => {
    await request(app)
      .get(PageUrls.NOTICE_PERIOD)
      .then(res => {
        htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
      });
  });

  it('should display correct heading', () => {
    const title = htmlRes.getElementsByClassName(titleClass);
    expect(title[0].innerHTML).contains(expectedTitle, 'Page title does not exist');
  });

  it('should display correct radio buttons', () => {
    const radioButtons = htmlRes.getElementsByClassName(radios);
    expect(radioButtons.length).equal(2, `only ${radioButtons.length} found`);
  });

  it('should display correct input field', () => {
    const inputField = htmlRes.getElementsByClassName(input);
    expect(inputField.length).equal(1, `only ${inputField.length} found`);
  });
});
