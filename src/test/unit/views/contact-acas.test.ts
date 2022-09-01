import fs from 'fs';
import path from 'path';

import { expect } from 'chai';
import request from 'supertest';

import { app } from '../../../main/app';

const contactAcasJsonRaw = fs.readFileSync(
  path.resolve(__dirname, '../../../main/resources/locales/en/translation/contact-acas.json'),
  'utf-8'
);
const contactAcasJson = JSON.parse(contactAcasJsonRaw);
const PAGE_URL = '/contact-acas';
const titleClass = 'govuk-heading-xl';
const warningClass = 'govuk-warning-text';
const buttonClass = 'govuk-button';
const expectedTitle = contactAcasJson.h1;

let htmlRes: Document;
describe('Contact Acas page', () => {
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

  it('should display important content', () => {
    const importantContent = htmlRes.getElementsByClassName(warningClass);
    expect(importantContent.length).equal(1, 'Important content does not exist');
  });

  it('should display contact button', () => {
    const button = htmlRes.getElementsByClassName(buttonClass);
    expect(button[5].innerHTML).contains(contactAcasJson.buttonTxt, 'Could not find the button');
  });
});
