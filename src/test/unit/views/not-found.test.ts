import { expect } from 'chai';
import request from 'supertest';

import { app } from '../../../main/app';

const PAGE_URL = '/not-found';
const headingClass = 'govuk-heading-xl';

let htmlRes: Document;
describe('Not found page', () => {
  beforeAll(async () => {
    await request(app)
      .get(PAGE_URL)
      .then(res => {
        htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
      });
  });

  it('should display header', () => {
    const header = htmlRes.getElementsByClassName(headingClass);
    expect(header[0].innerHTML).contains('Page Not Found', 'Could not find the header');
  });
});

describe('Not found page invalid url', () => {
  beforeAll(async () => {
    await request(app)
      .get('/not-a-real-page')
      .then(res => {
        htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
      });
  });

  it('should display header', () => {
    const header = htmlRes.getElementsByClassName(headingClass);
    expect(header[0].innerHTML).contains('Page Not Found', 'Could not find the header');
  });
});
