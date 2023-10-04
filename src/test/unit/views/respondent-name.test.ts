import fs from 'fs';
import path from 'path';

import { expect } from 'chai';
import request from 'supertest';

import { PageUrls, RespondentType } from '../../../main/definitions/constants';
import { mockApp } from '../mocks/mockApp';

const respondentNameJsonRaw = fs.readFileSync(
  path.resolve(__dirname, '../../../main/resources/locales/en/translation/respondent-name.json'),
  'utf-8'
);
const respondentNameJson = JSON.parse(respondentNameJsonRaw);

const titleClass = 'govuk-heading-xl';
const buttonClass = 'govuk-button';
const radioClass = 'govuk-radios__item';
const paragraphClass = 'govuk-body';
const inputClass = 'govuk-text';
const labelClass = 'govuk-label';
const insetClass = 'govuk-inset-text';
const expectedTitle = respondentNameJson.h1;
const expectedParagraph1 = respondentNameJson.p1;
const expectedParagraph2 = respondentNameJson.p2;
const expectedParagraph3 = respondentNameJson.p3;
const expectedRadio1Label = respondentNameJson.individualLabel;
const expectedRadio2Label = respondentNameJson.companyLabel;
const expectedInputLabel1 = respondentNameJson.firstNameLabel;
const expectedInputLabel2 = respondentNameJson.lastNameLabel;
const expectedInputLabel3 = respondentNameJson.orgLabel;
const insetText = respondentNameJson.insetText;

let htmlRes: Document;
describe('Respondent Name page', () => {
  beforeAll(async () => {
    await request(
      mockApp({
        userCase: {
          respondentType: RespondentType.ORGANISATION,
          respondentOrganisation: 'Vandelay Industries',
        },
      })
    )
      .get(PageUrls.FIRST_RESPONDENT_NAME)
      .then(res => {
        htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
      });
  });

  it('should display title', () => {
    const title = htmlRes.getElementsByClassName(titleClass);
    expect(title[0].innerHTML).contains(expectedTitle, 'Page title does not exist');
  });

  it('should display first paragraph', () => {
    const paragraphs = htmlRes.getElementsByClassName(paragraphClass);
    expect(paragraphs[6].innerHTML).contains(expectedParagraph1, 'Paragraph does not exist');
  });

  it('should display second paragraph', () => {
    const paragraphs = htmlRes.getElementsByClassName(paragraphClass);
    expect(paragraphs[7].innerHTML).contains(expectedParagraph2, 'Paragraph does not exist');
  });

  it('should display third paragraph', () => {
    const paragraphs = htmlRes.getElementsByClassName(paragraphClass);
    expect(paragraphs[8].innerHTML).contains(expectedParagraph3, 'Paragraph does not exist');
  });

  it('should display insetText', () => {
    const title = htmlRes.getElementsByClassName(insetClass);
    expect(title[0].innerHTML).contains(insetText, 'Inset text does not exist');
  });

  it('should display 2 radio buttons', () => {
    const radios = htmlRes.getElementsByClassName(radioClass);
    expect(radios.length).equal(2, '2 radio buttons not found');
  });

  it('should display correct label on first radio button', () => {
    const label = htmlRes.getElementsByClassName(labelClass);
    expect(label[0].innerHTML).contains(expectedRadio1Label, 'Radio button label does not exist');
  });

  it('should display correct label on second radio button', () => {
    const label = htmlRes.getElementsByClassName(labelClass);
    expect(label[3].innerHTML).contains(expectedRadio2Label, 'Radio button label does not exist');
  });

  it('should display input fields with correct labels', () => {
    const inputField = htmlRes.getElementsByClassName(inputClass);
    const label = htmlRes.getElementsByClassName(labelClass);
    expect(inputField.length).equal(3, `only ${inputField.length} found`);
    expect(label[1].innerHTML).contains(expectedInputLabel1, 'Input label does not exist');
    expect(label[2].innerHTML).contains(expectedInputLabel2, 'Input label does not exist');
    expect(label[4].innerHTML).contains(expectedInputLabel3, 'Input label does not exist');
  });

  it('should display continue button', () => {
    const button = htmlRes.getElementsByClassName(buttonClass);
    expect(button[5].innerHTML).contains('continue', 'Could not find the button');
  });
});
