import SupportingMaterialController from '../../../main/controllers/SupportingMaterialController';
import { Document } from '../../../main/definitions/case';
import {
  GenericTseApplicationType,
  GenericTseApplicationTypeItem,
} from '../../../main/definitions/complexTypes/genericTseApplicationTypeItem';
import * as caseApi from '../../../main/services/CaseService';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Supporting material Controller', () => {
  const getCaseApiMock = jest.spyOn(caseApi, 'getCaseApi');
  (getCaseApiMock as jest.Mock).mockReturnValue(expect.anything());

  it('should redirect to not-found page if document id not provided', () => {
    const controller = new SupportingMaterialController();
    const response = mockResponse();
    const request = mockRequest({});
    controller.get(request, response);
    expect(response.redirect).toHaveBeenCalledWith('/not-found');
  });

  it('should call getCaseDocument if contactApplication document id provided', () => {
    const controller = new SupportingMaterialController();
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

    request.session.userCase.contactApplicationFile = doc;
    controller.get(request, response);
    expect(getCaseApiMock).toHaveBeenCalled();
  });

  it('should call getCaseDocument if genericTseApplicationCollection document id provided', () => {
    const controller = new SupportingMaterialController();
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

    const type: GenericTseApplicationType = {
      documentUpload: doc,
      number: '1',
    };

    const item: GenericTseApplicationTypeItem = {
      value: type,
    };

    request.session.userCase.genericTseApplicationCollection = [item];
    request.session.userCase.selectedGenericTseApplicationNumber = '1';

    controller.get(request, response);
    expect(getCaseApiMock).toHaveBeenCalled();
  });
});
