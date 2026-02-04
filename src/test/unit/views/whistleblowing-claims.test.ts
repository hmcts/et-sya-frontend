import fs from 'fs';
import path from 'path';

import { expect } from 'chai';
import request from 'supertest';

import { PageUrls } from '../../../main/definitions/constants';
import { mockApp } from '../mocks/mockApp';

const whistleblowingClaimsJSONRaw = fs.readFileSync(
  path.resolve(__dirname, '../../../main/resources/locales/en/translation/whistleblowing-claims.json'),
  'utf-8'
);
const whistleblowingClaimsJSON = JSON.parse(whistleblowingClaimsJSONRaw);

const titleClass = 'govuk-heading-xl';
const expectedTitle = whistleblowingClaimsJSON.h1;
const expectedParagraphs = 'govuk-body';
const radios = 'govuk-radios';
const inputs = 'govuk-input';
const buttonClass = 'govuk-button';

let htmlRes: Document;
describe('Whistleblowing Claims page', () => {
  beforeAll(async () => {
    await request(mockApp({}))
      .get(PageUrls.WHISTLEBLOWING_CLAIMS)
      .then(res => {
        htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
      });
  });

  it('should display title', () => {
    const title = htmlRes.getElementsByClassName(titleClass);
    expect(title[0].innerHTML).contains(expectedTitle, 'Page title does not exist');
  });

  it('should display 10 paragraphs', () => {
    const paragraphs = htmlRes.getElementsByClassName(expectedParagraphs);
    expect(paragraphs.length).equal(10, `only ${paragraphs.length} found`);
  });

  it('should display correct radio buttons', () => {
    const radioButtons = htmlRes.getElementsByClassName(radios);
    expect(radioButtons.length).equal(1, `only ${radioButtons.length} found`);
  });

  it('should have 2 input fields', () => {
    const inputFields = htmlRes.getElementsByClassName(inputs);
    expect(inputFields.length).equal(2, `only ${inputFields.length} found`);
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
