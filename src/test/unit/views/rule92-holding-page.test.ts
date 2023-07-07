import fs from 'fs';
import path from 'path';

import { expect } from 'chai';
import request from 'supertest';

import { PageUrls } from '../../../main/definitions/constants';
import { mockApp } from '../mocks/mockApp';

const rule92HoldingPageJsonRaw = fs.readFileSync(
  path.resolve(__dirname, '../../../main/resources/locales/en/translation/rule92-holding-page.json'),
  'utf-8'
);
const rule92HoldingPageJson = JSON.parse(rule92HoldingPageJsonRaw);
const titleClass = 'govuk-panel__title';
const buttonClass = 'govuk-button';
const expectedTitle = rule92HoldingPageJson.titleText;

let htmlRes: Document;
describe('Respond to application complete page', () => {
  beforeAll(async () => {
    await request(mockApp({}))
      .get(PageUrls.RULE92_HOLDING_PAGE)
      .then(res => {
        htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
      });
  });

  it('should display panel title', () => {
    const title = htmlRes.getElementsByClassName(titleClass);
    expect(title[0].innerHTML).contains(expectedTitle, 'Panel title does not exist');
  });

  it('should display close button', () => {
    const button = htmlRes.getElementsByClassName(buttonClass);
    expect(button[5].innerHTML).contains(rule92HoldingPageJson.button, 'Could not find the button');
  });
});
