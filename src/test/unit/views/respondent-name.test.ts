import { expect } from 'chai';
import request from 'supertest';

import { PageUrls } from '../../../main/definitions/constants';
import { mockApp } from '../mocks/mockApp';

const titleClass = 'govuk-heading-xl';
const buttonClass = 'govuk-button';
const expectedTitle = "What is the name of the respondent you're making the claim against?";
const inputs = '[class*="respondentName"]';
const expectedInputLabel = 'Enter name of respondent';
const insetClass = 'govuk-inset-text';
const insetText = "You'll be able to add more respondents later if you need to";

let htmlRes: Document;
describe('Respondent Name page', () => {
  beforeAll(async () => {
    await request(mockApp({}))
      .get(PageUrls.FIRST_RESPONDENT_NAME)
      .then(res => {
        htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
      });
  });

  it('should display title', () => {
    const title = htmlRes.getElementsByClassName(titleClass);
    expect(title[0].innerHTML).contains(expectedTitle, 'Page title does not exist');
  });

  it('should display insetText', () => {
    const title = htmlRes.getElementsByClassName(insetClass);
    expect(title[0].innerHTML).contains(insetText, 'Inset text does not exist');
  });

  it('should display 1 input field', () => {
    const inputFields = htmlRes.querySelectorAll(inputs);
    expect(inputFields.length).equal(1, `incorrect number of inputs found, there was ${inputFields.length} found`);
  });

  it('should display the single text input with a valid labels', () => {
    const inputFields = htmlRes.querySelectorAll(inputs);
    expect(inputFields[0].innerHTML).contains(
      expectedInputLabel,
      `Could not find an input field with label ${expectedInputLabel}`
    );
  });

  it('should display continue button', () => {
    const button = htmlRes.getElementsByClassName(buttonClass);
    expect(button[5].innerHTML).contains('continue', 'Could not find the button');
  });
});
