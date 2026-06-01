import AttachmentController from '../../../main/controllers/AttachmentController';
import { PageUrls } from '../../../main/definitions/constants';
import * as LaunchDarkly from '../../../main/modules/featureFlag/launchDarkly';
import { CaseApi } from '../../../main/services/CaseService';
import * as CaseService from '../../../main/services/CaseService';
import { mockGenericTseCollection } from '../mocks/mockGenericTseCollection';
import { notificationType } from '../mocks/mockNotificationItem';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';
import mockUserCase from '../mocks/mockUserCase';
import mockUserCaseComplete from '../mocks/mockUserCaseComplete';

describe('Attachment Controller', () => {
  const getCaseApiMock = jest.spyOn(CaseService, 'getCaseApi');
  (getCaseApiMock as jest.Mock).mockReturnValue(expect.anything());
  const mockLdClient = jest.spyOn(LaunchDarkly, 'getFlagValue');

  beforeEach(() => {
    mockLdClient.mockResolvedValue(false);
  });

  it('should redirect to not-found page if document id not provided', () => {
    const controller = new AttachmentController();
    const response = mockResponse();
    const request = mockRequest({});
    controller.get(request, response);
    expect(response.redirect).toHaveBeenCalledWith('/not-found');
  });

  it('should redirect to not-found page if wrong document id  provided', () => {
    const controller = new AttachmentController();
    const response = mockResponse();
    const request = mockRequest({});
    request.params.docId = '123456';
    controller.get(request, response);
    expect(response.redirect).toHaveBeenCalledWith('/not-found');
  });

  it('should call getCaseDocument if document id provided is for contact application file', async () => {
    const controller = new AttachmentController();
    const response = mockResponse();
    const userCase = {};
    const request = mockRequest({ userCase });
    request.params.docId = '12345';
    request.session.userCase.contactApplicationFile = {
      document_url: 'http.site/12345',
      document_binary_url: 'bdf',
      document_filename: 'dfgdf',
    };
    await controller.get(request, response);
    expect(getCaseApiMock).toHaveBeenCalled();
  });

  it('should call getCaseDocument if document id provided is for supporting material file', () => {
    const controller = new AttachmentController();
    const response = mockResponse();
    const userCase = {};
    const request = mockRequest({ userCase });
    request.params.docId = '12345';
    request.session.userCase.supportingMaterialFile = {
      document_url: 'http.site/12345',
      document_binary_url: 'bdf',
      document_filename: 'dfgdf',
    };
    controller.get(request, response);
    expect(getCaseApiMock).toHaveBeenCalled();
  });

  it('should call getCaseDocument if document id provided is on selected application upload', () => {
    const controller = new AttachmentController();
    const response = mockResponse();
    const userCase = mockUserCase;
    userCase.selectedGenericTseApplication = mockGenericTseCollection[0];
    userCase.selectedGenericTseApplication.value.documentUpload.document_url = 'http.site/12345';
    const request = mockRequest({ userCase });
    request.params.docId = '12345';
    request.session.documentDownloadPage = PageUrls.RESPONDENT_APPLICATION_DETAILS;

    controller.get(request, response);
    expect(getCaseApiMock).toHaveBeenCalled();
  });

  it('should call getCaseDocument if document id provided is on selected application upload for claimant', () => {
    const controller = new AttachmentController();
    const response = mockResponse();
    const userCase = mockUserCase;
    userCase.selectedGenericTseApplication = mockGenericTseCollection[0];
    userCase.selectedGenericTseApplication.value.documentUpload.document_url = 'http.site/12345';
    const request = mockRequest({ userCase });
    request.params.docId = '12345';
    request.session.documentDownloadPage = PageUrls.APPLICATION_DETAILS;

    controller.get(request, response);
    expect(getCaseApiMock).toHaveBeenCalled();
  });

  it('should call getCaseDocument if document id provided is on selected application admin decision', () => {
    const controller = new AttachmentController();
    const response = mockResponse();
    const userCase = mockUserCase;
    userCase.selectedGenericTseApplication = mockGenericTseCollection[0];
    userCase.selectedGenericTseApplication.value.adminDecision[0].value.responseRequiredDoc[0].value.uploadedDocument.document_url =
      'http.site/12345';
    const request = mockRequest({ userCase });
    request.params.docId = '12345';
    request.session.documentDownloadPage = PageUrls.RESPONDENT_APPLICATION_DETAILS;

    controller.get(request, response);
    expect(getCaseApiMock).toHaveBeenCalled();
  });

  it('should call getCaseDocument if document id provided is on selected request or order', () => {
    const controller = new AttachmentController();
    const response = mockResponse();
    const userCase = mockUserCase;
    userCase.selectedRequestOrOrder = {
      id: '1',
      value: notificationType,
    };
    userCase.selectedRequestOrOrder.value.sendNotificationUploadDocument[0].value.uploadedDocument.document_url =
      'http.site/12345';
    const request = mockRequest({ userCase });
    request.params.docId = '12345';
    request.session.documentDownloadPage = PageUrls.NOTIFICATION_DETAILS;

    controller.get(request, response);
    expect(getCaseApiMock).toHaveBeenCalled();
  });

  it('should call getCaseDocument if document id provided is doc from judgement', () => {
    const controller = new AttachmentController();
    const response = mockResponse();
    const userCase = mockUserCase;
    userCase.selectedRequestOrOrder = {
      id: '1',
      value: notificationType,
    };
    userCase.selectedRequestOrOrder.value.sendNotificationUploadDocument[0].value.uploadedDocument.document_url =
      'http.site/12345';
    const request = mockRequest({ userCase });
    request.params.docId = '12345';
    request.session.documentDownloadPage = PageUrls.JUDGMENT_DETAILS;

    controller.get(request, response);
    expect(getCaseApiMock).toHaveBeenCalled();
  });

  it('should call getCaseDocument if document id is in document collection', () => {
    const controller = new AttachmentController();
    const response = mockResponse();
    const userCase = mockUserCaseComplete;
    userCase.documentCollection[0].value.uploadedDocument.document_url = 'http.site/12345';
    const request = mockRequest({ userCase });
    request.params.docId = '12345';
    request.session.documentDownloadPage = PageUrls.ALL_DOCUMENTS;

    controller.get(request, response);
    expect(getCaseApiMock).toHaveBeenCalled();
  });

  it('should call not found if document id is not in document collection', () => {
    const controller = new AttachmentController();
    const response = mockResponse();
    const userCase = mockUserCaseComplete;
    userCase.documentCollection[0].value.uploadedDocument.document_url = 'http.site/1256';
    const request = mockRequest({ userCase });
    request.params.docId = '12345';
    request.session.documentDownloadPage = PageUrls.ALL_DOCUMENTS;

    controller.get(request, response);
    expect(response.redirect).toHaveBeenCalledWith('/not-found');
  });

  it('should set Content-Type header and pipe document data to response on successful fetch', async () => {
    const controller = new AttachmentController();
    const response = mockResponse();
    const userCase = {};
    const request = mockRequest({ userCase });
    request.params.docId = '12345';
    request.session.userCase.contactApplicationFile = {
      document_url: 'http.site/12345',
      document_binary_url: 'bdf',
      document_filename: 'dfgdf',
    };

    const mockPipe = jest.fn();
    const mockDocument = {
      headers: { 'content-type': 'application/pdf', 'content-length': '1024' },
      data: { pipe: mockPipe },
    };
    getCaseApiMock.mockReturnValue({
      getCaseDocument: jest.fn().mockResolvedValue(mockDocument),
    } as unknown as CaseApi);

    await controller.get(request, response);

    expect(response.setHeader).toHaveBeenCalledWith('Content-Type', 'application/pdf');
    expect(response.setHeader).toHaveBeenCalledWith('Content-Length', '1024');
    expect(response.status).toHaveBeenCalledWith(200);
    expect(mockPipe).toHaveBeenCalledWith(response);
  });

  it('should call getCaseDocument with useStreaming=false when document-streaming flag is off', async () => {
    mockLdClient.mockResolvedValue(false);
    const userCase = {};
    const request = mockRequest({ userCase });
    request.params.docId = '12345';
    request.session.userCase.contactApplicationFile = {
      document_url: 'http.site/12345',
      document_binary_url: 'bdf',
      document_filename: 'dfgdf',
    };
    const mockGetCaseDocument = jest.fn().mockResolvedValue({
      headers: { 'content-type': 'application/pdf' },
      data: { pipe: jest.fn() },
    });
    getCaseApiMock.mockReturnValue({ getCaseDocument: mockGetCaseDocument } as unknown as CaseApi);

    await new AttachmentController().get(request, mockResponse());

    expect(mockGetCaseDocument).toHaveBeenCalledWith('12345', false);
  });

  it('should call getCaseDocument with useStreaming=true when document-streaming flag is on', async () => {
    mockLdClient.mockResolvedValue(true);
    const userCase = {};
    const request = mockRequest({ userCase });
    request.params.docId = '12345';
    request.session.userCase.contactApplicationFile = {
      document_url: 'http.site/12345',
      document_binary_url: 'bdf',
      document_filename: 'dfgdf',
    };
    const mockGetCaseDocument = jest.fn().mockResolvedValue({
      headers: { 'content-type': 'application/pdf' },
      data: { pipe: jest.fn() },
    });
    getCaseApiMock.mockReturnValue({ getCaseDocument: mockGetCaseDocument } as unknown as CaseApi);

    await new AttachmentController().get(request, mockResponse());

    expect(mockGetCaseDocument).toHaveBeenCalledWith('12345', true);
  });
});
