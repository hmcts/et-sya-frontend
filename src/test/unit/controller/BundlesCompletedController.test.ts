import BundlesCompletedController from '../../../main/controllers/BundlesCompletedController';
import { TranslationKeys } from '../../../main/definitions/constants';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Bundles Complete Controller tests', () => {
  it('should render the Bundles Completed page', () => {
    const controller = new BundlesCompletedController();
    const response = mockResponse();
    const request = mockRequest({});

    controller.get(request, response);

    expect(response.render).toHaveBeenCalledWith(TranslationKeys.BUNDLES_COMPLETED, expect.anything());
  });
});
