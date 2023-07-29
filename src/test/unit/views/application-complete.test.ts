import fs from 'fs';
import path from 'path';

import { expect } from 'chai';
import request from 'supertest';

import { PageUrls } from '../../../main/definitions/constants';
import { mockApp } from '../mocks/mockApp';

const applicationCompleteJsonRaw = fs.readFileSync(
  path.resolve(__dirname, '../../../main/resources/locales/en/translation/application-complete.json'),
  'utf-8'
);
const applicationCompleteJson = JSON.parse(applicationCompleteJsonRaw);
const titleClass = 'govuk-panel__title';
const panelClass = 'govuk-panel govuk-panel--confirmation';
const pHeader = 'govuk-heading-m';
const buttonClass = 'govuk-button';
const expectedTitle = applicationCompleteJson.titleText;

let htmlRes: Document;
describe('Application complete page', () => {
  beforeAll(async () => {
    await request(mockApp({}))
      .get(PageUrls.APPLICATION_COMPLETE)
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
    const title = htmlRes.getElementsByClassName(pHeader);
    expect(title[2].innerHTML).contains(applicationCompleteJson.pHead, 'Panel title does not exist');
  });

  it('should display save and continue and save as draft buttons', () => {
    const button = htmlRes.getElementsByClassName(buttonClass);
    expect(button.length).equal(6, 'Expected six buttons');
    expect(button[5].innerHTML).contains(applicationCompleteJson.button, 'Could not find the button');
  });
});
