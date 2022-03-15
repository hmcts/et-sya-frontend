import { expect } from 'chai';
import request from 'supertest';

import { app } from '../../../main/app';

const PAGE_URL = '/work-address';

const titleClass = 'govuk-heading-xl';
const expectedPageHeaderText = 'Where do you work?';
const buttonClass = 'govuk-button';
const inputs = '[class*="address"]';
let htmlRes: Document;

describe('Work Address Page', () => {
  beforeAll(async () => {
    await request(app)
      .get(PAGE_URL)
      .then(res => {
        htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
      });
  });

  it('should display title', () => {
    const title = htmlRes.getElementsByClassName(titleClass);
    expect(title[0].innerHTML).contains(expectedPageHeaderText, 'Page title does not exist');
  });

  it('should display save for later button', () => {
    const button = htmlRes.getElementsByClassName(buttonClass);
    expect(button[1].innerHTML).contains('Save for later', 'Could not find the button');
  });

  it('should display 5 input fields', () => {
    const inputFields = htmlRes.querySelectorAll(inputs);
    expect(inputFields.length).equal(5, `only ${inputFields.length} found`);
  });
});
