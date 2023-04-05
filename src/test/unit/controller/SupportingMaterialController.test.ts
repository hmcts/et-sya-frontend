import SupportingMaterialController from '../../../main/controllers/SupportingMaterialController';
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

  it('should call getCaseDocument if document id provided in url params', () => {
    const controller = new SupportingMaterialController();
    const response = mockResponse();
    const userCase = {};
    const request = mockRequest({ userCase });
    request.params.docId = '12345';
    controller.get(request, response);
    expect(getCaseApiMock).toHaveBeenCalled();
  });
});
