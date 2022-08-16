import { expect } from 'chai';
import request from 'supertest';

import { mockApp } from '../mocks/mockApp';

const PAGE_URL = '/reasonable-adjustments';
const titleClass = 'govuk-heading-xl';
const expectedTitle =
  'Do you have a physical, mental or learning disability or long term health condition that means you need support during your case?';
const buttonClass = 'govuk-button';
const inputs = 'govuk-radios__item';

let htmlRes: Document;
describe('Reasonable Adjustments page', () => {
  beforeAll(async () => {
    await request(mockApp({}))
      .get(PAGE_URL)
      .then(res => {
        htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
      });
  });

  it('should display page heading', () => {
    const title = htmlRes.getElementsByClassName(titleClass);
    expect(title[0].innerHTML).contains(expectedTitle, 'Page title does not exist');
  });

  it('should display save and continue button', () => {
    const button = htmlRes.getElementsByClassName(buttonClass);
    expect(button[4].innerHTML).contains('Save and continue', 'Could not find the button');
  });

  it('should display radios', () => {
    const radios = htmlRes.getElementsByClassName(inputs);
    expect(radios.length).equal(2, `only ${radios.length} found`);
  });
});
