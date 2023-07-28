import Rule92HoldingPageController from '../../../main/controllers/Rule92HoldingPageController';
import { TranslationKeys } from '../../../main/definitions/constants';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Rule92 Holding Page Controller tests', () => {
  it('should render the Rule92 Holding page', () => {
    const controller = new Rule92HoldingPageController();
    const response = mockResponse();
    const request = mockRequest({});

    controller.get(request, response);

    expect(response.render).toHaveBeenCalledWith(TranslationKeys.RULE92_HOLDING_PAGE, expect.anything());
  });
});
