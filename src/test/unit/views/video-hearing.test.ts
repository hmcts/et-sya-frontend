import { expect } from 'chai';
import request from 'supertest';

import { mockApp } from '../mocks/mockApp';

const PAGE_URL = '/would-you-want-to-take-part-in-video-hearings';
const titleClass = 'govuk-heading-xl';
const pClass = 'govuk-body';
const expectedTitle = 'Would you be able to take part in hearings by video and phone?';
const expectedP1 = 'If your case goes to a hearing, it can take place either:';
const buttonClass = 'govuk-button';
const checkboxClass = 'govuk-checkboxes__input';
const checkboxLabel = 'govuk-checkboxes__label';
const expectedLabel1 = 'Yes, I can take part in video hearings';
const expectedLabel2 = 'Yes, I can take part in phone hearings';
const expectedLabel3 = 'No, I cannot take part in either video or phone hearings';

let htmlRes: Document;
describe('Hearing Preference video or phone Choice page', () => {
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
    expect(p1[0].innerHTML).contains(expectedP1, 'P1 does not exist');
  });

  it('should display continue button', () => {
    const button = htmlRes.getElementsByClassName(buttonClass);
    expect(button[0].innerHTML).contains('continue', 'Could not find the button');
  });

  it('should display 3 checkboxes', () => {
    const checkboxes = htmlRes.getElementsByClassName(checkboxClass);
    expect(checkboxes.length).equal(3, '3 checkboxes not found');
  });

  it('should display checkboxes with valid text', () => {
    const checkboxes = htmlRes.getElementsByClassName(checkboxLabel);
    expect(checkboxes[0].innerHTML).contains(
      expectedLabel1,
      'Could not find the checkbox with label ' + expectedLabel1
    );
    expect(checkboxes[1].innerHTML).contains(
      expectedLabel2,
      'Could not find the checkbox with label ' + expectedLabel2
    );
    expect(checkboxes[2].innerHTML).contains(
      expectedLabel3,
      'Could not find the checkbox with label ' + expectedLabel3
    );
  });
});
