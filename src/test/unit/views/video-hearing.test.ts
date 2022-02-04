import { expect } from 'chai';
import request from 'supertest';

import { app } from '../../../main/app';

const PAGE_URL = '/would-you-want-to-take-part-in-video-hearings';
const titleClass = 'govuk-heading-xl';
const pClass = 'govuk-body';
const expectedTitle = 'Would you be able to take part in video hearings?';
const expectedP1 = 'They’re not always guaranteed and held at the discretion of an employment judge.';
const buttonClass = 'govuk-button';
const radioClass = 'govuk-radios__item';
const expectedRadioLabel1 = 'Yes';
const expectedRadioLabel2 = 'No';
const detailsClass = 'govuk-details';
const detailsTextClass = 'govuk-details__text';
const detailsSummaryTextClass = 'govuk-details__summary-text';
const detailsSummary1 = 'What is a video hearing?';
const detailsSummary2 = 'Contact us for help';

let htmlRes: Document;
describe('Video Hearing Choice page', () => {
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
    expect(button[0].innerHTML).contains('continue', 'Could not find the button');
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
    expect(detailsComponents.length).equal(2, '2 details components not found');
  });

  it('should display 3 GDS detail text components which reveal detailed information', () => {
    const detailsTextComponents = htmlRes.getElementsByClassName(detailsTextClass);
    expect(detailsTextComponents.length).equal(2, '2 detail text classes not found');
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
  });
});
