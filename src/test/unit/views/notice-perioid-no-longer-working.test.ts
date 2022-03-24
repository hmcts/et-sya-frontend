import fs from 'fs';
import path from 'path';

import { expect } from 'chai';
import request from 'supertest';

import { app } from '../../../main/app';
import { PageUrls } from '../../../main/definitions/constants';

const noticePeriodJsonRaw = fs.readFileSync(
  path.resolve(__dirname, '../../../main/resources/locales/en/translation/notice-period-no-longer-working.json'),
  'utf-8'
);
const noticePeriodJson = JSON.parse(noticePeriodJsonRaw);

const titleClass = 'govuk-heading-xl';
const expectedTitle = noticePeriodJson.h1;
const radios = 'govuk-radios';
const input = 'govuk-radios--inline';

let htmlRes: Document;
describe('Did you have or work a notice period?', () => {
  beforeAll(async () => {
    await request(app)
      .get(PageUrls.NOTICE_PERIOD_NO_LONGER_WORKING)
      .then(res => {
        htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
      });
  });

  it('should display correct heading', () => {
    const title = htmlRes.getElementsByClassName(titleClass);
    expect(title[0].innerHTML).contains(expectedTitle, 'Did you have or work a notice period?');
  });

  it('should display correct radio buttons', () => {
    const radioButtons = htmlRes.getElementsByClassName(radios);
    expect(radioButtons.length).equal(3, `only ${radioButtons.length} found`);
  });

  it('should display correct options field', () => {
    const optionsField = htmlRes.getElementsByClassName(input);
    expect(optionsField.length).equal(2, `only ${optionsField.length} found`);
  });
});
