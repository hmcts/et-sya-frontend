import StoredToSubmitCompleteController from '../../../main/controllers/StoredToSubmitCompleteController';
import { TranslationKeys } from '../../../main/definitions/constants';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Submit stored application Complete Controller tests', () => {
  it('should render the Submit stored application Complete page', () => {
    const controller = new StoredToSubmitCompleteController();
    const response = mockResponse();
    const request = mockRequest({});

    controller.get(request, response);

    expect(response.render).toHaveBeenCalledWith(TranslationKeys.APPLICATION_COMPLETE, expect.anything());
  });
});
