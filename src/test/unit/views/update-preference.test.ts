import fs from 'fs';
import path from 'path';

import { expect } from 'chai';
import request from 'supertest';

import { CaseTypeId } from '../../../main/definitions/case';
import { PageUrls } from '../../../main/definitions/constants';
import { mockApp } from '../mocks/mockApp';

const updatePreferenceJsonRaw = fs.readFileSync(
  path.resolve(__dirname, '../../../main/resources/locales/en/translation/update-preference.json'),
  'utf-8'
);
const updatePreferenceJson = JSON.parse(updatePreferenceJsonRaw);

const PAGE_URL = PageUrls.UPDATE_PREFERENCES;
const titleClass = 'govuk-heading-xl';
const expectedTitle = updatePreferenceJson.h1;
const buttonClass = 'govuk-button';
const inputs = 'govuk-radios';
const expectedInputLabel = 'label';

let htmlRes: Document;
describe('How would you like to be updated about your claim page - EnglandWales', () => {
  beforeAll(async () => {
    await request(mockApp({ userCase: { caseTypeId: CaseTypeId.ENGLAND_WALES } }))
      .get(PAGE_URL)
      .then(res => {
        htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
      });
  });

  it('should display title', () => {
    const title = htmlRes.getElementsByClassName(titleClass);
    expect(title[0].innerHTML).contains(expectedTitle, 'Page title does not exist');
  });

  it('should display save and continue button', () => {
    const button = htmlRes.getElementsByClassName(buttonClass);
    expect(button[5].innerHTML).contains('Save and continue', 'Could not find the button');
  });

  it('should display Save as draft button', () => {
    const button = htmlRes.getElementsByClassName(buttonClass);
    expect(button[6].innerHTML).contains('Save as draft', 'Could not find the button');
  });

  it('should display radio buttons', () => {
    const radioButtons = htmlRes.getElementsByClassName(inputs);
    expect(radioButtons.length).equal(3, `only ${radioButtons.length} found`);
  });

  it('should display inputs with valid labels', () => {
    const radioButtons = htmlRes.getElementsByClassName(inputs);
    expect(radioButtons[0].innerHTML).contains(
      expectedInputLabel,
      'Could not find the radio button with label ' + expectedInputLabel
    );
  });
});

describe('How would you like to be updated about your claim page - Scotland', () => {
  beforeAll(async () => {
    await request(mockApp({ userCase: { caseTypeId: CaseTypeId.SCOTLAND } }))
      .get(PAGE_URL)
      .then(res => {
        htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
      });
  });

  it('should display radio buttons', () => {
    const radioButtons = htmlRes.getElementsByClassName(inputs);
    expect(radioButtons.length).equal(1, `only ${radioButtons.length} found`);
  });
});
