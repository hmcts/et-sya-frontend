import fs from 'fs';
import path from 'path';

import axios, { AxiosResponse } from 'axios';
import request from 'supertest';

import { CaseApiDataResponse } from '../../../main/definitions/api/caseApiResponse';
import { CaseWithId } from '../../../main/definitions/case';
import { PageUrls } from '../../../main/definitions/constants';
import { CaseState } from '../../../main/definitions/definition';
import { HubLinkStatus } from '../../../main/definitions/hub';
import * as ApiFormatter from '../../../main/helper/ApiFormatter';
import mockUserCaseWithCitizenHubLinks from '../../../main/resources/mocks/mockUserCaseWithCitizenHubLinks';
import * as CaseService from '../../../main/services/CaseService';
import { CaseApi } from '../../../main/services/CaseService';
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

const notificationBannerSelector = 'div.govuk-notification-banner__content a.govuk-link';
const bannerLinkSelector = 'div.govuk-notification-banner__content a.govuk-link';
const bannerHeaderSelector = 'div.govuk-notification-banner__content h3';

jest.mock('axios');
const caseApi = new CaseApi(axios as jest.Mocked<typeof axios>);

const mockClient = jest.spyOn(CaseService, 'getCaseApi');
mockClient.mockReturnValue(caseApi);

let htmlRes: Document;
describe('Citizen hub page', () => {
  describe('Progress bar', () => {
    const statusTexts = [hubJson.accepted, hubJson.received, hubJson.details, hubJson.decision];
    const caseApiDataResponses = [
      {
        state: CaseState.SUBMITTED,
        case_data: {
          et3ResponseReceived: false,
        },
      },
      {
        state: CaseState.ACCEPTED,
        case_data: {
          et3ResponseReceived: false,
        },
      },
      {
        state: CaseState.ACCEPTED,
        case_data: {
          et3ResponseReceived: true,
        },
      },
    ];

    it.each([
      {
        expectedCompleted: [],
        caseApiDataResponse: caseApiDataResponses[0],
      },
      {
        expectedCompleted: statusTexts.slice(0, 1),
        caseApiDataResponse: caseApiDataResponses[1],
      },
      {
        expectedCompleted: statusTexts.slice(0, 2),
        caseApiDataResponse: caseApiDataResponses[2],
      },
    ])(
      'should show correct completed tasks in progress bar: %o',
      async ({ expectedCompleted, caseApiDataResponse }) => {
        caseApi.getUserCase = jest.fn().mockResolvedValue(
          Promise.resolve({
            data: {
              ...caseApiDataResponse,
              created_date: '2022-08-19T09:19:25.79202',
              last_modified: '2022-08-19T09:19:25.817549',
            },
          } as AxiosResponse<CaseApiDataResponse>)
        );

        await request(mockApp({}))
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
      }
    );

    it.each([
      {
        expectedCurrStep: hubJson.accepted,
        caseApiDataResponse: caseApiDataResponses[0],
      },
      {
        expectedCurrStep: hubJson.received,
        caseApiDataResponse: caseApiDataResponses[1],
      },
      {
        expectedCurrStep: hubJson.details,
        caseApiDataResponse: caseApiDataResponses[2],
      },
    ])('should show correct current progress bar task: %o', async ({ expectedCurrStep, caseApiDataResponse }) => {
      caseApi.getUserCase = jest.fn().mockResolvedValue(
        Promise.resolve({
          data: {
            ...caseApiDataResponse,
            created_date: '2022-08-19T09:19:25.79202',
            last_modified: '2022-08-19T09:19:25.817549',
          },
        } as AxiosResponse<CaseApiDataResponse>)
      );

      await request(mockApp({}))
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
      caseApi.getUserCase = jest.fn().mockResolvedValue({ body: {} });
      const mockFromApiFormat = jest.spyOn(ApiFormatter, 'fromApiFormat');
      mockFromApiFormat.mockReturnValue(mockUserCaseWithCitizenHubLinks);

      await request(
        mockApp({
          userCase: {} as Partial<CaseWithId>,
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
      { selector: greyTagSelector, expectedText: 'Waiting for the tribunal', expectedCount: 1 },
      { selector: blueTagSelector, expectedText: 'Optional', expectedCount: 4 },
    ])('should have the correct statuses: %o', ({ selector, expectedText, expectedCount }) => {
      const elements = htmlRes.querySelectorAll(selector);

      expect(Array.from(elements).filter(el => el.textContent.trim() === expectedText)).toHaveLength(expectedCount);
    });

    it.each([
      { selector: greyTagSelector, tagText: 'Not available yet', showLink: false },
      { selector: greyTagSelector, tagText: 'Waiting for the tribunal', showLink: false },
      { selector: turquoiseTagSelector, tagText: 'Submitted', showLink: true },
    ])('should not show link iff tag is "Not available yet"', ({ selector, tagText, showLink }) => {
      const links = Array.from(htmlRes.querySelectorAll(selector))
        .filter(el => el.textContent.trim() === tagText)
        .map(tag => tag.previousElementSibling)
        .flatMap(sibling => Array.from(sibling.getElementsByTagName('a')));

      expect(links.length > 0).toBe(showLink);
    });
  });

  describe('Hub alerts', () => {
    const documentDetailArray = [
      {
        id: '10',
        description: 'asdf',
      },
      {
        id: '11',
        description: 'asdf',
      },
    ];

    let mockedCase: CaseWithId;

    const mockFromApiFormat = jest.spyOn(ApiFormatter, 'fromApiFormat');
    caseApi.getUserCase = jest.fn().mockResolvedValue({ body: {} });

    beforeEach(() => {
      mockedCase = {
        id: '123',
        state: CaseState.AWAITING_SUBMISSION_TO_HMCTS,
        createdDate: 'August 19, 2022',
        lastModified: 'August 19, 2022',
      };
    });

    it.each([
      {
        userCaseDetails: { acknowledgementOfClaimLetterDetail: documentDetailArray },
        selector: bannerLinkSelector,
        expectedText: 'View the Acknowledgement of Claim',
      },
      {
        userCaseDetails: { rejectionOfClaimDocumentDetail: documentDetailArray },
        selector: bannerLinkSelector,
        expectedText: 'View the claim rejection',
      },
      {
        userCaseDetails: {
          acknowledgementOfClaimLetterDetail: documentDetailArray,
          hubLinksStatuses: {
            et1ClaimForm: HubLinkStatus.SUBMITTED_AND_VIEWED,
            respondentResponse: HubLinkStatus.NOT_YET_AVAILABLE,
          },
          et3ResponseReceived: true,
        },
        selector: bannerHeaderSelector,
        expectedText: 'The tribunal has received a response from the respondent',
      },
    ])(
      'should render text in banner for expected text: $expectedText',
      async ({ userCaseDetails, selector, expectedText }) => {
        mockedCase = { ...mockedCase, ...userCaseDetails };
        mockFromApiFormat.mockReturnValue(mockedCase);

        await request(
          mockApp({
            userCase: {} as Partial<CaseWithId>,
          })
        )
          .get(PageUrls.CITIZEN_HUB)
          .then(res => {
            htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
          });

        expect(htmlRes.querySelector(selector).innerHTML.trim()).toBe(expectedText);
      }
    );
  });

  describe('Alert containing a link to view the response acknowledgement documents on the citizen hub page', () => {
    it('should render link to Rejection of response document Page', async () => {
      caseApi.getUserCase = jest.fn().mockResolvedValue({ body: {} });

      const mockFromApiFormat = jest.spyOn(ApiFormatter, 'fromApiFormat');
      mockFromApiFormat.mockReturnValue({
        id: '123',
        state: CaseState.SUBMITTED,
        createdDate: 'August 19, 2022',
        lastModified: 'August 19, 2022',
        responseAcknowledgementDocumentDetail: [
          {
            id: 'responseAcknowledgeId1',
            description: 'asdf',
          },
          {
            id: 'responseAcknowledgeId2',
            description: 'asdf',
          },
        ],
      });

      await request(
        mockApp({
          userCase: {
            hubLinksStatuses: {
              documents: 'notAvailableYet',
              et1ClaimForm: 'submitted',
              hearingDetails: 'notAvailableYet',
              tribunalOrders: 'notAvailableYet',
              contactTribunal: 'notAvailableYet',
              personalDetails: 'notAvailableYet',
              respondentResponse: 'notAvailableYet',
              tribunalJudgements: 'notAvailableYet',
              respondentApplications: 'notAvailableYet',
              requestsAndApplications: 'notAvailableYet',
            },
          } as Partial<CaseWithId>,
        })
      )
        .get(PageUrls.CITIZEN_HUB)
        .then(res => {
          htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
        });

      expect(htmlRes.querySelector(notificationBannerSelector).innerHTML).toContain('View the response');
    });
  });

  describe('Should not show the alert when the corresponding hublink has been viewed', () => {
    it('Notification banner should not appear - the notificaiton banner selector should return null', async () => {
      caseApi.getUserCase = jest.fn().mockResolvedValue({ body: {} });

      const mockFromApiFormat = jest.spyOn(ApiFormatter, 'fromApiFormat');
      mockFromApiFormat.mockReturnValue({
        id: '123',
        state: CaseState.SUBMITTED,
        createdDate: 'August 19, 2022',
        lastModified: 'August 19, 2022',
        responseAcknowledgementDocumentDetail: [
          {
            id: 'responseAcknowledgeId1',
            description: 'asdf',
          },
          {
            id: 'responseAcknowledgeId2',
            description: 'asdf',
          },
        ],
        acknowledgementOfClaimLetterDetail: [
          {
            id: 'claimAcknowledgeId1',
            description: 'asdf',
          },
        ],
        hubLinksStatuses: {
          documents: HubLinkStatus.VIEWED,
          et1ClaimForm: HubLinkStatus.SUBMITTED_AND_VIEWED,
          hearingDetails: HubLinkStatus.VIEWED,
          tribunalOrders: HubLinkStatus.VIEWED,
          contactTribunal: HubLinkStatus.VIEWED,
          personalDetails: HubLinkStatus.VIEWED,
          respondentResponse: HubLinkStatus.VIEWED,
          tribunalJudgements: HubLinkStatus.VIEWED,
          respondentApplications: HubLinkStatus.VIEWED,
          requestsAndApplications: HubLinkStatus.VIEWED,
        },
      });

      await request(
        mockApp({
          userCase: {} as Partial<CaseWithId>,
        })
      )
        .get(PageUrls.CITIZEN_HUB)
        .then(res => {
          htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
        });

      expect(htmlRes.querySelector(notificationBannerSelector)).toBe(null);
    });
  });
});
