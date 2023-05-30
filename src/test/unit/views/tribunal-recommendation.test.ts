import fs from 'fs';
import path from 'path';

import { PageUrls } from '../../../main/definitions/constants';
import { mockApp } from '../mocks/mockApp';

import { expect } from 'chai';
import request from 'supertest';

const tribunalRecommendationJSONRaw = fs.readFileSync(
  path.resolve(__dirname, '../../../main/resources/locales/en/translation/tribunal-recommendation.json'),
  'utf-8'
);
const tribunalRecommendationJSON = JSON.parse(tribunalRecommendationJSONRaw);

const titleClass = 'govuk-heading-xl';
const expectedTitle = tribunalRecommendationJSON.h1;
const buttonClass = 'govuk-button';
const textAreaClass = 'govuk-textarea';

let htmlRes: Document;
describe('Tribunal Recommendation page', () => {
  beforeAll(async () => {
    await request(mockApp({}))
      .get(PageUrls.TRIBUNAL_RECOMMENDATION)
      .then(res => {
        htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
      });
  });

  it('should display title', () => {
    const title = htmlRes.getElementsByClassName(titleClass);
    expect(title[0].innerHTML).contains(expectedTitle, 'Page title does not exist');
  });

  it('should have 1 text area field', () => {
    const textAreaField = htmlRes.getElementsByClassName(textAreaClass);
    expect(textAreaField.length).equal(1, `only ${textAreaField.length} found`);
  });

  it('should display save and continue button', () => {
    const button = htmlRes.getElementsByClassName(buttonClass);
    expect(button[5].innerHTML).contains('Save and continue', 'Could not find the button');
  });

  it('should display save as draft button', () => {
    const button = htmlRes.getElementsByClassName(buttonClass);
    expect(button[6].innerHTML).contains('Save as draft', 'Could not find the button');
  });
});
