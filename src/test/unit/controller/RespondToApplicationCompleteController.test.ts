import RespondToApplicationCompleteController from '../../../main/controllers/RespondToApplicationCompleteController';
import { TranslationKeys } from '../../../main/definitions/constants';
import * as LaunchDarkly from '../../../main/modules/featureFlag/launchDarkly';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Respond to Application Complete Controller tests', () => {
  const mockLdClient = jest.spyOn(LaunchDarkly, 'getFlagValue');
  mockLdClient.mockResolvedValue(true);
  it('should render the Response Complete page', async () => {
    const controller = new RespondToApplicationCompleteController();
    const response = mockResponse();
    const request = mockRequest({});

    await controller.get(request, response);

    expect(response.render).toHaveBeenCalledWith(TranslationKeys.RESPOND_TO_APPLICATION_COMPLETE, expect.anything());
  });
});
