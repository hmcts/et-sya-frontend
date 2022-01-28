import { expect } from 'chai';
import { app } from '../../../main/app';
import request from 'supertest';
import fs from 'fs';
import path from 'path';

const newAccountJsonRaw = fs.readFileSync(path.resolve(__dirname, '../../../main/resources/locales/en/translation/new-account-landing.json'), 'utf-8');
const newAccountJson = JSON.parse(newAccountJsonRaw);
const PAGE_URL = '/new-account-landing';
const titleClass = 'govuk-panel__title';
const pClass = 'govuk-panel__body';
const panelClass = 'govuk-panel--informational';
const buttonClass = 'govuk-button';
const expectedTitle = newAccountJson.h1;


let htmlRes: Document;
describe('Checklist page', () => {
  beforeAll(async () => {
    await request(app).get(PAGE_URL).then(res => {
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

  it('should display 2 paragraphs', () => {
    const p = htmlRes.getElementsByClassName(pClass);
    expect(p.length).equal(2,'2 paragraphs should exist');
  });

  it('should display two buttons', () => {
    const button = htmlRes.getElementsByClassName(buttonClass);
    expect(button.length).equal(2, 'Expected two buttons');
    expect(button[0].innerHTML).contains('Continue', 'Could not find the button');
    expect(button[1].innerHTML).contains('Save for later', 'Could not find the button');
  });

});  