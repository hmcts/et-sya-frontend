import SessionTimeoutController from '../../../main/controllers/SessionTimeoutController';
import * as LaunchDarkly from '../../../main/modules/featureFlag/launchDarkly';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Session Controller', () => {
  it('getExtendSession should res.send a timeout value', async () => {
    jest.spyOn(LaunchDarkly, 'getFlagValue').mockResolvedValue(3600000);
    const controller = new SessionTimeoutController();
    const req = mockRequest({});
    const res = mockResponse();
    await controller.getExtendSession(req, res);
    expect(res.send).toHaveBeenCalledWith({ timeout: expect.any(Object) });
  });
});
