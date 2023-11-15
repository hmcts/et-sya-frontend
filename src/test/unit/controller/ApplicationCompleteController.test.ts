import ApplicationCompleteController from '../../../main/controllers/ApplicationCompleteController';
import { TranslationKeys } from '../../../main/definitions/constants';
import * as LaunchDarkly from '../../../main/modules/featureFlag/launchDarkly';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Application Complete Controller tests', () => {
  const mockLdClient = jest.spyOn(LaunchDarkly, 'getFlagValue');
  mockLdClient.mockResolvedValue(true);
  it('should render the Application Complete page', async () => {
    const controller = new ApplicationCompleteController();
    const response = mockResponse();
    const request = mockRequest({});

    await controller.get(request, response);

    expect(response.render).toHaveBeenCalledWith(TranslationKeys.APPLICATION_COMPLETE, expect.anything());
  });
});
