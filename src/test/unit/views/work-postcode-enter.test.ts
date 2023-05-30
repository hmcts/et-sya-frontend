import fs from 'fs';
import path from 'path';

import { expect } from 'chai';
import request from 'supertest';

import { PageUrls } from '../../../main/definitions/constants';
import { mockApp } from '../mocks/mockApp';

const workPostCodeEnterJsonRaw = fs.readFileSync(
  path.resolve(__dirname, '../../../main/resources/locales/en/translation/common.json'),
  'utf-8'
);
const workPostCodeEnterJson = JSON.parse(workPostCodeEnterJsonRaw);

const titleClass = 'govuk-heading-xl';
const labelClass = 'govuk-label govuk-!-width-one-half';
const expectedWorkPageHeader = workPostCodeEnterJson.workAddressPageHeader;
const expectedEnterPostcode = workPostCodeEnterJson.enterPostcode;
const buttonClass = 'govuk-button';
let htmlRes: Document;
describe('Work Postcode enter page', () => {
  beforeAll(async () => {
    await request(
      mockApp({
        userCase: {
          workEnterPostcode: 'LS12DE',
        },
      })
    )
      .get(PageUrls.WORK_POSTCODE_ENTER)
      .then(res => {
        htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
      });
  });

  it('should display correct label', () => {
    const label = htmlRes.getElementsByClassName(labelClass);
    expect(label[0].innerHTML).contains(expectedEnterPostcode, 'label does not exist');
  });

  it('should display save and continue button', () => {
    const button = htmlRes.getElementsByClassName(buttonClass);
    expect(button[5].innerHTML).contains('Save and continue', 'Could not find the button');
  });

  it('should display Save as draft button', () => {
    const button = htmlRes.getElementsByClassName(buttonClass);
    expect(button[6].innerHTML).contains('Save as draft', 'Could not find the button');
  });
  it('should display correct heading', () => {
    const title = htmlRes.getElementsByClassName(titleClass);
    expect(title[0].innerHTML).contains(expectedWorkPageHeader, 'Page title does not exist');
  });
});
