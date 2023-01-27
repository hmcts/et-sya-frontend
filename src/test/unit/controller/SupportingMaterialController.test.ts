import SupportingMaterialController from '../../../main/controllers/SupportingMaterialController';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';
describe('Supporting material Controller', () => {
  it('should redirect to not-found page if document id not provided', () => {
    const controller = new SupportingMaterialController();
    const response = mockResponse();
    const request = mockRequest({});
    controller.get(request, response);
    expect(response.redirect).toHaveBeenCalledWith('/not-found');
  });
});
