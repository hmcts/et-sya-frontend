import fs from 'fs';
import path from 'path';

import { expect } from 'chai';
import request from 'supertest';

import { app } from '../../../main/app';

const checklistJsonRaw = fs.readFileSync(
  path.resolve(__dirname, '../../../main/resources/locales/en/translation/checklist.json'),
  'utf-8'
);
const checklistJson = JSON.parse(checklistJsonRaw);
const PAGE_URL = '/checklist';
const titleClass = 'govuk-heading-l';
const pClass = 'govuk-body-m';
const panelClass = 'govuk-panel';
const buttonClass = 'govuk-button';
const expectedTitle = checklistJson.pageTitle;

let htmlRes: Document;
describe('Checklist page', () => {
  beforeAll(async () => {
    await request(app)
      .get(PAGE_URL)
      .then(res => {
        htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
      });
  });

  it('should display GDS panel component', () => {
    const panel = htmlRes.getElementsByClassName(panelClass);
    expect(panel.length).equal(1, '1 panel component does not exist');
  });

  it('should display title', () => {
    const title = htmlRes.getElementsByClassName(titleClass);
    expect(title[0].innerHTML).contains(expectedTitle, 'Page title does not exist');
  });

  it('should display 5 paragraphs', () => {
    const p = htmlRes.getElementsByClassName(pClass);
    expect(p.length).equal(5, '5 paragraphs do not exist');
  });

  it('should display continue button', () => {
    const button = htmlRes.getElementsByClassName(buttonClass);
    expect(button[4].innerHTML).contains('Continue', 'Could not find the button');
  });
});
