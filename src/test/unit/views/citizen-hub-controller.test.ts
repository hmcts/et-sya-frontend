import fs from 'fs';
import path from 'path';

import request from 'supertest';

import { CaseWithId, YesOrNo } from '../../../main/definitions/case';
import { PageUrls } from '../../../main/definitions/constants';
import { CaseState } from '../../../main/definitions/definition';
import { HubLinkNames, HubLinkStatus, HubLinks } from '../../../main/definitions/hub';
import { mockApp } from '../mocks/mockApp';

const hubJsonRaw = fs.readFileSync(
  path.resolve(__dirname, '../../../main/resources/locales/en/translation/citizen-hub.json'),
  'utf-8'
);

const hubJson = JSON.parse(hubJsonRaw);

const completedClass = 'hmcts-progress-bar__icon--complete';
const titleClassSelector = '.govuk-heading-l';
const caseNumberSelector = '#caseNumber';
const currElementSelector = '.hmcts-progress-bar__list-item[aria-current=step]';

const greenTagSelector = '.govuk-tag.app-task-list__tag.govuk-tag--green';
const turquoiseTagSelector = '.govuk-tag.app-task-list__tag.govuk-tag--turquoise';
const greyTagSelector = '.govuk-tag.app-task-list__tag.govuk-tag--grey';
const blueTagSelector = '.govuk-tag.app-task-list__tag.govuk-tag--blue';

const statusTexts = [hubJson.accepted, hubJson.received, hubJson.details, hubJson.decision];
//todo fix this file's tests with the replace(:caseID) and undo skipping
let htmlRes: Document;
describe.skip('Citizen hub page', () => {
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
      const hubLinks = new HubLinks();
      Object.keys(hubLinks).forEach(key => {
        hubLinks[key] = {
          link: PageUrls.HOME,
          status: HubLinkStatus.OPTIONAL,
        };
      });

      hubLinks[HubLinkNames.PersonalDetails].status = HubLinkStatus.SUBMITTED;
      hubLinks[HubLinkNames.Et1ClaimForm].status = HubLinkStatus.SUBMITTED;
      hubLinks[HubLinkNames.RespondentResponse].status = HubLinkStatus.COMPLETED;
      hubLinks[HubLinkNames.HearingDetails].status = HubLinkStatus.NOT_YET_AVAILABLE;
      hubLinks[HubLinkNames.RequestsAndApplications].status = HubLinkStatus.VIEWED;

      await request(
        mockApp({
          userCase: {
            ethosCaseReference: '654321/2022',
            firstName: 'Paul',
            lastName: 'Mumbere',
            respondents: [{ respondentNumber: 1, respondentName: 'Itay' }],
            hubLinks,
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
      { selector: turquoiseTagSelector, expectedText: 'Viewed', expectedCount: 1 },
      { selector: turquoiseTagSelector, expectedText: 'Submitted', expectedCount: 2 },
      { selector: greyTagSelector, expectedText: 'Not available yet', expectedCount: 1 },
      { selector: blueTagSelector, expectedText: 'Optional', expectedCount: 5 },
    ])('should have the correct statuses: %o', ({ selector, expectedText, expectedCount }) => {
      const elements = htmlRes.querySelectorAll(selector);

      expect(Array.from(elements).filter(el => el.textContent.trim() === expectedText)).toHaveLength(expectedCount);
    });

    it.each([
      { selector: greyTagSelector, tagText: 'Not available yet', showLink: false },
      { selector: turquoiseTagSelector, tagText: 'Submitted', showLink: true },
    ])('should not show link iff tag is "Not available yet"', ({ selector, tagText, showLink }) => {
      const links = Array.from(htmlRes.querySelectorAll(selector))
        .filter(el => el.textContent.trim() === tagText)
        .map(tag => tag.previousElementSibling)
        .flatMap(sibling => Array.from(sibling.getElementsByTagName('a')));

      expect(links.length > 0).toBe(showLink);
    });
  });
});
