import fs from 'fs';
import path from 'path';

import { expect } from 'chai';
import request from 'supertest';

import { app } from '../../../main/app';

const lipOrRepJsonRaw = fs.readFileSync(
  path.resolve(__dirname, '../../../main/resources/locales/en/translation/lip-or-representative.json'),
  'utf-8'
);
const lipOrRepJson = JSON.parse(lipOrRepJsonRaw);

const PAGE_URL = '/lip-or-representative';
const titleClass = 'govuk-heading-xl';
const pClass = 'govuk-body';
const expectedTitle = lipOrRepJson.h1;
const expectedP1 = lipOrRepJson.p1;
const buttonClass = 'govuk-button';
const radioClass = 'govuk-radios__item';
const expectedRadioLabel1 = "I'm representing myself and making my own claim";
const expectedRadioLabel2 = "I'm making a claim for someone else and acting as their representative";
const detailsClass = 'govuk-details';
const detailsTextClass = 'govuk-details__text';
const detailsSummaryTextClass = 'govuk-details__summary-text';
const detailsSummary1 = 'Who can act as a representative?';
const detailsSummary2 = 'How to find and get a representative?';
const detailsSummary3 = 'Contact us for help';

let htmlRes: Document;
describe('LiP or Representative page', () => {
  beforeAll(async () => {
    await request(app)
      .get(PAGE_URL)
      .then(res => {
        htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
      });
  });

  it('should display title', () => {
    const title = htmlRes.getElementsByClassName(titleClass);
    expect(title[0].innerHTML).contains(expectedTitle, 'Page title does not exist');
  });

  it('should display firt paragraph', () => {
    const p1 = htmlRes.getElementsByClassName(pClass);
    expect(p1[0].innerHTML).contains(expectedP1, 'P1 does not exist');
  });

  it('should display continue button', () => {
    const button = htmlRes.getElementsByClassName(buttonClass);
    expect(button[0].innerHTML).contains('Continue', 'Could not find the button');
  });

  it('should display 2 radio buttons', () => {
    const radioButtons = htmlRes.getElementsByClassName(radioClass);
    expect(radioButtons.length).equal(2, '2 radio buttons not found');
  });

  it('should display radio buttons with valid text', () => {
    const radioButtons = htmlRes.getElementsByClassName(radioClass);
    expect(radioButtons[0].innerHTML).contains(
      expectedRadioLabel1,
      'Could not find the radio button with label ' + expectedRadioLabel1
    );
    expect(radioButtons[1].innerHTML).contains(
      expectedRadioLabel2,
      'Could not find the radio button with label ' + expectedRadioLabel2
    );
  });

  it('should display 3 GDS details components', () => {
    const detailsComponents = htmlRes.getElementsByClassName(detailsClass);
    expect(detailsComponents.length).equal(3, '3 details components not found');
  });

  it('should display 3 GDS detail text components which reveal detailed information', () => {
    const detailsTextComponents = htmlRes.getElementsByClassName(detailsTextClass);
    expect(detailsTextComponents.length).equal(3, '3 detail text classes not found');
  });

  it('should display details components with valid summary text', () => {
    const detailSummaries = htmlRes.getElementsByClassName(detailsSummaryTextClass);
    expect(detailSummaries[0].innerHTML).contains(
      detailsSummary1,
      'Could not find the details summary with text ' + detailsSummary1
    );
    expect(detailSummaries[1].innerHTML).contains(
      detailsSummary2,
      'Could not find the details summary with text ' + detailsSummary2
    );
    expect(detailSummaries[2].innerHTML).contains(
      detailsSummary3,
      'Could not find the details summary with text ' + detailsSummary3
    );
  });
});
