import { expect } from 'chai';
import request from 'supertest';

import { app } from '../../../main/app';

const PAGE_URL = '/are-you-still-working';

const titleClass = 'govuk-heading-xl';
const buttonClass = 'govuk-button';
const radioClass = 'govuk-radios__item';
const buttonClass = 'govuk-button';
const radioClass = 'govuk-radios__item';

const expectedRadioLabel1 = "yes - I'm still working for them";
const expectedRadioLabel2 = "yes - I'm working my notice period";
const expectedRadioLabel3 = "no - I'm no longer working for them";
const expectedTitle = "Are you still working for the organisation or person you're making your claim against?";

let htmlRes: Document;

describe('Are you still working page', () => {
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

  it('should display continue button', () => {
    const button = htmlRes.getElementsByClassName(buttonClass);
    expect(button[0].innerHTML).contains('Continue', 'Could not find the button');
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
    expect(radioButtons[3].innerHTML).contains(
      expectedRadioLabel3,
      'Could not find the radio button with label ' + expectedRadioLabel3
    );
  });
});
