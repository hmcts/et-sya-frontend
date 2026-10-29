import { Application } from 'express';

import { Session } from '../../../../main/modules/session';

const mockCreateClient = jest.fn();
const mockSessionOptions = jest.fn();
const mockConfigValues: Record<string, string> = {};

const redisHost = 'et-managed-redis.uksouth.redis.azure.net';

jest.mock('redis', () => ({
  createClient: (options: Record<string, unknown>) => mockCreateClient(options),
}));

jest.mock('connect-redis', () =>
  jest.fn(() => {
    return class MockRedisStore {
      public client: unknown;
      constructor(options: { client: unknown }) {
        this.client = options.client;
      }
    };
  })
);

jest.mock('express-session', () => {
  const sessionMiddleware = (options: Record<string, unknown>) => {
    mockSessionOptions(options);
    return jest.fn();
  };
  sessionMiddleware.Store = class MockStore {};
  return sessionMiddleware;
});

jest.mock('config', () => ({
  get: (key: string) => mockConfigValues[key],
  has: (key: string) => mockConfigValues[key] !== undefined,
}));

const buildApp = () =>
  ({
    use: jest.fn(),
    set: jest.fn(),
    locals: { developmentMode: false },
  } as unknown as Application);

describe('Session', () => {
  const redisClient = { on: jest.fn() };

  beforeEach(() => {
    jest.clearAllMocks();

    for (const key of Object.keys(mockConfigValues)) {
      delete mockConfigValues[key];
    }
    mockConfigValues['session.secret'] = 'current-secret';
    mockConfigValues['session.redis.host'] = '';
    mockConfigValues['session.redis.key'] = 'redis-key';

    delete process.env.REDIS_PORT;
    process.env.REDIS_HOST = redisHost;

    mockCreateClient.mockReset();
    mockCreateClient.mockReturnValue(redisClient);
  });

  afterAll(() => {
    delete process.env.REDIS_HOST;
  });

  it('connects to Redis on 10000 over TLS by default', () => {
    const app = buildApp();

    new Session().enableFor(app);

    expect(mockCreateClient).toHaveBeenCalledTimes(1);
    expect(mockCreateClient).toHaveBeenCalledWith(
      expect.objectContaining({
        host: redisHost,
        port: 10000,
        tls: true,
        password: 'redis-key',
      })
    );
    expect(app.locals.redisClient).toBe(redisClient);
  });

  it('honours REDIS_PORT when it is set', () => {
    process.env.REDIS_PORT = '6380';

    new Session().enableFor(buildApp());

    expect(mockCreateClient).toHaveBeenCalledWith(expect.objectContaining({ port: 6380 }));
  });

  it.each(['', '   ', 'not-a-port', '0', '70000'])('falls back to 10000 when REDIS_PORT is %p', value => {
    process.env.REDIS_PORT = value;

    new Session().enableFor(buildApp());

    expect(mockCreateClient).toHaveBeenCalledWith(expect.objectContaining({ port: 10000 }));
  });

  it('signs cookies with the session secret', () => {
    new Session().enableFor(buildApp());

    expect(mockSessionOptions).toHaveBeenCalledWith(expect.objectContaining({ secret: 'current-secret' }));
  });
});
