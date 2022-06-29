import fs from 'fs';
import path from 'path';

import { expect } from 'chai';
import request from 'supertest';

import { PageUrls } from '../../../main/definitions/constants';
import { mockApp } from '../mocks/mockApp';

const translationRaw = fs.readFileSync(
  path.resolve(__dirname, '../../../main/resources/locales/en/translation/respondent-address.json'),
  'utf-8'
);
const respondentAddressJson = JSON.parse(translationRaw);

const respondentName = 'Globo Gym';
const titleClass = 'govuk-heading-xl';
const insetClass = 'govuk-inset-text';
const expectedTitle = respondentAddressJson.h1 + respondentName;

let htmlRes: Document;
describe('Respondent Address Page', () => {
  beforeAll(async () => {
    await request(
      mockApp({
        userCase: {
          selectedRespondent: 1,
          respondents: [
            {
              respondentNumber: 1,
              respondentName,
            },
          ],
        },
      })
    )
      .get(PageUrls.RESPONDENT_ADDRESS)
      .then(res => {
        htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
      });
  });

  it('should display title', () => {
    const title = htmlRes.getElementsByClassName(titleClass);
    expect(title[0].innerHTML).contains(expectedTitle, 'Page title does not exist');
  });

  it('should display insetText', () => {
    const title = htmlRes.getElementsByClassName(insetClass);
    expect(title[0].innerHTML).contains(respondentAddressJson.insetText, 'Inset text does not exist');
  });
});
