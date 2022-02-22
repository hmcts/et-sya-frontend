import { expect } from 'chai';
import request from 'supertest';

import { app } from '../../../main/app';

const PAGE_URL = '/single-or-multiple-claim?lng=cy';
const titleClass = 'govuk-heading-xl';
const pClass = 'govuk-body';
const buttonClass = 'govuk-button';
const continueButton = 'Lorem';
const radioClass = 'govuk-radios__item';
const expectedRadioLabel1 = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit';
const expectedRadioLabel2 = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit';
const expectedTitle =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer convallis mi sed erat dapibus interdum non?';
const expectedP1 =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse metus lacus, convallis nec maximus in, vehicula at nunc. Sed facilisis accumsan dolor ac mattis.';
const expectedP2 =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc id tempus risus. Ut tortor ex, lacinia ac dui ac, porta dapibus sem. Duis pellentesque lacus non lectus tincidunt.';

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

  it('should display first paragraph', () => {
    const p1 = htmlRes.getElementsByClassName(pClass);
    expect(p1[0].innerHTML).contains(expectedP1, 'P1 does not exist');
  });

  it('should display second paragraph', () => {
    const p1 = htmlRes.getElementsByClassName(pClass);
    expect(p1[1].innerHTML).contains(expectedP2, 'P2 does not exist');
  });

  it('should display continue button', () => {
    const button = htmlRes.getElementsByClassName(buttonClass);
    expect(button[0].innerHTML).contains(continueButton, 'Could not find the button');
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
