import { expect } from 'chai';
import request from 'supertest';

import { app } from '../../../main/app';

const PAGE_URL = '/address-details';
const titleClass = 'govuk-heading-xl';
const expectedTitle = 'What is your contact or home address?';
const buttonClass = 'govuk-button';
const inputs = '[class*="address"]';
const expectedInputLabel1 = 'Building and street';
const expectedInputLabel2 = '';
const expectedInputLabel3 = 'Town or city';
const expectedInputLabel4 = 'County';
const expectedInputLabel5 = 'Postcode';

let htmlRes: Document;
describe('Address details page', () => {
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

  it("should display the 'Find Address' button", () => {
    const button = htmlRes.getElementsByClassName(buttonClass);
    expect(button[0].innerHTML).contains('Find address', 'Could not find the button');
  });

  it('should have 5 input address fields which are conditionally displayed', () => {
    const inputFields = htmlRes.querySelectorAll(inputs);
    expect(inputFields.length).equal(5, `only ${inputFields.length} found`);
  });

  it('should display inputs with valid labels', () => {
    const inputFields = htmlRes.querySelectorAll(inputs);
    expect(inputFields[0].innerHTML).contains(
      expectedInputLabel1,
      `Could not find an input field with label ${expectedInputLabel1}`
    );
    expect(inputFields[1].innerHTML).contains(
      expectedInputLabel2,
      `Could not find an input field with label ${expectedInputLabel2}`
    );
    expect(inputFields[2].innerHTML).contains(
      expectedInputLabel3,
      `Could not find an input field with label ${expectedInputLabel3}`
    );
    expect(inputFields[3].innerHTML).contains(
      expectedInputLabel4,
      `Could not find an input field with label ${expectedInputLabel4}`
    );
    expect(inputFields[4].innerHTML).contains(
      expectedInputLabel5,
      `Could not find an input field with label ${expectedInputLabel5}`
    );
  });
});
