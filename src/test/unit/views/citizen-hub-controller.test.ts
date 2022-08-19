import fs from 'fs';
import path from 'path';

import { expect } from 'chai';
import request from 'supertest';

import { YesOrNo } from '../../../main/definitions/case';
import { PageUrls } from '../../../main/definitions/constants';
import { CaseState } from '../../../main/definitions/definition';
import { mockApp } from '../mocks/mockApp';

const hubJsonRaw = fs.readFileSync(
  path.resolve(__dirname, '../../../main/resources/locales/en/translation/citizen-hub.json'),
  'utf-8'
);

const hubJson = JSON.parse(hubJsonRaw);

//const PAGE_URL = '/citizen-hub';
const titleClass = 'govuk-heading-l';
const completedClass = 'hmcts-progress-bar__icon--complete';

const expectedTitle = hubJson.header;
const expectedCompleted = [hubJson.accepted, hubJson.received];

let htmlRes: Document;
describe('Citizen hub page', () => {
  beforeAll(async () => {
    await request(
      mockApp({
        userCase: {
          id: '123',
          state: CaseState.ACCEPTED,
          et3IsThereAnEt3Response: YesOrNo.YES,
        },
      })
    )
      .get(PageUrls.CITIZEN_HUB)
      .then(res => {
        htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
      });
  });

  it('should display title', () => {
    const title = htmlRes.getElementsByClassName(titleClass);
    expect(title[0].innerHTML).contains(expectedTitle, 'Page title does not exist');
  });

  it('should show compete', () => {
    const completedNode = htmlRes.getElementsByClassName(completedClass)[0].nextElementSibling;
    const completedNode2 = htmlRes.getElementsByClassName(completedClass)[1].nextElementSibling;
    expect(completedNode.textContent).contains(expectedCompleted[0], 'Page title does not exist');
    expect(completedNode2.textContent).contains(expectedCompleted[1], 'Page title does not exist');
  });
});
