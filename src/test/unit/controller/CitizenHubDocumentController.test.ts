import axios from 'axios';

import CitizenHubDocumentController from '../../../main/controllers/CitizenHubDocumentController';
import { CaseWithId } from '../../../main/definitions/case';
import { DocumentDetail } from '../../../main/definitions/definition';
import { HubLinksStatuses } from '../../../main/definitions/hub';
import { CaseApi } from '../../../main/services/CaseService';
import * as caseService from '../../../main/services/CaseService';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

jest.mock('axios');
const getCaseApiClientMock = jest.spyOn(caseService, 'getCaseApi');

describe('Citizen Hub Document Controller', () => {
  it('should render Acknowledgement Documents Page', async () => {
    const caseApi = new CaseApi(axios as jest.Mocked<typeof axios>);
    getCaseApiClientMock.mockReturnValue(caseApi);

    const servingDocuments: DocumentDetail[] = [{ id: '1', description: 'description' }];
    const userCase: Partial<CaseWithId> = { acknowledgementOfClaimLetterDetail: servingDocuments };

    const request = mockRequest({ userCase });
    request.session.userCase.hubLinksStatuses = new HubLinksStatuses();
    const response = mockResponse();
    request.params.documentType = 'acknowledgement-of-claim';
    await new CitizenHubDocumentController().get(request, response);
    expect(response.render).toHaveBeenCalledWith('document-view', expect.anything());
  });

  it('should call render and pass an object containing the correctly formatted document details', async () => {
    const caseApi = new CaseApi(axios as jest.Mocked<typeof axios>);
    getCaseApiClientMock.mockReturnValue(caseApi);

    const servingDocuments: DocumentDetail[] = [{ id: '1', description: 'description' }];
    const userCase: Partial<CaseWithId> = { acknowledgementOfClaimLetterDetail: servingDocuments };

    const request = mockRequest({ userCase });
    request.session.userCase.hubLinksStatuses = new HubLinksStatuses();

    const response = mockResponse();
    request.params.documentType = 'acknowledgement-of-claim';

    await new CitizenHubDocumentController().get(request, response);
    expect(response.render).toHaveBeenCalledWith(
      'document-view',
      expect.objectContaining({
        docs: [
          {
            description: 'description',
            id: '1',
          },
        ],
      })
    );
  });
  it('should redirect to not-found when the document request returns an error', async () => {
    const caseApi = new CaseApi(axios as jest.Mocked<typeof axios>);
    getCaseApiClientMock.mockReturnValue(caseApi);

    const servingDocuments: DocumentDetail[] = [{ id: '1', description: 'description' }];
    const userCase: Partial<CaseWithId> = { acknowledgementOfClaimLetterDetail: servingDocuments };

    const request = mockRequest({ userCase });
    const response = mockResponse();
    request.params.documentType = 'unknown';

    await new CitizenHubDocumentController().get(request, response);

    expect(response.redirect).toHaveBeenCalledWith('/not-found');
  });

  it('should redirect back to the citizen hub when the acknowledment documents are not found in the userCase', async () => {
    const userCase: Partial<CaseWithId> = { id: '1' };
    const request = mockRequest({ userCase });
    const response = mockResponse();

    await new CitizenHubDocumentController().get(request, response);

    expect(response.redirect).toHaveBeenCalledWith('/not-found');
  });
});
