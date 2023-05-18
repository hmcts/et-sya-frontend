import fs from 'fs';
import path from 'path';

import { expect } from 'chai';
import request from 'supertest';

import { PageUrls } from '../../../main/definitions/constants';
import { mockApp } from '../mocks/mockApp';

const agreeingDocumentsForHearingJsonRaw = fs.readFileSync(
  path.resolve(__dirname, '../../../main/resources/locales/en/translation/agreeing-documents-for-hearing.json'),
  'utf-8'
);
const agreeingDocumentsForHearingJson = JSON.parse(agreeingDocumentsForHearingJsonRaw);

const titleClass = 'govuk-heading-l govuk-!-margin-bottom-4';
const expectedTitle = agreeingDocumentsForHearingJson.title;
const buttonClass = 'govuk-button';
const inputs = 'govuk-radios__item';

let htmlRes: Document;
describe('Agreeing documents for hearing page', () => {
  beforeAll(async () => {
    await request(mockApp({}))
      .get(PageUrls.AGREEING_DOCUMENTS_FOR_HEARING)
      .then(res => {
        htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
      });
  });

  it('should display page heading', () => {
    const title = htmlRes.getElementsByClassName(titleClass);
    expect(title[0].innerHTML).contains(expectedTitle, 'Page title does not exist');
  });

  it('should display continue button', () => {
    const button = htmlRes.getElementsByClassName(buttonClass);
    expect(button[5].innerHTML).contains('Continue', 'Could not find the button');
  });

  it('should display radios', () => {
    const radios = htmlRes.getElementsByClassName(inputs);
    expect(radios.length).equal(3, `only ${radios.length} found`);
  });
});
