import fs from 'fs';
import path from 'path';

import { expect } from 'chai';
import request from 'supertest';

import { app } from '../../../main/app';

const homeJsonRaw = fs.readFileSync(
  path.resolve(__dirname, '../../../main/resources/locales/en/translation/home.json'),
  'utf-8'
);
const homeJson = JSON.parse(homeJsonRaw);
const PAGE_URL = '/';
const titleClass = 'govuk-heading-xl';
const pClass = 'govuk-body';
const insetTxtClass = 'govuk-inset-text';
const warnTxtClass = 'govuk-warning-text';
const buttonClass = 'govuk-button';
const exprectedTitle = homeJson.pageTitle;
const expectedP1 = homeJson.serviceInfo;
const expectedP2 = homeJson.saveInfo;

let htmlRes: Document;
describe('Onboarding (home) page', () => {
  beforeAll(async () => {
    await request(app)
      .get(PAGE_URL)
      .then(res => {
        htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
      });
  });

  it('should display title', () => {
    const title = htmlRes.getElementsByClassName(titleClass);
    expect(title[0].innerHTML).contains(exprectedTitle, 'Page title does not exist');
  });

  it('should display firt paragraph', () => {
    const p = htmlRes.getElementsByClassName(pClass);
    expect(p[6].innerHTML).contains(expectedP1, 'P1 does not exist');
  });

  it('should display GDS inset text component', () => {
    const insetTxt = htmlRes.getElementsByClassName(insetTxtClass);
    expect(insetTxt.length).equal(1, '1 inset text component does not exist');
  });

  it('should display second paragraph', () => {
    const p = htmlRes.getElementsByClassName(pClass);
    expect(p[7].innerHTML).contains(expectedP2, 'P2 does not exist');
  });

  it('should display 2 GDS warning text components', () => {
    const warningTxt = htmlRes.getElementsByClassName(warnTxtClass);
    expect(warningTxt.length).equal(2, '2 warning text components do not exist');
  });

  it('should display start now button', () => {
    const button = htmlRes.getElementsByClassName(buttonClass);
    expect(button[5].innerHTML).contains('Start now', 'Could not find the button');
  });
});
