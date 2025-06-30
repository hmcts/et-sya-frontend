import axios, { AxiosResponse } from 'axios';

import CitizenHubDocumentController from '../../../../main/controllers/citizen-hub/CitizenHubDocumentController';
import { CaseWithId } from '../../../../main/definitions/case';
import { DocumentDetail } from '../../../../main/definitions/definition';
import { HubLinksStatuses } from '../../../../main/definitions/hub';
import * as LaunchDarkly from '../../../../main/modules/featureFlag/launchDarkly';
import translations from '../../../../main/resources/locales/en/translation/acknowledgement-of-claim.json';
import { CaseApi } from '../../../../main/services/CaseService';
import * as caseService from '../../../../main/services/CaseService';
import { mockRequestWithTranslation } from '../../mocks/mockRequest';
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

describe('Citizen Hub Document Controller', () => {
  const mockLdClient = jest.spyOn(LaunchDarkly, 'getFlagValue');
  mockLdClient.mockResolvedValue(true);

  it('should render Acknowledgement Documents Page', async () => {
    const caseApi = new CaseApi(axios as jest.Mocked<typeof axios>);
    getCaseApiClientMock.mockReturnValue(caseApi);
    caseApi.getDocumentDetails = jest.fn().mockResolvedValue(axiosResponse);

    const servingDocuments: DocumentDetail[] = [{ id: '1', description: 'description' }];
    const userCase: Partial<CaseWithId> = { acknowledgementOfClaimLetterDetail: servingDocuments };

    const request = mockRequestWithTranslation({ userCase }, translations);
    request.session.userCase.hubLinksStatuses = new HubLinksStatuses();
    const response = mockResponse();
    request.params.documentType = 'acknowledgement-of-claim';
    await new CitizenHubDocumentController().get(request, response);
    expect(response.render).toHaveBeenCalledWith('document-view', expect.anything());
  });

  it('should call render and pass an object containing the correctly formatted document details', async () => {
    const caseApi = new CaseApi(axios as jest.Mocked<typeof axios>);
    getCaseApiClientMock.mockReturnValue(caseApi);
    caseApi.getDocumentDetails = jest.fn().mockResolvedValue(axiosResponse);

    const servingDocuments: DocumentDetail[] = [{ id: '1', description: 'description' }];
    const userCase: Partial<CaseWithId> = { acknowledgementOfClaimLetterDetail: servingDocuments };

    const request = mockRequestWithTranslation({ userCase }, translations);
    request.session.userCase.hubLinksStatuses = new HubLinksStatuses();

    const response = mockResponse();
    request.params.documentType = 'acknowledgement-of-claim';

    await new CitizenHubDocumentController().get(request, response);
    expect(response.render).toHaveBeenCalledWith(
      'document-view',
      expect.objectContaining({
        docs: [
          {
            rows: [
              [{ text: 'Description' }, { text: 'Acknowledgement of Claim' }],
              [
                { text: 'Document' },
                { html: '<a href="/getCaseDocument/1" target="_blank" class="govuk-link">sample.pdf [0.011MB]</a>' },
              ],
              [{ text: 'Details' }, { html: 'description' }],
              [{ text: 'Date' }, { html: '8 September 2022' }],
            ],
          },
        ],
      })
    );
  });

  it('should redirect to not-found when the document request returns an error', async () => {
    const caseApi = new CaseApi(axios as jest.Mocked<typeof axios>);
    getCaseApiClientMock.mockReturnValue(caseApi);

    caseApi.getDocumentDetails = jest.fn().mockResolvedValue(new Error('test error message'));

    const servingDocuments: DocumentDetail[] = [{ id: '1', description: 'description' }];
    const userCase: Partial<CaseWithId> = { acknowledgementOfClaimLetterDetail: servingDocuments };

    const request = mockRequestWithTranslation({ userCase }, translations);
    const response = mockResponse();
    request.params.documentType = 'unknown';

    await new CitizenHubDocumentController().get(request, response);

    expect(response.redirect).toHaveBeenCalledWith('/not-found');
  });

  it('should redirect back to the citizen hub when the acknowledment documents are not found in the userCase', async () => {
    const userCase: Partial<CaseWithId> = { id: '1' };
    const request = mockRequestWithTranslation({ userCase }, translations);
    const response = mockResponse();

    await new CitizenHubDocumentController().get(request, response);

    expect(response.redirect).toHaveBeenCalledWith('/not-found');
  });
});
