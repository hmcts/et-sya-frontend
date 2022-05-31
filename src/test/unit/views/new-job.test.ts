import fs from 'fs';
import path from 'path';

import { expect } from 'chai';
import request from 'supertest';

import { PageUrls } from '../../../main/definitions/constants';
import { mockApp } from '../mocks/mockApp';

const newJobJsonRaw = fs.readFileSync(
  path.resolve(__dirname, '../../../main/resources/locales/en/translation/new-job.json'),
  'utf-8'
);
const newJobJson = JSON.parse(newJobJsonRaw);

const titleClass = 'govuk-heading-xl';
const expectedTitle = newJobJson.h1;
const buttonClass = 'govuk-button';
const radios = 'govuk-radios';

let htmlRes: Document;
describe('New Job page', () => {
  beforeAll(async () => {
    await request(mockApp({}))
      .get(PageUrls.NEW_JOB)
      .then(res => {
        htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
      });
  });

  it('should display title', () => {
    const title = htmlRes.getElementsByClassName(titleClass);
    expect(title[0].innerHTML).contains(expectedTitle, 'Page title does not exist');
  });

  it('should display correct radio buttons', () => {
    const radioButtons = htmlRes.getElementsByClassName(radios);
    expect(radioButtons.length).equal(1, `only ${radioButtons.length} found`);
  });

  it('should display Save and continue button', () => {
    const button = htmlRes.getElementsByClassName(buttonClass);
    expect(button[0].innerHTML).contains('Save and continue', 'Could not find the button');
  });
});
