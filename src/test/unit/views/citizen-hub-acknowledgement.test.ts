import axios, { AxiosResponse } from 'axios';
import request from 'supertest';

import { CaseApi } from '../../../main/services/CaseService';
import * as caseService from '../../../main/services/CaseService';
import { mockApp } from '../mocks/mockApp';

const PAGE_URL = '/acknowledgement';
const titleClass = 'govuk-heading-xl';

let htmlRes: Document;

jest.mock('axios');
const getCaseApiClientMock = jest.spyOn(caseService, 'getCaseApi');
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

const caseApi = new CaseApi(axios as jest.Mocked<typeof axios>);
getCaseApiClientMock.mockReturnValue(caseApi);
caseApi.getDocumentDetails = jest.fn().mockResolvedValue(axiosResponse);

describe('Citizen Hub acknowledgement of Claim', () => {
  beforeAll(async () => {
    await request(
      mockApp({
        userCase: {
          acknowledgementOfClaimLetterDetail: [
            { id: 'abc123', description: 'text' },
            { id: 'xyz123', description: 'a sentence' },
          ],
        },
      })
    )
      .get(PAGE_URL)
      .then(res => {
        htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
      });
  });

  it('should display title', () => {
    const title = htmlRes.getElementsByClassName(titleClass);
    expect(title[0].innerHTML).toContain('Acknowledgement of Claim');
  });
});
