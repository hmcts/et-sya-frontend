import fs from 'fs';
import path from 'path';

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

const titleClass = 'govuk-heading-l';
const completedClass = 'hmcts-progress-bar__icon--complete';

const expectedTitle = hubJson.header;
const statusTexts = [hubJson.accepted, hubJson.received, hubJson.details, hubJson.decision];

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
    expect(title[0].innerHTML).toMatch(expectedTitle);
  });

  describe('Progress bar completed states', () => {
    it.each([
      {
        expectedCompleted: [],
        userCase: {
          state: CaseState.SUBMITTED,
          et3IsThereAnEt3Response: YesOrNo.NO,
        },
      },
      {
        expectedCompleted: statusTexts.slice(0, 1),
        userCase: {
          state: CaseState.ACCEPTED,
          et3IsThereAnEt3Response: YesOrNo.NO,
        },
      },
      {
        expectedCompleted: statusTexts.slice(0, 2),
        userCase: {
          state: CaseState.ACCEPTED,
          et3IsThereAnEt3Response: YesOrNo.YES,
        },
      },
    ])('should show correct completed progress bar completed tasks', async ({ expectedCompleted, userCase }) => {
      await request(mockApp({ userCase }))
        .get(PageUrls.CITIZEN_HUB)
        .then(res => {
          htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
        });

      const completedElements = htmlRes.getElementsByClassName(completedClass);
      const completedTexts = [];

      for (const element of completedElements) {
        completedTexts.push(element.nextElementSibling.textContent);
      }

      expect(completedTexts).toStrictEqual(expectedCompleted);
    });
  });
});
