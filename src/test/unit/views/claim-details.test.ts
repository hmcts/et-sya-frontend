import axios, { AxiosResponse } from 'axios';
import request from 'supertest';

import * as caseService from '../../../main/services/CaseService';
import { CaseApi } from '../../../main/services/CaseService';
import { mockApp } from '../mocks/mockApp';
import mockUserCaseComplete from '../mocks/mockUserCaseComplete';

const PAGE_URL = '/claim-details';
const expectedTitle = 'Your claim details';
const titleClass = 'govuk-heading-xl';
const summaryListClass = 'govuk-summary-list';
const summaryListHeadingClass = 'govuk-summary-list__key govuk-heading-m';
const summaryListKeyExcludeHeadingClass = '.govuk-summary-list__key:not(.govuk-heading-m)';

const axiosResponse: AxiosResponse = {
  data: {
    classification: 'PUBLIC',
    size: 10575,
    mimeType: 'application/pdf',
    originalDocumentName: 'sample.pdf',
    createdOn: '2022-09-08T14:39:32.000+00:00',
    createdBy: '7',
    lastModifiedBy: '7',
    modifiedOn: '2022-09-08T14:40:49.000+00:00',
    metadata: {
      jurisdiction: '',
      case_id: '1',
      case_type_id: '',
    },
  },
  status: 200,
  statusText: '',
  headers: undefined,
  config: undefined,
};

jest.mock('axios');
const caseApi = new CaseApi(axios as jest.Mocked<typeof axios>);
caseApi.getDocumentDetails = jest.fn().mockResolvedValue(axiosResponse); // todo vary the documents' date and size
jest.spyOn(caseService, 'getCaseApi').mockReturnValue(caseApi);

let htmlRes: Document;

describe('Claim details page', () => {
  // todo sections and details
  it.todo('All et1 details are present');

  beforeAll(async () => {
    await request(mockApp({ userCase: mockUserCaseComplete }))
      .get(PAGE_URL)
      .then(res => {
        htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
      });
  });

  it('should display title', () => {
    const title = htmlRes.getElementsByClassName(titleClass);

    expect(title[0].innerHTML).toMatch(expectedTitle);
  });

  it('should display 4 summary lists', () => {
    const summaryLists = htmlRes.getElementsByClassName(summaryListClass);

    expect(summaryLists).toHaveLength(5);
  });

  it('should display correct headings in the summary lists', () => {
    const summaryLists = htmlRes.getElementsByClassName(summaryListHeadingClass);

    expect(summaryLists[0].innerHTML).toMatch('Application details');
    expect(summaryLists[1].innerHTML).toMatch('Your details');
    expect(summaryLists[2].innerHTML).toMatch('Employment details');
    expect(summaryLists[3].innerHTML).toMatch('Respondent 1 details');
    expect(summaryLists[4].innerHTML).toMatch('Respondent 2 details');
  });

  it.each([
    { sectionName: 'Application details', numberOfEntries: 1 },
    { sectionName: 'Your details', numberOfEntries: 8 },
    { sectionName: 'Employment details', numberOfEntries: 13 },
    { sectionName: 'Respondent 1 details', numberOfEntries: 4 },
    { sectionName: 'Respondent 2 details', numberOfEntries: 3 },
  ])('should display correct number of entries for section: $sectionName', ({ sectionName, numberOfEntries }) => {
    const sections = Array.from(htmlRes.getElementsByClassName(summaryListClass)).filter(el => {
      const titles = el.getElementsByClassName(summaryListHeadingClass);
      expect(titles).toHaveLength(1);

      return titles[0].textContent.trim() === sectionName;
    });

    expect(sections).toHaveLength(1);

    const entries = sections[0].querySelectorAll(summaryListKeyExcludeHeadingClass);

    expect(entries).toHaveLength(numberOfEntries);
  });

  // todo dates and links
  it.todo('Only et1 claim pdf');
  it.todo('Both et1 claim pdf and supporting document');
});
