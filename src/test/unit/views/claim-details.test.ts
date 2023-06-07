import axios, { AxiosResponse } from 'axios';

import * as caseService from '../../../main/services/CaseService';
import { CaseApi } from '../../../main/services/CaseService';
import mockUserCaseClaimDetails from '../mocks/mockUserCaseClaimDetails';
import { getHtmlRes } from '../test-helpers/requester';

const PAGE_URL = '/claim-details';
const expectedTitle = 'Your claim details';
const titleClass = 'govuk-heading-xl';
const summaryListClass = 'govuk-summary-list';
const summaryListHeadingClass = 'govuk-summary-list__key govuk-heading-m';

// const tableSelector = "govuk-table";
// const rowSelector = "govuk-table__row";
// const cellSelector = "govuk-table__cell";
// const tableHeaderSelector = 'govuk-table__header';

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
caseApi.getDocumentDetails = jest.fn(caseId => {
  if (caseId === 'a0c113ec-eede-472a-a59c-f2614b48177c') {
    return Promise.resolve({ ...axiosResponse, data: { createdOn: '2022-09-09T14:39:32.000+00:00' } });
  }
  return Promise.resolve(axiosResponse);
});
jest.spyOn(caseService, 'getCaseApi').mockReturnValue(caseApi);

let htmlRes: Document;

describe('ET1 details', () => {
  beforeAll(async () => {
    htmlRes = await getHtmlRes(mockUserCaseClaimDetails, PAGE_URL);
  });

  it('should display title', () => {
    const title = htmlRes.getElementsByClassName(titleClass);

    expect(title[0].innerHTML).toMatch(expectedTitle);
  });

  it('should display correct number of summary lists', () => {
    const summaryLists = htmlRes.getElementsByClassName(summaryListClass);

    expect(summaryLists).toHaveLength(7);
  });

  it('should display correct headings in the summary lists', () => {
    const summaryLists = htmlRes.getElementsByClassName(summaryListHeadingClass);

    expect(summaryLists[0].innerHTML).toMatch('Application details');
    expect(summaryLists[1].innerHTML).toMatch('Your details');
    expect(summaryLists[2].innerHTML).toMatch('Employment details');
    expect(summaryLists[3].innerHTML).toMatch('Respondent 1 details');
    expect(summaryLists[4].innerHTML).toMatch('Respondent 2 details');
    expect(summaryLists[5].innerHTML).toMatch('Claim details');
  });

  /*it.each([
    { sectionName: 'Application details', numberOfEntries: 0 },
    { sectionName: 'Your details', numberOfEntries: 0 },
    { sectionName: 'Employment details', numberOfEntries: 0 },
    { sectionName: 'Respondent 1 details', numberOfEntries: 0 },
    { sectionName: 'Respondent 2 details', numberOfEntries: 0 },
    { sectionName: 'Claim details', numberOfEntries: 0 },
  ])('should display correct number of entries for section: $sectionName', ({ sectionName, numberOfEntries }) => {
    const sections = Array.from(htmlRes.getElementsByClassName(summaryListHeadingClass)).filter(el => {
      const titles = el.getElementsByClassName(summaryListHeadingClass);
      expect(titles).toHaveLength(0);

      return titles[0].textContent.trim() === sectionName;
    });

    expect(sections).toHaveLength(0);

    const entries = sections[0].querySelectorAll(summaryListKeyExcludeHeadingClass);

    expect(entries).toHaveLength(numberOfEntries);
  });*/
});