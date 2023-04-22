import CaseDocumentController from '../../../main/controllers/CaseDocumentController';
import { CaseWithId } from '../../../main/definitions/case';
import { CaseState } from '../../../main/definitions/definition';
import * as caseSelectionService from '../../../main/services/CaseSelectionService';
import { CaseApi } from '../../../main/services/CaseService';
import * as caseService from '../../../main/services/CaseService';
import { mockApplications } from '../mocks/mockApplications';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

const getUserCasesMock = jest.spyOn(caseSelectionService, 'getUserCasesByLastModified');
const getUserAppMock = jest.spyOn(caseSelectionService, 'getUserApplications');
const getCaseApiMock = jest.spyOn(caseService, 'getCaseApi');
const axios = require('axios');
jest.mock('axios');
const api = new CaseApi(axios);

describe('Case Document Controller', () => {
  const t = {};
  const userCases: CaseWithId[] = [
    {
      id: '12454',
      state: CaseState.SUBMITTED,
      createdDate: 'August 19, 2022',
      lastModified: 'August 19, 2022',
      et1SubmittedForm: {
        id: '1',
        description: 'desc',
        mimeType: 'image/jpeg',
        size: '123',
        createdOn: '01/12/2023',
      },
      acknowledgementOfClaimLetterDetail: [
        {
          id: '2',
          description: 'desc',
          mimeType: 'application/pdf',
          size: '123',
          createdOn: '01/12/2023',
        },
      ],
      allEt1DocumentDetails: [
        {
          id: '3',
          description: 'desc',
          mimeType: 'application/pdf',
          size: '123',
          createdOn: '01/12/2023',
        },
      ],
      rejectionOfClaimDocumentDetail: [
        {
          id: '4',
          description: 'desc',
          size: '123',
          createdOn: '01/12/2023',
          originalDocumentName: 'rejection_of_claim.png',
        },
      ],
      responseAcknowledgementDocumentDetail: [
        {
          id: '5',
          description: 'desc',
          size: '123',
          createdOn: '01/12/2023',
        },
      ],
    },
  ];

  const documentWithContentType = {
    headers: {
      originalfilename: 'ET1_CASE_DOCUMENT_Random_Man.pdf',
      'content-disposition': 'fileName="ET1_CASE_DOCUMENT_Random_Man.pdf"',
      'data-source': 'contentURI',
      'x-content-type-options': 'nosniff',
      'x-xss-protection': '1; mode=block',
      'x-frame-options': 'DENY',
      date: 'Thu, 20 Apr 2023 10:35:17 GMT',
      'keep-alive': 'timeout=60',
      connection: 'keep-alive, keep-alive, close',
      'accept-ranges': 'bytes',
      'cache-control': 'no-cache, no-store, max-age=0, must-revalidate',
      pragma: 'no-cache',
      expires: '0',
      'content-type': 'application/vnd.ms-excel',
      'content-length': '244991',
    },
    data: 'text',
  };

  const documentWithOriginalFileName = {
    headers: {
      originalfilename: 'ET1_CASE_DOCUMENT_Random_Man.doc',
      'content-disposition': 'fileName="ET1_CASE_DOCUMENT_Random_Man.doc"',
      'data-source': 'contentURI',
      'x-content-type-options': 'nosniff',
      'x-xss-protection': '1; mode=block',
      'x-frame-options': 'DENY',
      date: 'Thu, 20 Apr 2023 10:35:17 GMT',
      'keep-alive': 'timeout=60',
      connection: 'keep-alive, keep-alive, close',
      'accept-ranges': 'bytes',
      'cache-control': 'no-cache, no-store, max-age=0, must-revalidate',
      pragma: 'no-cache',
      expires: '0',
      'content-length': '244991',
    },
    data: 'text',
  };

  const documentWithInvalidOriginalFileName = {
    headers: {
      originalfilename: 'ET1_CASE_DOCUMENT_Random_Man.xyz',
      'content-disposition': 'fileName="ET1_CASE_DOCUMENT_Random_Man.xyz"',
      'data-source': 'contentURI',
      'x-content-type-options': 'nosniff',
      'x-xss-protection': '1; mode=block',
      'x-frame-options': 'DENY',
      date: 'Thu, 20 Apr 2023 10:35:17 GMT',
      'keep-alive': 'timeout=60',
      connection: 'keep-alive, keep-alive, close',
      'accept-ranges': 'bytes',
      'cache-control': 'no-cache, no-store, max-age=0, must-revalidate',
      pragma: 'no-cache',
      expires: '0',
      'content-length': '244991',
    },
    data: 'text',
  };

  const documentWithFileName = {
    headers: {
      'content-disposition': 'fileName="ET1_CASE_DOCUMENT_Random_Man.txt"',
      'data-source': 'contentURI',
      'x-content-type-options': 'nosniff',
      'x-xss-protection': '1; mode=block',
      'x-frame-options': 'DENY',
      date: 'Thu, 20 Apr 2023 10:35:17 GMT',
      'keep-alive': 'timeout=60',
      connection: 'keep-alive, keep-alive, close',
      'accept-ranges': 'bytes',
      'cache-control': 'no-cache, no-store, max-age=0, must-revalidate',
      pragma: 'no-cache',
      expires: '0',
      'content-length': '244991',
    },
    data: 'text',
  };

  const documentWithNoContentTypeNoFileName = {
    headers: {
      'data-source': 'contentURI',
      'x-content-type-options': 'nosniff',
      'x-xss-protection': '1; mode=block',
      'x-frame-options': 'DENY',
      date: 'Thu, 20 Apr 2023 10:35:17 GMT',
      'keep-alive': 'timeout=60',
      connection: 'keep-alive, keep-alive, close',
      'accept-ranges': 'bytes',
      'cache-control': 'no-cache, no-store, max-age=0, must-revalidate',
      pragma: 'no-cache',
      expires: '0',
      'content-length': '244991',
    },
    data: 'text',
  };

  const caseDocumentController = new CaseDocumentController();

  it('should retrieve the binary document when mime-type in document detail', async () => {
    getUserCasesMock.mockResolvedValue(userCases);
    getUserAppMock.mockReturnValue(mockApplications);
    getCaseApiMock.mockReturnValue(api);

    const request = mockRequest({});
    const response = mockResponse();
    request.params.docId = '1';
    await caseDocumentController.get(request, response);
    expect(response.setHeader).toHaveBeenCalledWith('Content-Type', 'image/jpeg');
    expect(response.status).toHaveBeenCalledWith(200);
  });

  it(
    'should retrieve the binary document when no mime-type but original ' + 'document name in document detail',
    async () => {
      getUserCasesMock.mockResolvedValue(userCases);
      getUserAppMock.mockReturnValue(mockApplications);
      getCaseApiMock.mockReturnValue(api);

      axios.get.mockResolvedValue(documentWithContentType);
      const request = mockRequest({});
      const response = mockResponse();
      request.params.docId = '4';
      await caseDocumentController.get(request, response);
      expect(response.setHeader).toHaveBeenCalledWith('Content-Type', 'image/png');
      expect(response.status).toHaveBeenCalledWith(200);
    }
  );

  it(
    'should retrieve the binary document when no mime-type in document ' + 'detail but content-type in document',
    async () => {
      getUserCasesMock.mockResolvedValue(userCases);
      getUserAppMock.mockReturnValue(mockApplications);
      getCaseApiMock.mockReturnValue(api);

      axios.get.mockResolvedValue(documentWithContentType);
      const request = mockRequest({});
      const response = mockResponse();
      request.params.docId = '5';
      await caseDocumentController.get(request, response);
      expect(response.setHeader).toHaveBeenCalledWith('Content-Type', 'application/vnd.ms-excel');
      expect(response.status).toHaveBeenCalledWith(200);
    }
  );

  it(
    'should retrieve the binary document when no mime-type in document ' + 'detail but original filename in document',
    async () => {
      getUserCasesMock.mockResolvedValue(userCases);
      getUserAppMock.mockReturnValue(mockApplications);
      getCaseApiMock.mockReturnValue(api);

      axios.get.mockResolvedValue(documentWithOriginalFileName);
      const request = mockRequest({});
      const response = mockResponse();
      request.params.docId = '5';
      await caseDocumentController.get(request, response);
      expect(response.setHeader).toHaveBeenCalledWith('Content-Type', 'application/vnd.ms-word');
      expect(response.status).toHaveBeenCalledWith(200);
    }
  );

  it(
    'should retrieve the binary pdf document when no mime-type in document detail ' +
      'but invalid original filename in document',
    async () => {
      getUserCasesMock.mockResolvedValue(userCases);
      getUserAppMock.mockReturnValue(mockApplications);
      getCaseApiMock.mockReturnValue(api);

      axios.get.mockResolvedValue(documentWithInvalidOriginalFileName);
      const request = mockRequest({});
      const response = mockResponse();
      request.params.docId = '5';
      await caseDocumentController.get(request, response);
      expect(response.setHeader).toHaveBeenCalledWith('Content-Type', 'application/pdf');
      expect(response.status).toHaveBeenCalledWith(200);
    }
  );

  it(
    'should retrieve the binary document when no mime-type in document ' + 'detail but filename in document',
    async () => {
      getUserCasesMock.mockResolvedValue(userCases);
      getUserAppMock.mockReturnValue(mockApplications);
      getCaseApiMock.mockReturnValue(api);

      axios.get.mockResolvedValue(documentWithFileName);
      const request = mockRequest({});
      const response = mockResponse();
      request.params.docId = '5';
      await caseDocumentController.get(request, response);
      expect(response.setHeader).toHaveBeenCalledWith('Content-Type', 'text/plain');
      expect(response.status).toHaveBeenCalledWith(200);
    }
  );

  it(
    'should retrieve the binary document when no mime-type in document ' + 'detail and nothing in document',
    async () => {
      getUserCasesMock.mockResolvedValue(userCases);
      getUserAppMock.mockReturnValue(mockApplications);
      getCaseApiMock.mockReturnValue(api);

      axios.get.mockResolvedValue(documentWithNoContentTypeNoFileName);
      const request = mockRequest({});
      const response = mockResponse();
      request.params.docId = '5';
      await caseDocumentController.get(request, response);
      expect(response.setHeader).toHaveBeenCalledWith('Content-Type', 'application/pdf');
      expect(response.status).toHaveBeenCalledWith(200);
    }
  );

  it('should redirect to not found when document not found in user cases', async () => {
    getUserCasesMock.mockResolvedValue(userCases);
    getUserAppMock.mockReturnValue(mockApplications);
    getCaseApiMock.mockReturnValue(api);

    const request = mockRequest({});
    const response = mockResponse();
    request.params.docId = '123';
    await caseDocumentController.get(request, response);
    expect(response.redirect).toHaveBeenCalledWith('/not-found');
  });

  it('should redirect to not found on bad request parameter', async () => {
    const response = mockResponse();
    const request = mockRequest({ t });
    request.params.docId = '';
    await caseDocumentController.get(request, response);
    expect(response.redirect).toHaveBeenCalledWith('/not-found');
  });
});
