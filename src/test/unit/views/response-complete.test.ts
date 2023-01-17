import fs from 'fs';
import path from 'path';

import { expect } from 'chai';
import request from 'supertest';

import { PageUrls } from '../../../main/definitions/constants';
import { mockApp } from '../mocks/mockApp';

const responseCompleteJsonRaw = fs.readFileSync(
  path.resolve(__dirname, '../../../main/resources/locales/en/translation/response-complete.json'),
  'utf-8'
);
const responseCompleteJson = JSON.parse(responseCompleteJsonRaw);
const titleClass = 'govuk-panel__title';
const panelClass = 'govuk-panel govuk-panel--confirmation';
const headingClass = 'govuk-heading-m';
const buttonClass = 'govuk-button';
const expectedTitle = responseCompleteJson.titleText;

let htmlRes: Document;
describe('Response complete page', () => {
  beforeAll(async () => {
    await request(mockApp({}))
      .get(PageUrls.RESPONSE_COMPLETE)
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

  it('should display paragraph header', () => {
    const title = htmlRes.getElementsByClassName(headingClass);
    expect(title[2].innerHTML).contains(responseCompleteJson.h1, 'Panel title does not exist');
  });

  it('should display close button', () => {
    const button = htmlRes.getElementsByClassName(buttonClass);
    expect(button[5].innerHTML).contains(responseCompleteJson.button, 'Could not find the button');
  });
});
