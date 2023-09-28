import YourAppsToTheTribunalController from '../../../main/controllers/YourAppsToTheTribunalController';
import * as LaunchDarkly from '../../../main/modules/featureFlag/launchDarkly';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Apps To The Tribunal Controller', () => {
  const t = {
    common: {},
  };
  const mockClient = jest.spyOn(LaunchDarkly, 'getFlagValue');
  mockClient.mockResolvedValue(true);
  it('should render the applications page', () => {
    const controller = new YourAppsToTheTribunalController();
    const response = mockResponse();
    const request = mockRequest({ t });
    controller.get(request, response);
    expect(response.render).toHaveBeenCalledWith('your-applications', expect.anything());
  });
});
