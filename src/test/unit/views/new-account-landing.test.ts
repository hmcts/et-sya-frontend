import fs from 'fs';
import path from 'path';

import { expect } from 'chai';
import request from 'supertest';

import { mockApp } from '../mocks/mockApp';

const newAccountJsonRaw = fs.readFileSync(
  path.resolve(__dirname, '../../../main/resources/locales/en/translation/new-account-landing.json'),
  'utf-8'
);
const newAccountJson = JSON.parse(newAccountJsonRaw);
const PAGE_URL = '/new-account-landing';
const titleClass = 'govuk-panel__title';
const pClass = 'govuk-panel__body';
const panelClass = 'govuk-panel govuk-panel--interruption';
const buttonClass = 'govuk-button';
const expectedTitle = newAccountJson.h1;
const expectedP1 = newAccountJson.p1;
const expectedP2 = newAccountJson.p2;

let htmlRes: Document;
describe('New Account Landing page', () => {
  beforeAll(async () => {
    await request(mockApp({}))
      .get(PAGE_URL)
      .then(res => {
        htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
      });
  });

  it('should display GDS panel component', () => {
    const panel = htmlRes.getElementsByClassName(panelClass);
    expect(panel.length).equal(1, 'Single panel component does not exist');
  });

  it('should display panel title', () => {
    const title = htmlRes.getElementsByClassName(titleClass);
    expect(title[0].innerHTML).contains(expectedTitle, 'Panel title does not exist');
  });

  it('should display 2 paragraph classes', () => {
    const p = htmlRes.getElementsByClassName(pClass);
    expect(p.length).equal(2, '2 paragraph class should exist');
    expect(p[0].innerHTML).contains(expectedP1, 'Could not find P1 text');
    expect(p[1].innerHTML).contains(expectedP2, 'Could not find P2 text');
  });

  it('should display save and continue and save as draft buttons', () => {
    const button = htmlRes.getElementsByClassName(buttonClass);
    expect(button.length).equal(6, 'Expected six buttons');
    expect(button[4].innerHTML).contains('Continue', 'Could not find the button');
    expect(button[5].innerHTML).contains('Save as draft', 'Could not find the button');
  });
});
