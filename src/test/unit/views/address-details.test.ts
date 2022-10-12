import { expect } from 'chai';
import request from 'supertest';

import { mockApp } from '../mocks/mockApp';

const PAGE_URL = '/address-details';
const titleClass = 'govuk-heading-xl';
const expectedTitle = 'What is your contact or home address?';
const buttonClass = 'govuk-button';
const inputs = '[class*="address"]';
const expectedInputLabel1 = 'Address line 1';
const expectedInputLabel2 = 'Address line 2 (optional)';
const expectedInputLabel3 = 'Town or city';
const expectedInputLabel4 = 'Country';
const expectedInputLabel5 = 'Postcode or area code (optional)';
const errorTitleClass = 'govuk-error-summary__title';
const expectedErrorTitle = 'There is a problem';
const errorPostCodeRequiredId = 'errorPostCodeRequired';
const expectedPostCodeRequiredText = 'Enter a postcode. For example, SW1 1AA';
const errorPostCodeInvalidId = 'errorPostCodeInvalid';
const expectedPostCodeInvalidText = 'Enter a valid postcode. For example, SW1 1AA';
const errorAddressNotSelectedId = 'errorAddressNotSelected';
const expectedAddressNotSelectedText = 'Select an address';

let htmlRes: Document;
describe('Address details page', () => {
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

  it("should display the 'Find Address' button", () => {
    const button = htmlRes.getElementsByClassName(buttonClass);
    expect(button[5].innerHTML).contains('Find address', 'Could not find the button');
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

  it('should find hidden error summary title', () => {
    const title = htmlRes.getElementsByClassName(errorTitleClass);
    expect(title[0].innerHTML).contains(expectedErrorTitle, 'Error summary title does not exist');
  });

  it('should find hidden error message: post code required', () => {
    const error = htmlRes.getElementById(errorPostCodeRequiredId);
    expect(error.textContent).equal(expectedPostCodeRequiredText);
  });

  it('should find hidden error message: post code invalid', () => {
    const error = htmlRes.getElementById(errorPostCodeInvalidId);
    expect(error.textContent).equal(expectedPostCodeInvalidText);
  });

  it('should find hidden error message: address not selected', () => {
    const error = htmlRes.getElementById(errorAddressNotSelectedId);
    expect(error.textContent).equal(expectedAddressNotSelectedText);
  });
});
