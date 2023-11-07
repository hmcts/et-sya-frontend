import TribunalResponseCompletedController from '../../../main/controllers/TribunalResponseCompletedController';
import { TranslationKeys } from '../../../main/definitions/constants';
import * as LaunchDarkly from '../../../main/modules/featureFlag/launchDarkly';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Tribunal Response Completed Controller tests', () => {
  const mockLdClient = jest.spyOn(LaunchDarkly, 'getFlagValue');
  mockLdClient.mockResolvedValue(true);
  it('should render the Response Complete page', async () => {
    const controller = new TribunalResponseCompletedController();
    const response = mockResponse();
    const request = mockRequest({});

    await controller.get(request, response);

    expect(response.render).toHaveBeenCalledWith(TranslationKeys.TRIBUNAL_RESPONSE_COMPLETED, expect.anything());
  });
});
