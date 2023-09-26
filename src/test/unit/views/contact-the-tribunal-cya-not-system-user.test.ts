import fs from 'fs';
import path from 'path';

import { expect } from 'chai';
import request from 'supertest';

import { PageUrls } from '../../../main/definitions/constants';
import { mockApp } from '../mocks/mockApp';

const contactTheTribunalCyaJsonRaw = fs.readFileSync(
  path.resolve(__dirname, '../../../main/resources/locales/en/translation/contact-the-tribunal-cya.json'),
  'utf-8'
);
const contactTheTribunalCyaJson = JSON.parse(contactTheTribunalCyaJsonRaw);

const titleClass = 'govuk-heading-l';
const buttonClass = 'govuk-button';
const detailsClass = 'govuk-body';

let htmlRes: Document;

describe('Contact the Tribunal Check Your Answer page', () => {
  beforeAll(async () => {
    await request(
      mockApp({
        userCase: {
          contactApplicationType: 'witness',
        },
      })
    )
      .get(PageUrls.CONTACT_THE_TRIBUNAL_CYA_NOT_SYSTEM_USER)
      .then(res => {
        htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
      });
  });

  it('should display title', () => {
    const title = htmlRes.getElementsByClassName(titleClass);
    expect(title[0].innerHTML).contains(contactTheTribunalCyaJson.title, 'Page title does not exist');
  });

  it('should display first paragraph', () => {
    const p1 = htmlRes.getElementsByClassName(detailsClass);
    expect(p1[6].innerHTML).contains(
      contactTheTribunalCyaJson.youCannotMakeFurtherChanges,
      'First paragraph does not exist'
    );
  });

  it('should display Store application button', () => {
    const button = htmlRes.getElementsByClassName(buttonClass);
    expect(button[5].innerHTML).contains(contactTheTribunalCyaJson.storeApplication, 'Could not find the button');
  });
});
