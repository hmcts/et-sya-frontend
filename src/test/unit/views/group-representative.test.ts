import fs from 'fs';
import path from 'path';

import { expect } from 'chai';
import request from 'supertest';

import { mockApp } from '../mocks/mockApp';

const jsonRaw = fs.readFileSync(
  path.resolve(__dirname, '../../../main/resources/locales/en/translation/group-representative.json'),
  'utf-8'
);
const json = JSON.parse(jsonRaw);

const PAGE_URL = '/group-representative';
const titleClass = 'govuk-heading-xl';

let htmlRes: Document;

describe('Group representative page', () => {
  beforeAll(async () => {
    await request(mockApp({}))
      .get(PAGE_URL)
      .then(res => {
        htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
      });
  });

  it('should display title', () => {
    const title = htmlRes.getElementsByClassName(titleClass);
    expect(title[0].innerHTML).contains(json.h1, 'Page title does not exist');
  });

  it('should display radio buttons', () => {
    const radioButtons = htmlRes.getElementsByClassName('govuk-radios__item');
    expect(radioButtons.length).equal(2, 'Radio buttons not found');
  });

  it('should display bullet points', () => {
    const bullets = htmlRes.querySelectorAll('.govuk-list--bullet li');
    expect(bullets.length).equal(3, 'Expected 3 bullet points');
  });
});
