import SessionTimeoutController from '../../../main/controllers/SessionTimeoutController';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Session Controller', () => {
  it('getExtendSession should res.send a timeout value', () => {
    const controller = new SessionTimeoutController();
    const req = mockRequest({});
    const res = mockResponse();
    controller.getExtendSession(req, res);
    expect(res.send).toBeCalledWith({ timeout: expect.any(Object) });
  });
});
