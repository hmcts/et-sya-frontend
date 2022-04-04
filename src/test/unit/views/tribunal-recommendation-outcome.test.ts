import fs from 'fs';
import path from 'path';

import { expect } from 'chai';
import request from 'supertest';

import { app } from '../../../main/app';
import { PageUrls } from '../../../main/definitions/constants';

const tribunalRecommendationOutcomeJsonRaw = fs.readFileSync(
  path.resolve(__dirname, '../../../main/resources/locales/en/translation/tribunal-recommendation-outcome.json'),
  'utf-8'
);
const tribunalRecommendationOutcomeJson = JSON.parse(tribunalRecommendationOutcomeJsonRaw);

const titleClass = 'govuk-heading-xl';
const detailsClass = 'govuk-details';
const buttonClass = 'govuk-button';
const textInputId = 'tribunal-recommendation-outcome';
const expectedTitle = tribunalRecommendationOutcomeJson.h1;

let htmlRes: Document;
describe('Tribunal Recommendation Outcome page', () => {
  beforeAll(async () => {
    await request(app)
      .get(PageUrls.TRIBUNAL_RECOMMENDATION_OUTCOME)
      .then(res => {
        htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
      });
  });

  it('should display title', () => {
    const title = htmlRes.getElementsByClassName(titleClass);
    expect(title[0].innerHTML).contains(expectedTitle, 'Page title does not exist');
  });

  it('should display expandable details section', () => {
    const details = htmlRes.getElementsByClassName(detailsClass);
    expect(details.length).equals(2, 'Incorrect number of expandable details sections');
  });

  it('should display textarea', () => {
    const textarea = htmlRes.getElementById(textInputId);
    expect(textarea.id).equals(textInputId, 'Could not find textarea');
  });

  it('should display save and continue button', () => {
    const button = htmlRes.getElementsByClassName(buttonClass);
    expect(button[0].innerHTML).contains('Save and continue', 'Could not find the button');
  });

  it('should display save for later button', () => {
    const button = htmlRes.getElementsByClassName(buttonClass);
    expect(button[1].innerHTML).contains('Save for later', 'Could not find the button');
  });
});
