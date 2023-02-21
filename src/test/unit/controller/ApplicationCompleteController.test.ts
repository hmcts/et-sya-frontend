import ApplicationCompleteController from '../../../main/controllers/ApplicationCompleteController';
import { TranslationKeys } from '../../../main/definitions/constants';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Application Complete Controller tests', () => {
  it('should render the Application Complete page', () => {
    const controller = new ApplicationCompleteController();
    const response = mockResponse();
    const request = mockRequest({});

    controller.get(request, response);

    expect(response.render).toHaveBeenCalledWith(TranslationKeys.APPLICATION_COMPLETE, expect.anything());
  });
});
