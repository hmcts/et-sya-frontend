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
const expectedTitle = lipOrRepJson.h1;
const expectedIntro = lipOrRepJson.intro;
const buttonClass = 'govuk-button';
const radioClass = 'govuk-radios__item';

// Updated radio labels
const expectedRadioLabel1 = lipOrRepJson.question.radio1;
const expectedRadioLabel2 = lipOrRepJson.question.radio2;
const expectedRadioLabel3 = lipOrRepJson.question.radio3;

const detailsClass = 'govuk-details';
const detailsTextClass = 'govuk-details__text';
const detailsSummaryTextClass = 'govuk-details__summary-text';

// Updated summaries
const detailsSummary1 = lipOrRepJson.claimingSection.heading;
const detailsSummary2 = lipOrRepJson.detailsSummary1;
const detailsSummary3 = lipOrRepJson.detailsSummary2;

const signOutLinkSelector = 'li.govuk-service-navigation__item a.govuk-service-navigation__link';

let htmlRes: Document;
describe('LiP or Representative page', () => {
  beforeAll(async () => {
    await request(app)
      .get(PAGE_URL)
      .then(res => {
        htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
      });
  });

  it('should not display a sign out link as the user is not logged in', () => {
    const signoutLinks = htmlRes.querySelectorAll(signOutLinkSelector);
    expect(signoutLinks.length).equals(0, 'Sign out link should not exist');
  });

  it('should display title', () => {
    const title = htmlRes.getElementsByClassName(titleClass);
    expect(title[0].innerHTML).contains(expectedTitle, 'Page title does not exist');
  });

  it('should display intro paragraph', () => {
    // Testing body content to avoid index-shifting issues with pClass
    expect(htmlRes.body.innerHTML).contains(expectedIntro, 'Intro text does not exist');
  });

  it('should display continue button', () => {
    const button = htmlRes.getElementsByClassName(buttonClass);
    expect(button[5].innerHTML).contains('Continue', 'Could not find the button');
  });

  it('should display 3 radio buttons', () => {
    const radioButtons = htmlRes.getElementsByClassName(radioClass);
    expect(radioButtons.length).equal(3, '3 radio buttons not found');
  });

  it('should display radio buttons with valid text', () => {
    const radioButtons = htmlRes.getElementsByClassName(radioClass);
    expect(radioButtons[0].innerHTML).contains(expectedRadioLabel1);
    expect(radioButtons[1].innerHTML).contains(expectedRadioLabel2);
    expect(radioButtons[2].innerHTML).contains(expectedRadioLabel3);
  });

  it('should display 4 GDS details components', () => {
    const detailsComponents = htmlRes.getElementsByClassName(detailsClass);
    expect(detailsComponents.length).equal(4, '4 details components not found');
  });

  it('should display 4 GDS detail text components', () => {
    const detailsTextComponents = htmlRes.getElementsByClassName(detailsTextClass);
    expect(detailsTextComponents.length).equal(4, '4 detail text classes not found');
  });

  it('should display details components with valid summary text', () => {
    const detailSummaries = htmlRes.getElementsByClassName(detailsSummaryTextClass);
    expect(detailSummaries[0].innerHTML).contains(detailsSummary1);
    expect(detailSummaries[1].innerHTML).contains(detailsSummary2);
    expect(detailSummaries[2].innerHTML).contains(detailsSummary3);
  });
});
