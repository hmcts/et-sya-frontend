import fs from 'fs';
import path from 'path';

import { expect } from 'chai';
import request from 'supertest';

import { mockApp } from '../mocks/mockApp';

const acasJsonRaw = fs.readFileSync(
  path.resolve(__dirname, '../../../main/resources/locales/en/translation/acas-cert-num.json'),
  'utf-8'
);
const acasJson = JSON.parse(acasJsonRaw);

const respondentName = 'Globo Gym';
const titleClass = 'govuk-heading-xl';
const expectedTitle: string = acasJson.h1;

let htmlRes: Document;
describe('Do you have an Acas cert num Page', () => {
  beforeAll(async () => {
    await request(
      mockApp({
        userCase: {
          respondents: [
            {
              respondentNumber: 1,
              respondentName,
            },
          ],
        },
      })
    )
      .get('/respondent/1/acas-cert-num')
      .then(res => {
        htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
      });
  });

  it('should display title', () => {
    const title = htmlRes.getElementsByClassName(titleClass);
    expect(title[0].innerHTML).contains(expectedTitle, 'Page title does not exist');
  });
});
