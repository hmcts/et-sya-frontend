import fs from 'fs';
import path from 'path';
import { setImmediate as nodeSetImmediate } from 'timers';

import { expect } from 'chai';
import request from 'supertest';

import { CaseDataCacheKey, CaseType, CaseWithId, YesOrNo } from '../../../main/definitions/case';
import { PageUrls } from '../../../main/definitions/constants';
import { CaseState, TypesOfClaim } from '../../../main/definitions/definition';
import * as caseSelectionService from '../../../main/services/CaseSelectionService';
import { mockAppWithRedisClient, mockRedisClient, mockSession } from '../mocks/mockApp';
import { mockApplications } from '../mocks/mockApplications';

const testGlobal = globalThis as unknown as Record<string, unknown>;

if (typeof testGlobal.setImmediate !== 'function') {
  testGlobal.setImmediate = nodeSetImmediate;
}

const claimantApplicationsJSONRaw = fs.readFileSync(
  path.resolve(__dirname, '../../../main/resources/locales/en/translation/claimant-applications.json'),
  'utf-8'
);
const claimantApplicationsJSON = JSON.parse(claimantApplicationsJSONRaw);

const titleClass = 'govuk-heading-xl';
const tableHeaderClass = 'govuk-table__caption govuk-table__caption';
const columnHeaderClass = 'govuk-table__header';
const rowDataClass = 'govuk-table__cell';

let htmlRes: Document;
const getUserCasesMock = jest.spyOn(caseSelectionService, 'getUserCasesByLastModified');
const getUserAppMock = jest.spyOn(caseSelectionService, 'getUserApplications');
describe('Claimant Applications page', () => {
  const userCases: CaseWithId[] = [
    {
      id: '12454',
      state: CaseState.AWAITING_SUBMISSION_TO_HMCTS,
      createdDate: 'August 19, 2022',
      lastModified: 'August 19, 2022',
    },
    {
      id: '12454',
      state: CaseState.SUBMITTED,
      createdDate: 'August 19, 2022',
      lastModified: 'August 19, 2022',
    },
  ];
  beforeAll(async () => {
    getUserCasesMock.mockResolvedValue(userCases);
    getUserAppMock.mockReturnValue(mockApplications);
    const res = await request(
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
    ).get(PageUrls.CLAIMANT_APPLICATIONS);

    expect(res.status).to.equal(200, `Expected claimant applications page to return 200, got ${res.status}`);

    htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
  }, 15000);
  it('should display title', () => {
    const title = htmlRes.getElementsByClassName(titleClass);
    expect(title[0].innerHTML).contains(claimantApplicationsJSON.title, 'Page title does not exist');
  });

  it('should display draft applications heading', () => {
    const tableHeader = htmlRes.getElementsByClassName(tableHeaderClass);
    expect(tableHeader[0].innerHTML).contains(claimantApplicationsJSON.h1, 'Draft caption does not exist');
  });

  it('should display submitted applications heading', () => {
    const tableHeader = htmlRes.getElementsByClassName(tableHeaderClass);
    expect(tableHeader[1].innerHTML).contains(claimantApplicationsJSON.h2, 'Submitted caption does not exist');
  });

  it('should display draft applications column headings', () => {
    const columnHeaders = htmlRes.getElementsByClassName(columnHeaderClass);

    expect(columnHeaders[0].innerHTML).contains(claimantApplicationsJSON.col1, 'Date created does not exist');
    expect(columnHeaders[1].innerHTML).contains(claimantApplicationsJSON.col2, 'Reference does not exist');
    expect(columnHeaders[2].innerHTML).contains(claimantApplicationsJSON.col3, 'Type of claim does not exist');
    expect(columnHeaders[3].innerHTML).contains(claimantApplicationsJSON.col4, 'Respondents does not exist');
    expect(columnHeaders[4].innerHTML).contains(claimantApplicationsJSON.col5, 'Completion status does not exist');
    expect(columnHeaders[5].innerHTML).contains(claimantApplicationsJSON.col6, 'Date last modified does not exist');
    expect(columnHeaders[6].innerHTML).contains(claimantApplicationsJSON.col7, 'Options caption does not exist');
  });

  it('should display submitted applications column headings', () => {
    const columnHeaders = htmlRes.getElementsByClassName(columnHeaderClass);

    expect(columnHeaders[7].innerHTML).contains(claimantApplicationsJSON.dateSubmitted, 'Date created does not exist');
    expect(columnHeaders[8].innerHTML).contains(claimantApplicationsJSON.caseNumber, 'Reference does not exist');
    expect(columnHeaders[9].innerHTML).contains(claimantApplicationsJSON.col3, 'Type of claim does not exist');
    expect(columnHeaders[10].innerHTML).contains(claimantApplicationsJSON.col4, 'Respondents does not exist');
    expect(columnHeaders[11].innerHTML).contains(claimantApplicationsJSON.col6, 'Date last modified does not exist');
  });

  it('should display draft applications first row data', () => {
    const rowDataClassData = htmlRes.getElementsByClassName(rowDataClass);

    expect(rowDataClassData[0].innerHTML).contains(
      mockApplications[0].userCase.createdDate,
      'Date created does not exist'
    );
    expect(rowDataClassData[1].innerHTML).contains(mockApplications[0].userCase.id, 'Reference does not exist');
    expect(rowDataClassData[2].innerHTML).contains(
      mockApplications[0].userCase.typeOfClaim[0],
      'Type of claim does not exist'
    );
    expect(rowDataClassData[3].innerHTML).contains('Globo Corp<br>Mega Globo Corp', 'Respondents does not exist');
    expect(rowDataClassData[4].innerHTML).contains(
      mockApplications[0].completionStatus,
      'Completion status does not exist'
    );
    expect(rowDataClassData[5].innerHTML).contains(
      mockApplications[0].userCase.lastModified,
      'Date last modified does not exist'
    );
    expect(rowDataClassData[6].innerHTML).contains(mockApplications[0].url, 'Options link does not exist');
    expect(rowDataClassData[6].innerHTML).contains('Continue', 'Options caption does not exist');
  });

  it('should display draft applications second row data', () => {
    const rowDataClassData = htmlRes.getElementsByClassName(rowDataClass);

    expect(rowDataClassData[7].innerHTML).contains(
      mockApplications[1].userCase.createdDate,
      'Date created does not exist'
    );
    expect(rowDataClassData[8].innerHTML).contains(mockApplications[1].userCase.id, 'Reference does not exist');
    expect(rowDataClassData[9].innerHTML).contains(
      mockApplications[1].userCase.typeOfClaim[0],
      'Type of claim does not exist'
    );
    expect(rowDataClassData[10].innerHTML).contains(
      claimantApplicationsJSON.noRespondents,
      'Respondents does not exist'
    );
    expect(rowDataClassData[11].innerHTML).contains(
      mockApplications[1].completionStatus,
      'Completion status does not exist'
    );
    expect(rowDataClassData[12].innerHTML).contains(
      mockApplications[1].userCase.lastModified,
      'Date last modified does not exist'
    );
    expect(rowDataClassData[13].innerHTML).contains(mockApplications[1].url, 'Options link does not exist');
    expect(rowDataClassData[13].innerHTML).contains('Continue', 'Options caption does not exist');
  });

  it('should display submitted applications row data', () => {
    const rowDataClassData = htmlRes.getElementsByClassName(rowDataClass);

    expect(rowDataClassData[14].innerHTML).contains('1 September 2022', 'Date created does not exist');
    expect(rowDataClassData[15].innerHTML).contains(
      mockApplications[2].userCase.ethosCaseReference,
      'Reference does not exist'
    );
    expect(rowDataClassData[16].innerHTML).contains(
      mockApplications[2].userCase.typeOfClaim[0],
      'Type of claim does not exist'
    );
    expect(rowDataClassData[17].innerHTML).contains(mockApplications[2].respondents, 'Respondents does not exist');
    expect(rowDataClassData[18].innerHTML).contains(
      mockApplications[2].userCase.lastModified,
      'Date last modified does not exist'
    );
  });
  it('should have data-navigation-link property to trigger event handler double click protection', () => {
    const rowDataClassData = htmlRes.getElementsByClassName(rowDataClass);

    expect(rowDataClassData[6].innerHTML).contains(
      'data-navigation-link',
      'Continue href link should have navigation link data attribute'
    );
    expect(rowDataClassData[6].innerHTML).contains(
      mockApplications[0].url,
      'Continue href link should pass correct URL'
    );

    expect(rowDataClassData[13].innerHTML).contains(
      'data-navigation-link',
      'Second Continue should have navigation link data attribute'
    );

    expect(rowDataClassData[15].innerHTML).contains(
      'data-navigation-link',
      'Submitted View should have navigation link data attribute'
    );
    expect(rowDataClassData[15].innerHTML).contains(mockApplications[2].url, 'Submitted View should pass correct URL');
  });
});

describe('Claimant Applications page - My claims / Representing tabs', () => {
  let tabbedHtml: Document;
  beforeAll(async () => {
    const personalApp = JSON.parse(JSON.stringify(mockApplications[0]));
    personalApp.userCase.claimantRepresentedQuestion = YesOrNo.NO;
    const representingApp = JSON.parse(JSON.stringify(mockApplications[2]));
    representingApp.userCase.claimantRepresentedQuestion = YesOrNo.YES;

    getUserCasesMock.mockResolvedValue([
      { id: '12454', state: CaseState.AWAITING_SUBMISSION_TO_HMCTS } as CaseWithId,
      { id: '12455', state: CaseState.SUBMITTED } as CaseWithId,
    ]);
    getUserAppMock.mockReturnValue([personalApp, representingApp]);
    const res = await request(
      mockAppWithRedisClient({
        session: mockSession([], [], []),
        redisClient: mockRedisClient(
          new Map<CaseDataCacheKey, string>([[CaseDataCacheKey.CLAIMANT_REPRESENTED, YesOrNo.YES]])
        ),
      })
    ).get(PageUrls.CLAIMANT_APPLICATIONS);

    expect(res.status).to.equal(200, `Expected claimant applications tabbed page to return 200, got ${res.status}`);

    tabbedHtml = new DOMParser().parseFromString(res.text, 'text/html');
  }, 15000);

  it('should render the govuk tabs component with both tab labels', () => {
    const tabs = tabbedHtml.getElementsByClassName('govuk-tabs');
    expect(tabs.length).to.be.greaterThan(0, 'Tabs component should be rendered');
    const tabList = tabbedHtml.getElementsByClassName('govuk-tabs__list')[0];
    expect(tabList.innerHTML).contains(claimantApplicationsJSON.myClaimsTab, 'My claims tab should exist');
    expect(tabList.innerHTML).contains(claimantApplicationsJSON.representingTab, 'Representing tab should exist');
  });

  it('should render a panel for each tab', () => {
    const myClaimsPanel = tabbedHtml.getElementById('my-claims');
    const representingPanel = tabbedHtml.getElementById('representing');
    expect(myClaimsPanel).to.not.be.null;
    expect(representingPanel).to.not.be.null;
  });
});
