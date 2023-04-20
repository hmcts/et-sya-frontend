import TribunalResponseCompletedController from '../../../main/controllers/TribunalResponseCompletedController';
import { TranslationKeys } from '../../../main/definitions/constants';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Tribunal Response Completed Controller tests', () => {
  it('should render the Response Complete page', () => {
    const controller = new TribunalResponseCompletedController();
    const response = mockResponse();
    const request = mockRequest({});

    controller.get(request, response);

    expect(response.render).toHaveBeenCalledWith(TranslationKeys.TRIBUNAL_RESPONSE_COMPLETED, expect.anything());
  });
});
