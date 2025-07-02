/* eslint-disable jest/valid-expect */
//  using chai expect, rather than global jest expect

import fs from 'fs';
import path from 'path';

import { expect } from 'chai';
import request from 'supertest';

import { CaseDataCacheKey, CaseType, CaseTypeId, CaseWithId, YesOrNo } from '../../../main/definitions/case';
import { PageUrls } from '../../../main/definitions/constants';
import { CaseState, TypesOfClaim } from '../../../main/definitions/definition';
import { mockAppWithRedisClient, mockRedisClient, mockSession, mockSessionWithUserCase } from '../mocks/mockApp';

const stepsToMakingYourClaimJSONRaw = fs.readFileSync(
  path.resolve(__dirname, '../../../main/resources/locales/en/translation/steps-to-making-your-claim.json'),
  'utf-8'
);
const stepsToMakingYourClaimJSON = JSON.parse(stepsToMakingYourClaimJSONRaw);

const PAGE_URL = '/steps-to-making-your-claim';
const sectionClass = 'app-task-list__items';
const listItemClass = 'app-task-list__item';
const linkClass = 'span.app-task-list__task-name--300px > a';
const typeOfClaimListElement = 'ul.govuk-list > li';

const headerClass = 'app-task-list__section';
const titleClass = 'govuk-heading-xl';
const signOutLinkSelector = 'li.govuk-header__navigation-item a.govuk-header__link';

const expectedTitle = stepsToMakingYourClaimJSON.h1;
const expectedHeader1 = stepsToMakingYourClaimJSON.section1.title;
const expectedHeader2 = stepsToMakingYourClaimJSON.section2.title;
const expectedHeader3 = stepsToMakingYourClaimJSON.section3.title;
const expectedHeader4 = stepsToMakingYourClaimJSON.section4.title;

const taskListTag = 'govuk-tag app-task-list__tag';
const notStartedTaskTag = 'govuk-tag app-task-list__tag govuk-tag--grey';

let htmlRes: Document;

describe('Steps to making your claim page', () => {
  beforeAll(async () => {
    await request(
      mockAppWithRedisClient({
        session: mockSession([], [], []),
        redisClient: mockRedisClient(
          new Map<CaseDataCacheKey, string>([
            [CaseDataCacheKey.CLAIMANT_REPRESENTED, YesOrNo.YES],
            [CaseDataCacheKey.CASE_TYPE, CaseType.SINGLE],
            [CaseDataCacheKey.TYPES_OF_CLAIM, JSON.stringify([TypesOfClaim.WHISTLE_BLOWING])],
          ])
        ),
      })
    )
      .get(PAGE_URL)
      .then(res => {
        htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
      });
  });

  it('should display sign out link as the user is logged in', () => {
    const signoutLink = htmlRes.querySelectorAll(signOutLinkSelector);
    expect(signoutLink[0].innerHTML).contains('Sign out', 'Sign out link does not exist');
  });

  it('should display title', () => {
    const title = htmlRes.getElementsByClassName(titleClass);
    expect(title[0].innerHTML).contains(expectedTitle, 'Page title does not exist');
  });

  it('should display correct number of sections', () => {
    const section = htmlRes.getElementsByClassName(sectionClass);
    expect(section.length).equal(4, 'number of sections/tables found is not 4');
  });

  it('should display the correct number of list items - one for each task', () => {
    const foundListItems = htmlRes.getElementsByClassName(listItemClass);
    expect(foundListItems.length).equal(8, 'number of list items found is not correct');
  });

  it('should display the correct number of table / section headers', () => {
    const header = htmlRes.getElementsByClassName(headerClass);
    expect(header.length).equal(4, 'number of table headers found is not 4');
  });

  it('should display the correct task list tags', () => {
    const tags = htmlRes.getElementsByClassName(notStartedTaskTag);
    expect(tags.length).equal(8, 'number of table headers found is not 8');
    for (let index = 0; index < tags.length - 2; index++) {
      expect(tags[index].innerHTML).contains('Not started yet');
    }
    expect(tags[7].innerHTML).contains('Cannot start yet');
  });

  it('should display the correct table header texts', () => {
    const header = htmlRes.getElementsByClassName(headerClass);
    expect(header[0].innerHTML).contains(expectedHeader1, 'could not find table 1 header text');
    expect(header[1].innerHTML).contains(expectedHeader2, 'could not find table 2 header text');
    expect(header[2].innerHTML).contains(expectedHeader3, 'could not find table 3 header text');
    expect(header[3].innerHTML).contains(expectedHeader4, 'could not find table 4 header text');
  });

  it(
    'should have the correct link(PageUrls.CLAIM_TYPE_DISCRIMINATION) on Summarise what happened to you ' +
      'when TypeOfClaim.DISCRIMINATION selected',
    async () => {
      await request(
        mockAppWithRedisClient({
          session: mockSession([], [], []),
          redisClient: mockRedisClient(
            new Map<CaseDataCacheKey, string>([
              [CaseDataCacheKey.CLAIMANT_REPRESENTED, YesOrNo.YES],
              [CaseDataCacheKey.CASE_TYPE, CaseType.SINGLE],
              [CaseDataCacheKey.TYPES_OF_CLAIM, JSON.stringify([TypesOfClaim.DISCRIMINATION])],
            ])
          ),
        })
      )
        .get(PAGE_URL)
        .then(res => {
          htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
        });
      const links = htmlRes.querySelectorAll(linkClass);

      expect(links[5].outerHTML).contains(PageUrls.CLAIM_TYPE_DISCRIMINATION.toString());
    }
  );
  it(
    'should have the correct link(PageUrls.CLAIM_TYPE_PAY) on Summarise what happened to you ' +
      'when TypeOfClaim.PAY_RELATED_CLAIM selected and TypeOfClaim.DISCRIMINATION is not selected',
    async () => {
      await request(
        mockAppWithRedisClient({
          session: mockSession([TypesOfClaim.WHISTLE_BLOWING, TypesOfClaim.PAY_RELATED_CLAIM], [], []),
          redisClient: mockRedisClient(
            new Map<CaseDataCacheKey, string>([
              [CaseDataCacheKey.CLAIMANT_REPRESENTED, YesOrNo.YES],
              [CaseDataCacheKey.CASE_TYPE, CaseType.SINGLE],
              [CaseDataCacheKey.TYPES_OF_CLAIM, JSON.stringify([TypesOfClaim.PAY_RELATED_CLAIM])],
            ])
          ),
        })
      )
        .get(PAGE_URL)
        .then(res => {
          htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
        });
      const links = htmlRes.querySelectorAll(linkClass);
      expect(links[5].outerHTML).contains(PageUrls.CLAIM_TYPE_PAY.toString());
    }
  );
  it(
    'should have the correct link(PageUrls.STILL_WORKING) on Employment status ' +
      'when TypeOfClaim.UNFAIR_DISMISSAL is selected',
    async () => {
      await request(
        mockAppWithRedisClient({
          session: mockSession([TypesOfClaim.UNFAIR_DISMISSAL], [], []),
          redisClient: mockRedisClient(
            new Map<CaseDataCacheKey, string>([
              [CaseDataCacheKey.CLAIMANT_REPRESENTED, YesOrNo.YES],
              [CaseDataCacheKey.CASE_TYPE, CaseType.SINGLE],
              [CaseDataCacheKey.TYPES_OF_CLAIM, JSON.stringify([TypesOfClaim.UNFAIR_DISMISSAL])],
            ])
          ),
        })
      )
        .get(PAGE_URL)
        .then(res => {
          htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
        });
      const links = htmlRes.querySelectorAll(linkClass);
      expect(links[3].outerHTML).contains(PageUrls.STILL_WORKING.toString());
    }
  );
  it(
    'should have the correct link(PageUrls.PAST_EMPLOYER) on Employment status ' +
      'when TypeOfClaim.UNFAIR_DISMISSAL is not selected',
    async () => {
      await request(
        mockAppWithRedisClient({
          session: mockSession([], [], []),
          redisClient: mockRedisClient(
            new Map<CaseDataCacheKey, string>([
              [CaseDataCacheKey.CLAIMANT_REPRESENTED, YesOrNo.YES],
              [CaseDataCacheKey.CASE_TYPE, CaseType.SINGLE],
              [CaseDataCacheKey.TYPES_OF_CLAIM, JSON.stringify([TypesOfClaim.PAY_RELATED_CLAIM])],
            ])
          ),
        })
      )
        .get(PAGE_URL)
        .then(res => {
          htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
        });
      const links = htmlRes.querySelectorAll(linkClass);
      expect(links[3].outerHTML).contains(PageUrls.PAST_EMPLOYER.toString());
    }
  );

  it('should list all the claim types for the claim at the top of the page', async () => {
    await request(
      mockAppWithRedisClient({
        session: mockSession([], [], []),
        redisClient: mockRedisClient(
          new Map<CaseDataCacheKey, string>([
            [CaseDataCacheKey.CLAIM_JURISDICTION, CaseTypeId.ENGLAND_WALES],
            [CaseDataCacheKey.CLAIMANT_REPRESENTED, YesOrNo.YES],
            [CaseDataCacheKey.CASE_TYPE, CaseType.SINGLE],
            [
              CaseDataCacheKey.TYPES_OF_CLAIM,
              JSON.stringify([
                TypesOfClaim.PAY_RELATED_CLAIM,
                TypesOfClaim.BREACH_OF_CONTRACT,
                TypesOfClaim.DISCRIMINATION,
                TypesOfClaim.UNFAIR_DISMISSAL,
                TypesOfClaim.WHISTLE_BLOWING,
                TypesOfClaim.OTHER_TYPES,
              ]),
            ],
          ])
        ),
      })
    )
      .get(PAGE_URL)
      .then(res => {
        htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
      });
    const expected = [
      'Breach of contract',
      'Discrimination',
      'Pay-related',
      'Unfair dismissal',
      'Whistleblowing',
      'Other type of claim',
    ];
    const typeOfClaimListElements = Array.from(htmlRes.querySelectorAll(typeOfClaimListElement));
    const foundArr = typeOfClaimListElements.map(el => el.innerHTML).sort();
    expect(foundArr).to.have.members(expected);
  });
});

describe('Steps to making your claim page tags', () => {
  it('should show your details section as completed', async () => {
    const userCase: CaseWithId = {
      id: '12234',
      state: CaseState.AWAITING_SUBMISSION_TO_HMCTS,
      personalDetailsCheck: YesOrNo.YES,
      createdDate: 'August 19, 2022',
      lastModified: 'August 19, 2022',
    };
    await request(
      mockAppWithRedisClient({
        session: mockSessionWithUserCase(userCase),
        redisClient: mockRedisClient(
          new Map<CaseDataCacheKey, string>([
            [CaseDataCacheKey.CLAIM_JURISDICTION, CaseTypeId.ENGLAND_WALES],
            [CaseDataCacheKey.CLAIMANT_REPRESENTED, YesOrNo.YES],
            [CaseDataCacheKey.CASE_TYPE, CaseType.SINGLE],
            [
              CaseDataCacheKey.TYPES_OF_CLAIM,
              JSON.stringify([
                TypesOfClaim.PAY_RELATED_CLAIM,
                TypesOfClaim.BREACH_OF_CONTRACT,
                TypesOfClaim.DISCRIMINATION,
                'otherClaim',
                TypesOfClaim.UNFAIR_DISMISSAL,
                TypesOfClaim.WHISTLE_BLOWING,
              ]),
            ],
          ])
        ),
      })
    )
      .get(PAGE_URL)
      .then(res => {
        htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
      });
    const notStartedTags = htmlRes.getElementsByClassName(notStartedTaskTag);
    const tasklistTags = htmlRes.getElementsByClassName(taskListTag);
    expect(notStartedTags.length).equal(5, 'number of tags found is not 5');
    expect(tasklistTags.length).equal(8, 'number of tags found is not 8');
    expect(tasklistTags[0].innerHTML).contains('Completed');
    expect(tasklistTags[1].innerHTML).contains('Completed');
    expect(tasklistTags[2].innerHTML).contains('Completed');
    expect(notStartedTags[4].innerHTML).contains('Cannot start yet');
  });

  it('should show employment and respondent section as completed', async () => {
    const userCase: CaseWithId = {
      id: '12234',
      state: CaseState.AWAITING_SUBMISSION_TO_HMCTS,
      employmentAndRespondentCheck: YesOrNo.YES,
      createdDate: 'August 19, 2022',
      lastModified: 'August 19, 2022',
    };
    await request(
      mockAppWithRedisClient({
        session: mockSessionWithUserCase(userCase),
        redisClient: mockRedisClient(
          new Map<CaseDataCacheKey, string>([
            [CaseDataCacheKey.CLAIM_JURISDICTION, CaseTypeId.ENGLAND_WALES],
            [CaseDataCacheKey.CLAIMANT_REPRESENTED, YesOrNo.YES],
            [CaseDataCacheKey.CASE_TYPE, CaseType.SINGLE],
            [
              CaseDataCacheKey.TYPES_OF_CLAIM,
              JSON.stringify([
                TypesOfClaim.PAY_RELATED_CLAIM,
                TypesOfClaim.BREACH_OF_CONTRACT,
                TypesOfClaim.DISCRIMINATION,
                'otherClaim',
                TypesOfClaim.UNFAIR_DISMISSAL,
                TypesOfClaim.WHISTLE_BLOWING,
              ]),
            ],
          ])
        ),
      })
    )
      .get(PAGE_URL)
      .then(res => {
        htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
      });
    const notStartedTags = htmlRes.getElementsByClassName(notStartedTaskTag);
    const tasklistTags = htmlRes.getElementsByClassName(taskListTag);
    expect(notStartedTags.length).equal(6, 'number of tags found is not 6');
    expect(tasklistTags.length).equal(8, 'number of tags found is not 8');
    expect(tasklistTags[3].innerHTML).contains('Completed');
    expect(tasklistTags[4].innerHTML).contains('Completed');
    expect(notStartedTags[5].innerHTML).contains('Cannot start yet');
  });

  it('should show claim details section as completed', async () => {
    const userCase: CaseWithId = {
      id: '12234',
      state: CaseState.AWAITING_SUBMISSION_TO_HMCTS,
      claimDetailsCheck: YesOrNo.YES,
      createdDate: 'August 19, 2022',
      lastModified: 'August 19, 2022',
    };
    await request(
      mockAppWithRedisClient({
        session: mockSessionWithUserCase(userCase),
        redisClient: mockRedisClient(
          new Map<CaseDataCacheKey, string>([
            [CaseDataCacheKey.CLAIM_JURISDICTION, CaseTypeId.ENGLAND_WALES],
            [CaseDataCacheKey.CLAIMANT_REPRESENTED, YesOrNo.YES],
            [CaseDataCacheKey.CASE_TYPE, CaseType.SINGLE],
            [
              CaseDataCacheKey.TYPES_OF_CLAIM,
              JSON.stringify([
                TypesOfClaim.PAY_RELATED_CLAIM,
                TypesOfClaim.BREACH_OF_CONTRACT,
                TypesOfClaim.DISCRIMINATION,
                'otherClaim',
                TypesOfClaim.WHISTLE_BLOWING,
              ]),
            ],
          ])
        ),
      })
    )
      .get(PAGE_URL)
      .then(res => {
        htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
      });
    const notStartedTags = htmlRes.getElementsByClassName(notStartedTaskTag);
    const tasklistTags = htmlRes.getElementsByClassName(taskListTag);
    expect(notStartedTags.length).equal(6, 'number of tags found is not 6');
    expect(tasklistTags.length).equal(8, 'number of tags found is not 8');
    expect(tasklistTags[5].innerHTML).contains('Completed');
    expect(tasklistTags[6].innerHTML).contains('Completed');
    expect(notStartedTags[5].innerHTML).contains('Cannot start yet');
  });

  it('should show check your answers section as ready to start', async () => {
    const userCase: CaseWithId = {
      id: '12234',
      state: CaseState.AWAITING_SUBMISSION_TO_HMCTS,
      personalDetailsCheck: YesOrNo.YES,
      employmentAndRespondentCheck: YesOrNo.YES,
      claimDetailsCheck: YesOrNo.YES,
      createdDate: 'August 19, 2022',
      lastModified: 'August 19, 2022',
    };
    await request(
      mockAppWithRedisClient({
        session: mockSessionWithUserCase(userCase),
        redisClient: mockRedisClient(
          new Map<CaseDataCacheKey, string>([
            [CaseDataCacheKey.CLAIM_JURISDICTION, CaseTypeId.ENGLAND_WALES],
            [CaseDataCacheKey.CLAIMANT_REPRESENTED, YesOrNo.YES],
            [CaseDataCacheKey.CASE_TYPE, CaseType.SINGLE],
            [
              CaseDataCacheKey.TYPES_OF_CLAIM,
              JSON.stringify([
                TypesOfClaim.PAY_RELATED_CLAIM,
                TypesOfClaim.BREACH_OF_CONTRACT,
                TypesOfClaim.DISCRIMINATION,
                'otherClaim',
                TypesOfClaim.UNFAIR_DISMISSAL,
                TypesOfClaim.WHISTLE_BLOWING,
              ]),
            ],
          ])
        ),
      })
    )
      .get(PAGE_URL)
      .then(res => {
        htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
      });
    const tasklistTags = htmlRes.getElementsByClassName(taskListTag);
    expect(tasklistTags.length).equal(8, 'number of tags found is not 8');
    for (let index = 0; index < tasklistTags.length - 2; index++) {
      expect(tasklistTags[index].innerHTML).contains('Completed');
    }
    expect(tasklistTags[7].innerHTML).contains('Not started yet');
  });

  it('should show section as in progress', async () => {
    const userCase: CaseWithId = {
      id: '12234',
      state: CaseState.AWAITING_SUBMISSION_TO_HMCTS,
      personalDetailsCheck: YesOrNo.NO,
      employmentAndRespondentCheck: YesOrNo.NO,
      claimDetailsCheck: YesOrNo.NO,
      createdDate: 'August 19, 2022',
      lastModified: 'August 19, 2022',
    };
    await request(
      mockAppWithRedisClient({
        session: mockSessionWithUserCase(userCase),
        redisClient: mockRedisClient(
          new Map<CaseDataCacheKey, string>([
            [CaseDataCacheKey.CLAIM_JURISDICTION, CaseTypeId.ENGLAND_WALES],
            [CaseDataCacheKey.CLAIMANT_REPRESENTED, YesOrNo.YES],
            [CaseDataCacheKey.CASE_TYPE, CaseType.SINGLE],
            [
              CaseDataCacheKey.TYPES_OF_CLAIM,
              JSON.stringify([
                TypesOfClaim.PAY_RELATED_CLAIM,
                TypesOfClaim.BREACH_OF_CONTRACT,
                TypesOfClaim.DISCRIMINATION,
                'otherClaim',
                TypesOfClaim.UNFAIR_DISMISSAL,
                TypesOfClaim.WHISTLE_BLOWING,
              ]),
            ],
          ])
        ),
      })
    )
      .get(PAGE_URL)
      .then(res => {
        htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
      });
    const tasklistTags = htmlRes.getElementsByClassName(taskListTag);
    expect(tasklistTags.length).equal(8, 'number of tags found is not 8');
    for (let index = 0; index < tasklistTags.length - 3; index++) {
      expect(tasklistTags[index].innerHTML).contains('Not started yet');
    }
    expect(tasklistTags[7].innerHTML).contains('Cannot start yet');
  });
});
