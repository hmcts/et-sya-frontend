import RespondToApplicationCompleteController from '../../../main/controllers/RespondToApplicationCompleteController';
import { TranslationKeys } from '../../../main/definitions/constants';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Respond to Application Complete Controller tests', () => {
  it('should render the Response Complete page', () => {
    const controller = new RespondToApplicationCompleteController();
    const response = mockResponse();
    const request = mockRequest({});

    controller.get(request, response);

    expect(response.render).toHaveBeenCalledWith(TranslationKeys.RESPOND_TO_APPLICATION_COMPLETE, expect.anything());
  });
});
