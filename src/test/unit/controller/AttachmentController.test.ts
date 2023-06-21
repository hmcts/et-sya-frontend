import AttachmentController from '../../../main/controllers/AttachmentController';
import { PageUrls } from '../../../main/definitions/constants';
import * as CaseService from '../../../main/services/CaseService';
import { mockGenericTseCollection } from '../mocks/mockGenericTseCollection';
import { notificationType } from '../mocks/mockNotificationItem';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';
import mockUserCase from '../mocks/mockUserCase';

describe('Attachment Controller', () => {
  const getCaseApiMock = jest.spyOn(CaseService, 'getCaseApi');
  (getCaseApiMock as jest.Mock).mockReturnValue(expect.anything());

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

  it('should call getCaseDocument if document id provided is for contact application file', () => {
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
    controller.get(request, response);
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
    request.session.documentDownloadPage = PageUrls.TRIBUNAL_ORDER_OR_REQUEST_DETAILS;

    controller.get(request, response);
    expect(getCaseApiMock).toHaveBeenCalled();
  });
});
