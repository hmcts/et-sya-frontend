import fs from 'fs';
import path from 'path';

import request from 'supertest';

import { CaseWithId, YesOrNo } from '../../../main/definitions/case';
import { PageUrls } from '../../../main/definitions/constants';
import { CaseState, HubLinkStatus } from '../../../main/definitions/definition';
import { mockApp } from '../mocks/mockApp';

const hubJsonRaw = fs.readFileSync(
  path.resolve(__dirname, '../../../main/resources/locales/en/translation/citizen-hub.json'),
  'utf-8'
);

const hubJson = JSON.parse(hubJsonRaw);

const completedClass = 'hmcts-progress-bar__icon--complete';
const greenTagSelector = '.govuk-tag.app-task-list__tag.govuk-tag--green';
const titleClassSelector = '.govuk-heading-l';
const caseNumberSelector = '#caseNumber';
const currElementSelector = '.hmcts-progress-bar__list-item[aria-current=step]';

const statusTexts = [hubJson.accepted, hubJson.received, hubJson.details, hubJson.decision];

let htmlRes: Document;
describe('Citizen hub page', () => {
  describe('Progress bar', () => {
    const userCases = [
      {
        state: CaseState.SUBMITTED,
        et3IsThereAnEt3Response: YesOrNo.NO,
      },
      {
        state: CaseState.ACCEPTED,
        et3IsThereAnEt3Response: YesOrNo.NO,
      },
      {
        state: CaseState.ACCEPTED,
        et3IsThereAnEt3Response: YesOrNo.YES,
      },
    ];

    it.each([
      {
        expectedCompleted: [],
        userCase: userCases[0],
      },
      {
        expectedCompleted: statusTexts.slice(0, 1),
        userCase: userCases[1],
      },
      {
        expectedCompleted: statusTexts.slice(0, 2),
        userCase: userCases[2],
      },
    ])('should show correct completed progress bar completed tasks: %o', async ({ expectedCompleted, userCase }) => {
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

    it.each([
      {
        expectedCurrStep: hubJson.accepted,
        userCase: userCases[0],
      },
      {
        expectedCurrStep: hubJson.received,
        userCase: userCases[1],
      },
      {
        expectedCurrStep: hubJson.details,
        userCase: userCases[2],
      },
    ])('should show correct completed progress bar completed tasks: %o', async ({ expectedCurrStep, userCase }) => {
      await request(mockApp({ userCase }))
        .get(PageUrls.CITIZEN_HUB)
        .then(res => {
          htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
        });

      const currElement = htmlRes.querySelector(currElementSelector);

      expect(currElement.textContent.trim()).toStrictEqual(expectedCurrStep);
    });
  });

  describe('Hub content', () => {
    beforeAll(async () => {
      await request(
        mockApp({
          userCase: {
            ethosCaseReference: '654321/2022',
            firstName: 'Paul',
            lastName: 'Mumbere',
            respondents: [{ respondentNumber: 1, respondentName: 'Itay' }],
            hubLinkStatuses: {
              hubS1LinkStatus: HubLinkStatus.COMPLETED,
              hubS2LinkStatus: HubLinkStatus.VIEWED,
              hubS3LinkStatus: HubLinkStatus.NOT_YET_AVAILABLE,
              hubS4LinkStatus: HubLinkStatus.OPTIONAL,
              hubS5Link1Status: HubLinkStatus.OPTIONAL,
              hubS5Link2Status: HubLinkStatus.OPTIONAL,
              hubS5Link3Status: HubLinkStatus.OPTIONAL,
              hubS6LinkStatus: HubLinkStatus.SUBMITTED,
              hubS7LinkStatus: HubLinkStatus.SUBMITTED,
              hubS8LinkStatus: HubLinkStatus.OPTIONAL,
            },
          } as Partial<CaseWithId>,
        })
      )
        .get(PageUrls.CITIZEN_HUB)
        .then(res => {
          htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
        });
    });

    it.each([
      { selector: titleClassSelector, expectedText: 'Case overview - Paul Mumbere vs Itay' },
      { selector: caseNumberSelector, expectedText: 'Case number 654321/2022' },
    ])('should have the correct text for the given selector: %o', ({ selector, expectedText }) => {
      expect(htmlRes.querySelector(selector).textContent.trim()).toBe(expectedText);
    });

    it.each([
      { selector: greenTagSelector, expectedText: 'Completed', expectedCount: 1 },
      { selector: greenTagSelector, expectedText: 'Viewed', expectedCount: 1 },
    ])('should have the correct statuses: %o', ({ selector, expectedText, expectedCount }) => {
      const elements = htmlRes.querySelectorAll(selector);

      expect(Array.from(elements).filter(el => el.textContent.trim() === expectedText)).toHaveLength(expectedCount);
    });
  });
});
