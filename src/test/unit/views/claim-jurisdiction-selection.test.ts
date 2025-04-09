import { expect } from 'chai';
import request from 'supertest';

import { mockApp } from '../mocks/mockApp';

const PAGE_URL = '/claim-jurisdiction-selection';
const titleClass = 'govuk-heading-xl';
const pClass = 'govuk-body';
const buttonClass = 'govuk-button';
const expectedTitle = 'Where you can make your claim';
const expectedP1 =
  'You can make a claim in the Employment Tribunals in England and Wales or the Employment Tribunals in Scotland. They are separate jurisdictions.';
const expectedP2 = 'You can make your claim in England and Wales if any of the following conditions apply:';
const expectedP3 = 'You can make your claim in Scotland if any of the following conditions apply:';
const listClass = 'govuk-list govuk-list--bullet';
const warningClass = 'govuk-warning-text';
const radioClass = 'govuk-radios__item';
const expectedRadioLabel1 = 'England and Wales';
const expectedRadioLabel2 = 'Scotland';

let htmlRes: Document;
describe('Claim Jurisdiction Selection page', () => {
  beforeAll(async () => {
    await request(mockApp({}))
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
    expect(p1[6].innerHTML).contains(expectedP1, 'P1 does not exist');
  });

  it('should display second paragraph', () => {
    const p1 = htmlRes.getElementsByClassName(pClass);
    expect(p1[7].innerHTML).contains(expectedP2, 'P2 does not exist');
  });

  it('should display third paragraph', () => {
    const p1 = htmlRes.getElementsByClassName(pClass);
    expect(p1[8].innerHTML).contains(expectedP3, 'P3 does not exist');
  });

  it('should display 2 bullet lists', () => {
    const listItems = htmlRes.getElementsByClassName(listClass);
    expect(listItems.length).equal(2, `${listItems.length} lists found - expected 2`);
  });

  it('should display important content', () => {
    const importantContent = htmlRes.getElementsByClassName(warningClass);
    expect(importantContent.length).equal(1, 'Important content does not exist');
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

  it('should display continue button', () => {
    const button = htmlRes.getElementsByClassName(buttonClass);
    expect(button[5].innerHTML).contains('Continue', 'Could not find the button');
  });
});
