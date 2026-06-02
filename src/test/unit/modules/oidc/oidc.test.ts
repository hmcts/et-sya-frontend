import config from 'config';
import { Application, Response } from 'express';

import { AppRequest } from '../../../../main/definitions/appRequest';
import { AuthUrls, HTTPS_PROTOCOL, PageUrls } from '../../../../main/definitions/constants';
import { Oidc } from '../../../../main/modules/oidc';

const mockLoggerError = jest.fn();
jest.mock('@hmcts/nodejs-logging', () => {
  const mockError = jest.fn();
  return {
    __mockError: mockError,
    Logger: {
      getLogger: () => ({
        error: mockError,
        info: jest.fn(),
        warn: jest.fn(),
      }),
    },
  };
});

const { __mockError: mockLoggerErrorRef } = jest.requireMock('@hmcts/nodejs-logging') as {
  __mockError: jest.Mock;
};

const idamSignOutUrl: string = process.env.IDAM_END_SESSION_URL ?? config.get('services.idam.endSessionURL');

describe('Oidc logout handler', () => {
  let logoutHandler: (req: AppRequest, res: Response) => void;
  const mockHost = 'localhost:3002';

  beforeAll(() => {
    const handlers = new Map<string, (req: AppRequest, res: Response) => void>();
    const mockApp = {
      locals: { developmentMode: false },
      get: (path: string, handler: (req: AppRequest, res: Response) => void) => handlers.set(path, handler),
      use: jest.fn(),
    } as unknown as Application;

    new Oidc().enableFor(mockApp);
    logoutHandler = handlers.get(AuthUrls.LOGOUT);
  });

  let mockRes: Partial<Response>;

  beforeEach(() => {
    mockLoggerErrorRef.mockClear();
    mockLoggerError.mockClear();
    mockRes = {
      redirect: jest.fn(),
      locals: { host: mockHost },
    } as unknown as Partial<Response>;
  });

  test('destroys the session on logout', () => {
    const mockDestroy = jest.fn(cb => cb(null));
    const mockReq = {
      session: { user: { accessToken: 'testToken' }, destroy: mockDestroy },
    } as unknown as AppRequest;

    logoutHandler(mockReq, mockRes as Response);

    expect(mockDestroy).toHaveBeenCalledTimes(1);
  });

  test('redirects to IDAM end session URL with id_token_hint and post_logout_redirect_uri', () => {
    const accessToken = 'testAccessToken';
    const mockReq = {
      session: {
        user: { accessToken },
        destroy: jest.fn(cb => cb(null)),
      },
    } as unknown as AppRequest;

    logoutHandler(mockReq, mockRes as Response);

    const expectedParams = new URLSearchParams({
      id_token_hint: accessToken,
      post_logout_redirect_uri: `${HTTPS_PROTOCOL}${mockHost}`,
    });
    expect(mockRes.redirect).toHaveBeenCalledWith(`${idamSignOutUrl}?${expectedParams.toString()}`);
  });

  test('does not redirect to home page on logout', () => {
    const mockReq = {
      session: {
        user: { accessToken: 'testToken' },
        destroy: jest.fn(cb => cb(null)),
      },
    } as unknown as AppRequest;

    logoutHandler(mockReq, mockRes as Response);

    expect(mockRes.redirect).not.toHaveBeenCalledWith(PageUrls.HOME);
  });

  test('still redirects to IDAM end session URL when session destroy errors', () => {
    const accessToken = 'testAccessToken';
    const mockReq = {
      session: {
        user: { accessToken },
        destroy: jest.fn(cb => cb(new Error('session destroy error'))),
      },
    } as unknown as AppRequest;

    logoutHandler(mockReq, mockRes as Response);

    expect(mockRes.redirect).toHaveBeenCalled();
    const redirectUrl = (mockRes.redirect as jest.Mock).mock.calls[0][0] as string;
    expect(redirectUrl.startsWith(idamSignOutUrl)).toBe(true);
  });

  test('logs an error when session destroy fails', () => {
    const mockReq = {
      session: {
        user: { accessToken: 'testToken' },
        destroy: jest.fn(cb => cb(new Error('session destroy error'))),
      },
    } as unknown as AppRequest;

    logoutHandler(mockReq, mockRes as Response);

    expect(mockLoggerErrorRef).toHaveBeenCalledWith('Error destroying session');
  });

  test('does not log an error when session destroy succeeds', () => {
    const mockReq = {
      session: {
        user: { accessToken: 'testToken' },
        destroy: jest.fn(cb => cb(null)),
      },
    } as unknown as AppRequest;

    logoutHandler(mockReq, mockRes as Response);

    expect(mockLoggerErrorRef).not.toHaveBeenCalled();
  });

  test('still redirects to IDAM end session URL when no user is in the session', () => {
    const mockReq = {
      session: {
        user: undefined,
        destroy: jest.fn(cb => cb(null)),
      },
    } as unknown as AppRequest;

    logoutHandler(mockReq, mockRes as Response);

    expect(mockRes.redirect).toHaveBeenCalled();
    const redirectUrl = (mockRes.redirect as jest.Mock).mock.calls[0][0] as string;
    expect(redirectUrl).toContain(idamSignOutUrl);
    expect(redirectUrl).toContain(`post_logout_redirect_uri=${encodeURIComponent(`${HTTPS_PROTOCOL}${mockHost}`)}`);
  });
});
