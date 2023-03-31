import TribunalOrderDocumentController from '../../../main/controllers/TribunalOrderDocumentController';
import { Document } from '../../../main/definitions/case';
import {
  DocumentType,
  DocumentTypeItem,
  SendNotificationType,
  SendNotificationTypeItem,
} from '../../../main/definitions/complexTypes/sendNotificationTypeItem';
import * as caseApi from '../../../main/services/CaseService';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Tribunal order document Controller', () => {
  const getCaseApiMock = jest.spyOn(caseApi, 'getCaseApi');
  (getCaseApiMock as jest.Mock).mockReturnValue(expect.anything());

  it('should redirect to not-found page if document id not provided', () => {
    const controller = new TribunalOrderDocumentController();
    const response = mockResponse();
    const request = mockRequest({});
    controller.get(request, response);
    expect(response.redirect).toHaveBeenCalledWith('/not-found');
  });

  it('should call getCaseDocument if document id provided', () => {
    const controller = new TribunalOrderDocumentController();
    const response = mockResponse();
    const userCase = {};
    const request = mockRequest({ userCase });

    const doc: Document = {
      document_url: '12345',
      document_filename: 'test.pdf',
      document_binary_url: '',
      document_size: 1000,
      document_mime_type: 'pdf',
    };

    const docType = {
      shortDescription: 'Short description',
      uploadedDocument: doc,
    } as DocumentType;

    const docItem = {
      value: docType,
    } as DocumentTypeItem;

    const notificationType = {
      sendNotificationUploadDocument: [docItem],
    } as SendNotificationType;

    request.session.userCase.selectedRequestOrOrder = {
      value: notificationType,
    } as SendNotificationTypeItem;

    request.params.docId = '12345';

    controller.get(request, response);
    expect(getCaseApiMock).toHaveBeenCalled();
  });
});
