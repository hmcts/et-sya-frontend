import fs from 'fs';
import path from 'path';

import { expect } from 'chai';
import request from 'supertest';

import { PageUrls } from '../../../main/definitions/constants';
import { mockApp } from '../mocks/mockApp';

const desiredClaimOutcomeJsonRaw = fs.readFileSync(
  path.resolve(__dirname, '../../../main/resources/locales/en/translation/desired-claim-outcome.json'),
  'utf-8'
);
const desiredClaimOutcomeJson = JSON.parse(desiredClaimOutcomeJsonRaw);

const titleClass = 'govuk-heading-xl';
const detailsClass = 'govuk-details';
const buttonClass = 'govuk-button';
const checkboxesClass = 'govuk-checkboxes';
const expectedTitle = desiredClaimOutcomeJson.h1;

let htmlRes: Document;
describe('Desired Claim Outcome page', () => {
  beforeAll(async () => {
    await request(mockApp({}))
      .get(PageUrls.DESIRED_CLAIM_OUTCOME)
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
    expect(details.length).equals(3, 'Incorrect number of expandable details sections');
  });

  it('should display checkboxes', () => {
    const checkboxes = htmlRes.getElementsByClassName(checkboxesClass);
    expect(checkboxes.length).equals(1, 'Could not find textarea');
  });

  it('should display save and continue button', () => {
    const button = htmlRes.getElementsByClassName(buttonClass);
    expect(button[0].innerHTML).contains('Save and continue', 'Could not find the button');
  });

  it('should display Save as draft button', () => {
    const button = htmlRes.getElementsByClassName(buttonClass);
    expect(button[1].innerHTML).contains('Save as draft', 'Could not find the button');
  });
});
