import fs from 'fs';
import path from 'path';

import { expect } from 'chai';
import request from 'supertest';

import { app } from '../../../main/app';
import { PageUrls } from '../../../main/definitions/constants';

const employeebBenefitJsonRaw = fs.readFileSync(
  path.resolve(__dirname, '../../../main/resources/locales/en/translation/employee_benefits.json'),
  'utf-8'
);
const employeebBenefitJson = JSON.parse(employeebBenefitJsonRaw);

const titleClass = 'govuk-heading-xl govuk-!-margin-bottom-6';
const expectedTitle = employeebBenefitJson.h1;
// const radios = 'govuk-radios';

let htmlRes: Document;
describe('Do or did you receive any employee benefits?', () => {
  beforeAll(async () => {
    await request(app)
      .get(PageUrls.EMPLOYEE_BENEFIT)
      .then(res => {
        htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
      });
  });

  it('Should display correct heading', () => {
    const title = htmlRes.getElementsByClassName(titleClass);
    console.log(`Title receieved is dd ${title[0].innerHTML}`);
    expect(title[0].innerHTML).contains(expectedTitle, 'Do or did you receive any employee benefits?');
  });
});
