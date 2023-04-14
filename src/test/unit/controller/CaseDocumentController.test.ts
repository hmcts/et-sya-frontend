import axios from 'axios';

import CaseDocumentController from '../../../main/controllers/CaseDocumentController';
import { CaseWithId } from '../../../main/definitions/case';
import { CaseState } from '../../../main/definitions/definition';
import * as caseSelectionService from '../../../main/services/CaseSelectionService';
import { CaseApi } from '../../../main/services/CaseService';
import * as caseService from '../../../main/services/CaseService';
import { mockApplications } from '../mocks/mockApplications';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

jest.mock('axios');
const getUserCasesMock = jest.spyOn(caseSelectionService, 'getUserCasesByLastModified');
const getUserAppMock = jest.spyOn(caseSelectionService, 'getUserApplications');
const getCaseApiMock = jest.spyOn(caseService, 'getCaseApi');
const mockedAxios = axios as jest.Mocked<typeof axios>;
const api = new CaseApi(mockedAxios);

describe('Case Document Controller', () => {
  const t = {};
  const userCases: CaseWithId[] = [
    {
      id: '12454',
      state: CaseState.SUBMITTED,
      createdDate: 'August 19, 2022',
      lastModified: 'August 19, 2022',
      et1SubmittedForm: {
        id: '1234',
        description: 'desc',
        mimeType: 'application/pdf',
        size: '123',
        createdOn: '01/12/2023',
        originalDocumentName: 'claim.pdf',
      },
    },
  ];

  it('should retrieve the binary document', async () => {
    getUserCasesMock.mockResolvedValue(userCases);
    getUserAppMock.mockReturnValue(mockApplications);
    getCaseApiMock.mockReturnValue(api);

    const caseDocumentController = new CaseDocumentController();
    const request = mockRequest({});
    const response = mockResponse();
    request.params.docId = '1234';
    await caseDocumentController.get(request, response);
    expect(response.setHeader).toHaveBeenCalledWith('Content-Type', 'application/pdf');
    expect(response.status).toHaveBeenCalledWith(200);
  });

  it('should redirect to not found when document not found in user cases', async () => {
    getUserCasesMock.mockResolvedValue(userCases);
    getUserAppMock.mockReturnValue(mockApplications);
    getCaseApiMock.mockReturnValue(api);

    const caseDocumentController = new CaseDocumentController();
    const request = mockRequest({});
    const response = mockResponse();
    request.params.docId = '12345';
    await caseDocumentController.get(request, response);
    expect(response.redirect).toHaveBeenCalledWith('/not-found');
  });

  it('should redirect to not found on bad request parameter', async () => {
    const response = mockResponse();
    const request = mockRequest({ t });
    request.params.docId = '';
    await new CaseDocumentController().get(request, response);
    expect(response.redirect).toHaveBeenCalledWith('/not-found');
  });
});
