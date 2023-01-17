import ResponseCompleteController from '../../../main/controllers/ResponseCompleteController';
import { TranslationKeys } from '../../../main/definitions/constants';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Response Complete Controller tests', () => {
  it('should render the Response Complete page', () => {
    const controller = new ResponseCompleteController();
    const response = mockResponse();
    const request = mockRequest({});

    controller.get(request, response);

    expect(response.render).toHaveBeenCalledWith(TranslationKeys.RESPONSE_COMPLETE, expect.anything());
  });
});
