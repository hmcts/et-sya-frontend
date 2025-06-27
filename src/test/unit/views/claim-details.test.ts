import axios, { AxiosResponse } from 'axios';

import * as caseService from '../../../main/services/CaseService';
import { CaseApi } from '../../../main/services/CaseService';
import mockUserCaseComplete from '../mocks/mockUserCaseComplete';
import { getHtmlRes } from '../test-helpers/requester';

const PAGE_URL = '/claim-details';
const expectedTitle = 'Your claim details';
const titleClass = 'govuk-heading-xl';
const summaryListClass = 'govuk-summary-list';
const summaryListHeadingClass = 'govuk-summary-list__key govuk-heading-m';

const et1FormUrlSelector = 'govuk-link';

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
    htmlRes = await getHtmlRes(mockUserCaseComplete, PAGE_URL);
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

    expect(summaryLists[0].innerHTML).toMatch('Claim related information');
    expect(summaryLists[1].innerHTML).toMatch('Application details');
    expect(summaryLists[2].innerHTML).toMatch('Your details');
    expect(summaryLists[3].innerHTML).toMatch('Employment details');
    expect(summaryLists[4].innerHTML).toMatch('Respondent 1 details');
    expect(summaryLists[5].innerHTML).toMatch('Respondent 2 details');
    expect(summaryLists[6].innerHTML).toMatch('Claim details');
  });
});

describe('ET1 documents', () => {
  it('Shows the et1 form', async () => {
    htmlRes = await getHtmlRes({ ...mockUserCaseComplete, claimSummaryFile: undefined }, PAGE_URL);

    const et1FormLink = htmlRes.getElementsByClassName(et1FormUrlSelector)[5].innerHTML;

    expect(et1FormLink).toContain('ET1 Form');
  });
  it('Shows both the et1 form and the support document', async () => {
    const caseDocumentsModifier = {};
    htmlRes = await getHtmlRes({ ...mockUserCaseComplete, ...caseDocumentsModifier }, PAGE_URL);
    const et1FormLink = htmlRes.getElementsByClassName(et1FormUrlSelector)[5];
    const et1SupportDocLink = htmlRes.getElementsByClassName(et1FormUrlSelector)[6];
    expect(et1FormLink.innerHTML).toContain('ET1 Form');
    expect(et1FormLink.outerHTML).toContain('getCaseDocument/3aa7dfc1-378b-4fa8-9a17-89126fae5673');
    expect(et1SupportDocLink.innerHTML).toContain('ET1 support document');
    expect(et1SupportDocLink.outerHTML).toContain('getCaseDocument/a0c113ec-eede-472a-a59c-f2614b48177c');
  });
});
