import { expect } from 'chai';
import request from 'supertest';

import { app } from '../../../main/app';

const PAGE_URL = '/check-your-answers';
const expectedTitle = 'Check your answers';
const titleClass = 'govuk-heading-xl';
const buttonClass = 'govuk-button';

let htmlRes: Document;
describe('Check your answers confirmation page', () => {
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

  it('should display submit claim button', () => {
    const button = htmlRes.getElementsByClassName(buttonClass);
    expect(button[0].innerHTML).contains('Submit claim', 'Could not find the submit claim button');
  });

  it('should display save for later button', () => {
    const button = htmlRes.getElementsByClassName(buttonClass);
    expect(button[1].innerHTML).contains('Save for later', 'Could not find the button');
  });
});
