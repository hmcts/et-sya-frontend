import AllDocumentsController from '../../../main/controllers/AllDocumentsController';
import { TranslationKeys } from '../../../main/definitions/constants';
import * as LaunchDarkly from '../../../main/modules/featureFlag/launchDarkly';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('AllDocumentsController', () => {
  it('should render the All documents page', async () => {
    const mockLdClient = jest.spyOn(LaunchDarkly, 'getFlagValue');
    mockLdClient.mockResolvedValue(true);
    const controller = new AllDocumentsController();
    const response = mockResponse();
    const request = mockRequest({});
    await controller.get(request, response);

    expect(response.render).toHaveBeenCalledWith(TranslationKeys.ALL_DOCUMENTS, expect.anything());
  });
});
