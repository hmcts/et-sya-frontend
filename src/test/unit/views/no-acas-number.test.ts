import { expect } from 'chai';
import request from 'supertest';

import { NoAcasNumberReason } from '../../../main/definitions/case';
import { mockApp } from '../mocks/mockApp';

const titleClass = 'govuk-heading-xl';
const expectedTitle = 'Why do you not have an Acas number?';
const radios = 'govuk-radios__item';
const expectedRadioLabel1 = NoAcasNumberReason.ANOTHER;
const expectedRadioLabel2 = NoAcasNumberReason.NO_POWER;
const expectedRadioLabel3 = NoAcasNumberReason.EMPLOYER;
const expectedRadioLabel4 = NoAcasNumberReason.UNFAIR_DISMISSAL;
const buttonClass = 'govuk-button';

let htmlRes: Document;

describe('Why do you not have an Acas number page', () => {
  beforeAll(async () => {
    await request(mockApp({}))
      .get('/respondent/1/no-acas-reason')
      .then(res => {
        htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
      });
  });
  it('should display title', () => {
    const title = htmlRes.getElementsByClassName(titleClass);
    expect(title[0].innerHTML).contains(expectedTitle, 'Page title does not exist');
  });

  it('should display radio buttons', () => {
    const radioButtons = htmlRes.getElementsByClassName(radios);
    expect(radioButtons.length).equal(4, 'radio buttons not found');
  });

  it('should display radio buttons with valid text', () => {
    const radioButtons = htmlRes.getElementsByClassName(radios);
    expect(radioButtons[0].innerHTML).contains(
      expectedRadioLabel1,
      'Could not find the radio button with label ' + expectedRadioLabel1
    );
    expect(radioButtons[1].innerHTML).contains(
      expectedRadioLabel2,
      'Could not find the radio button with label ' + expectedRadioLabel2
    );
    expect(radioButtons[2].innerHTML).contains(
      expectedRadioLabel3,
      'Could not find the radio button with label ' + expectedRadioLabel3
    );
    expect(radioButtons[3].innerHTML).contains(
      expectedRadioLabel4,
      'Could not find the radio button with label ' + expectedRadioLabel4
    );
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
