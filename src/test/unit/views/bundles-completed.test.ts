import fs from 'fs';
import path from 'path';

import { expect } from 'chai';
import request from 'supertest';

import { PageUrls } from '../../../main/definitions/constants';
import { mockApp } from '../mocks/mockApp';

const bundlesCompletedJsonRaw = fs.readFileSync(
  path.resolve(__dirname, '../../../main/resources/locales/en/translation/bundles-completed.json'),
  'utf-8'
);
const bundlesCompletedJson = JSON.parse(bundlesCompletedJsonRaw);
const titleClass = 'govuk-panel__title';
const panelClass = 'govuk-panel govuk-panel--confirmation';
const buttonClass = 'govuk-button';
const expectedTitle = bundlesCompletedJson.titleText;

let htmlRes: Document;
describe('Bundles completed page', () => {
  beforeAll(async () => {
    await request(mockApp({}))
      .get(PageUrls.BUNDLES_COMPLETED)
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

  it('should display What happens next within the main content', () => {
    const maincontent = htmlRes.querySelector('#main-content');
    const title = maincontent.querySelectorAll('.govuk-grid-column-two-thirds >.govuk-heading-m');
    expect(title[0].innerHTML).contains('What happens next', 'Paragraph title does not exist');
  });

  it('should display save and continue and save as draft buttons', () => {
    const button = htmlRes.getElementsByClassName(buttonClass);
    expect(button.length).equal(6, 'Expected six buttons');
    expect(button[5].innerHTML).contains(bundlesCompletedJson.button, 'Could not find the button');
  });
});
