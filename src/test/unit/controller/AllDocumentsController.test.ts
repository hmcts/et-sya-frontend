import AllDocumentsController from '../../../main/controllers/AllDocumentsController';
import { TranslationKeys } from '../../../main/definitions/constants';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('AllDocumentsController', () => {
  it('should render the All documents page', () => {
    const controller = new AllDocumentsController();
    const response = mockResponse();
    const request = mockRequest({});
    controller.get(request, response);

    expect(response.render).toHaveBeenCalledWith(TranslationKeys.ALL_DOCUMENTS, expect.anything());
  });
});
