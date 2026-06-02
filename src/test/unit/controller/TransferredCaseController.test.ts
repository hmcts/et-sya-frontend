import TransferredCaseController from '../../../main/controllers/TransferredCaseController';
import { TranslationKeys } from '../../../main/definitions/constants';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Transferred Case Controller tests', () => {
  it('should render the transferred case page', () => {
    const controller = new TransferredCaseController();
    const response = mockResponse();
    const request = mockRequest({});

    controller.get(request, response);

    expect(response.render).toHaveBeenCalledWith(TranslationKeys.TRANSFERRED_CASE, expect.anything());
  });
});
