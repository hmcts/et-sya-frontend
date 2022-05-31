import fs from 'fs';
import path from 'path';

import { expect } from 'chai';
import request from 'supertest';

import { StillWorking } from '../../../main/definitions/case';
import { PageUrls } from '../../../main/definitions/constants';
import { mockApp } from '../mocks/mockApp';

const PAGE_URL = PageUrls.PLACE_OF_WORK;

const translationRaw = fs.readFileSync(
  path.resolve(__dirname, '../../../main/resources/locales/en/translation/place-of-work.json'),
  'utf-8'
);
const placeOfWorkJson = JSON.parse(translationRaw);
const addressJsonRaw = fs.readFileSync(
  path.resolve(__dirname, '../../../main/resources/locales/en/translation/enter-address.json'),
  'utf-8'
);

const addressJson = JSON.parse(addressJsonRaw);
const titleClass = 'govuk-heading-xl';
const expectedPageHeaderText = placeOfWorkJson.h1.workingOrNotice;
const expectedPageText = placeOfWorkJson.pText.workingOrNotice;
const pClass = 'govuk-body';
const buttonClass = 'govuk-button';
const expectedInputLabel = addressJson.enterPostcode;
const labelClass = 'govuk-label';
const inputClass = 'govuk-input';
const postcodeId = 'postcode';

let htmlRes: Document;

describe('Place Of Work Page', () => {
  beforeAll(async () => {
    await request(mockApp({}))
      .get(PAGE_URL)
      .then(res => {
        htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
      });
  });

  it('should display title', () => {
    const title = htmlRes.getElementsByClassName(titleClass);
    expect(title[0].innerHTML).contains(expectedPageHeaderText, 'Page title does not exist');
  });

  it('should display description text', () => {
    const paragraph = htmlRes.getElementsByClassName(pClass);
    expect(paragraph[0].innerHTML).contains(expectedPageText, 'P1 does not exist');
  });

  it('should display postcode label', () => {
    const inputLabel = htmlRes.getElementsByClassName(labelClass);
    expect(inputLabel[0].innerHTML).contains(expectedInputLabel, 'input label does not exist');
  });

  it('should display postcode input', () => {
    const inputs = htmlRes.getElementsByClassName(inputClass);
    expect(inputs[0].id).contains(postcodeId, 'input does not exist');
  });

  it('should display find address button', () => {
    const button = htmlRes.getElementsByClassName(buttonClass);
    expect(button[0].innerHTML).contains('Find address', 'Could not find the button');
  });
});

describe('Place of work while no longer working', () => {
  beforeAll(async () => {
    await request(
      mockApp({
        userCase: {
          isStillWorking: StillWorking.NO_LONGER_WORKING,
        },
      })
    )
      .get(PAGE_URL)
      .then(res => {
        htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
      });
  });

  it('should display title', () => {
    const expectedTitle = placeOfWorkJson.h1.noLongerWorking;
    const title = htmlRes.getElementsByClassName(titleClass);
    expect(title[0].innerHTML).contains(expectedTitle, 'Page title does not exist');
  });

  it('should display description text', () => {
    const expectedParagraph = placeOfWorkJson.pText.noLongerWorking;

    const paragraph = htmlRes.getElementsByClassName(pClass);
    expect(paragraph[0].innerHTML).contains(expectedParagraph, 'P1 does not exist');
  });
});
