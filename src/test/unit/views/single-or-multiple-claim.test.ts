import { expect } from 'chai';
import request from 'supertest';

import { app } from '../../../main/app';

const PAGE_URL = '/single-or-multiple-claim';
const titleClass = 'govuk-heading-xl';
const pClass = 'govuk-body';
const buttonClass = 'govuk-button';
const radioClass = 'govuk-radios__item';
const expectedRadioLabel1 = 'I’m making a ‘Single’ claim on my own';
const expectedRadioLabel2 = 'I’m making a ‘Multiple’ claim alongside other people';
const expectedTitle = 'Are you making a ‘single’ claim on your own or a ‘multiple’ claim alongside other people?';
const expectedP1 =
  'You make a ‘Single’ claim if your dispute is only between you and any respondents who you think treated you (as an individual) unlawfully.';
const expectedP2 =
  'You make a ‘Multiple’ claim if your dispute is between more than 1 more person and any respondents who you think treated you all (as a group) unlawfully.';

let htmlRes: Document;
describe('Single or Multiple Claim page', () => {
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

  it('should display second paragraph', () => {
    const p1 = htmlRes.getElementsByClassName(pClass);
    expect(p1[1].innerHTML).contains(expectedP2, 'P2 does not exist');
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
});
