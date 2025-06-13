import axios, { AxiosResponse } from 'axios';

import CitizenHubResponseFromRespondentController from '../../../../main/controllers/citizen-hub/CitizenHubResponseFromRespondentController';
import { CaseWithId } from '../../../../main/definitions/case';
import { HubLinksStatuses } from '../../../../main/definitions/hub';
import * as LaunchDarkly from '../../../../main/modules/featureFlag/launchDarkly';
import responseTranslations from '../../../../main/resources/locales/en/translation/response-from-respondent.json';
import { CaseApi } from '../../../../main/services/CaseService';
import * as caseService from '../../../../main/services/CaseService';
import { mockRequest, mockRequestWithTranslation } from '../../mocks/mockRequest';
import { mockResponse } from '../../mocks/mockResponse';

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

describe('Citizen Hub Document Response From Respondent Controller', () => {
  const mockLdClient = jest.spyOn(LaunchDarkly, 'getFlagValue');
  mockLdClient.mockResolvedValue(true);

  it('should redirect back to the citizen hub when the documents are not found in the userCase', async () => {
    const userCase: Partial<CaseWithId> = { id: '1' };
    const request = mockRequest({ userCase });
    const response = mockResponse();

    await new CitizenHubResponseFromRespondentController().get(request, response);

    expect(response.redirect).toHaveBeenCalledWith('/not-found');
  });

  it('should add ecc notifications and documents to response related information', async () => {
    const caseApi = new CaseApi(axios as jest.Mocked<typeof axios>);
    getCaseApiClientMock.mockReturnValue(caseApi);
    caseApi.getDocumentDetails = jest.fn().mockResolvedValue(axiosResponse);

    const userCase: Partial<CaseWithId> = {
      responseEt3FormDocumentDetail: [
        { type: 'ET3', id: '1', description: 'ET3 Form', createdOn: '1 November 2023', originalDocumentName: '1.pdf' },
        {
          type: 'ET3 Attachment',
          id: '1',
          description: 'attachment',
          createdOn: '2 November 2023',
          originalDocumentName: '2.pdf',
        },
        {
          type: 'et3Supporting',
          id: '1',
          description: 'tSupporting materials',
          createdOn: '3 November 2023',
          originalDocumentName: '3.pdf',
        },
        {
          type: '2.11',
          id: '1',
          description: 'Acceptance letter',
          createdOn: '4 November 2023',
          originalDocumentName: '4.pdf',
        },
        {
          type: 'Letter 14',
          id: '1',
          description: 'Acceptance of ET3',
          createdOn: '5 November 2023',
          originalDocumentName: '5.pdf',
        },
        {
          type: '2.12',
          id: '1',
          description: 'Rejection letter',
          createdOn: '6 November 2023',
          originalDocumentName: '6.pdf',
        },
      ],
      sendNotificationCollection: [
        {
          id: '1',
          value: {
            date: '1 December 2023',
            sendNotificationSubjectString: 'Response (ET3)',
            sendNotificationTitle: 'Show',
          },
        },
        {
          id: '2',
          value: {
            date: '2 December 2023',
            sendNotificationSubjectString: 'Employer Contract Claim',
            sendNotificationTitle: 'Show',
          },
        },
        {
          id: '3',
          value: {
            date: '3 December 2023',
            sendNotificationSubjectString: 'Employer Contract Claim, Response (ET3)',
            sendNotificationTitle: 'Show',
          },
        },
        {
          id: '4',
          value: {
            date: '4 December 2023',
            sendNotificationSubjectString: 'Hearing',
            sendNotificationTitle: 'Do not show',
          },
        },
      ],
    };

    const request = mockRequestWithTranslation({ userCase }, responseTranslations);
    request.session.userCase.hubLinksStatuses = new HubLinksStatuses();

    const response = mockResponse();

    let renderCalledWith: any = {};
    response.render = (view, data) => (renderCalledWith = { view, data });

    await new CitizenHubResponseFromRespondentController().get(request, response);

    const tableContents = renderCalledWith.data.tableContents;
    expect(renderCalledWith.view).toEqual('response-from-respondent-view');
    expect(tableContents).toHaveLength(9);

    expect(tableContents).toEqual([
      [
        { text: '3 December 2023' },
        { text: 'Response (ET3), Employer Contract Claim' },
        { html: '<a href="/notification-details/3" target="_blank" class="govuk-link">Show</a>' },
      ],
      [
        { text: '2 December 2023' },
        { text: 'Employer Contract Claim' },
        { html: '<a href="/notification-details/2" target="_blank" class="govuk-link">Show</a>' },
      ],
      [
        { text: '1 December 2023' },
        { text: 'Response (ET3)' },
        { html: '<a href="/notification-details/1" target="_blank" class="govuk-link">Show</a>' },
      ],
      [
        { text: '6 November 2023' },
        { text: 'Response rejected' },
        { html: '<a href="/getCaseDocument/1" target="_blank" class="govuk-link">6.pdf</a>' },
      ],
      [
        { text: '5 November 2023' },
        { text: 'Response accepted' },
        { html: '<a href="/getCaseDocument/1" target="_blank" class="govuk-link">5.pdf</a>' },
      ],
      [
        { text: '4 November 2023' },
        { text: 'Response accepted' },
        { html: '<a href="/getCaseDocument/1" target="_blank" class="govuk-link">4.pdf</a>' },
      ],
      [
        { text: '3 November 2023' },
        { text: 'Supporting materials' },
        { html: '<a href="/getCaseDocument/1" target="_blank" class="govuk-link">3.pdf</a>' },
      ],
      [
        { text: '2 November 2023' },
        { text: 'ET3 attachment' },
        { html: '<a href="/getCaseDocument/1" target="_blank" class="govuk-link">2.pdf</a>' },
      ],
      [
        { text: '8 September 2022' },
        { text: 'ET3 Form' },
        { html: '<a href="/getCaseDocument/1" target="_blank" class="govuk-link">sample.pdf</a>' },
      ],
    ]);
  });
});
