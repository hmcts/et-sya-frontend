import { Application } from 'express';

import { Session } from '../../../../main/modules/session';

const mockCreateClient = jest.fn();
const mockSessionOptions = jest.fn();
const mockConfigValues: Record<string, string> = {};

const primaryHost = 'et-session-storage.redis.cache.windows.net';
const secondaryHost = 'et-managed-redis.uksouth.redis.azure.net';

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

const createFakeClient = (name: string) => ({
  name,
  on: jest.fn(),
  get: jest.fn(),
  set: jest.fn(),
});

const buildApp = () =>
  ({
    use: jest.fn(),
    set: jest.fn(),
    locals: { developmentMode: false },
  } as unknown as Application);

describe('Session', () => {
  let primaryClient: ReturnType<typeof createFakeClient>;
  let secondaryClient: ReturnType<typeof createFakeClient>;

  beforeEach(() => {
    jest.clearAllMocks();

    for (const key of Object.keys(mockConfigValues)) {
      delete mockConfigValues[key];
    }
    mockConfigValues['session.secret'] = 'current-secret';
    mockConfigValues['session.redis.host'] = '';
    mockConfigValues['session.redis.key'] = 'primary-key';
    mockConfigValues['session.redis.secondaryKey'] = 'secondary-key';

    delete process.env.REDIS_PORT;
    delete process.env.REDIS_SECONDARY_HOST;
    delete process.env.REDIS_SECONDARY_PORT;
    delete process.env.REDIS_READ_FROM;
    process.env.REDIS_HOST = primaryHost;

    primaryClient = createFakeClient('primary');
    secondaryClient = createFakeClient('secondary');
    mockCreateClient.mockReset();
    mockCreateClient.mockImplementation((options: { host: string }) =>
      options.host === secondaryHost ? secondaryClient : primaryClient
    );
  });

  afterAll(() => {
    delete process.env.REDIS_HOST;
  });

  describe('without a secondary instance', () => {
    it('connects to the primary on 6380 and does not wrap the client', () => {
      const app = buildApp();

      new Session().enableFor(app);

      expect(mockCreateClient).toHaveBeenCalledTimes(1);
      expect(mockCreateClient).toHaveBeenCalledWith(
        expect.objectContaining({
          host: primaryHost,
          port: 6380,
          tls: true,
          password: 'primary-key',
        })
      );
      expect(app.locals.redisClient).toBe(primaryClient);
    });

    it('honours REDIS_PORT when it is set', () => {
      process.env.REDIS_PORT = '10000';

      new Session().enableFor(buildApp());

      expect(mockCreateClient).toHaveBeenCalledWith(expect.objectContaining({ port: 10000 }));
    });
  });

  describe('with a secondary instance', () => {
    beforeEach(() => {
      process.env.REDIS_SECONDARY_HOST = secondaryHost;
    });

    it('connects to the secondary on 10000 by default', () => {
      new Session().enableFor(buildApp());

      expect(mockCreateClient).toHaveBeenCalledTimes(2);
      expect(mockCreateClient).toHaveBeenLastCalledWith(
        expect.objectContaining({
          host: secondaryHost,
          port: 10000,
          password: 'secondary-key',
        })
      );
    });

    it('reads from the primary and mirrors writes to the secondary', () => {
      const app = buildApp();

      new Session().enableFor(app);
      app.locals.redisClient.set('key', 'value');
      app.locals.redisClient.get('key');

      expect(primaryClient.set).toHaveBeenCalledTimes(1);
      expect(secondaryClient.set).toHaveBeenCalledTimes(1);
      expect(primaryClient.get).toHaveBeenCalledTimes(1);
      expect(secondaryClient.get).not.toHaveBeenCalled();
    });

    it('reads from the secondary once REDIS_READ_FROM is flipped, still mirroring writes', () => {
      process.env.REDIS_READ_FROM = 'secondary';
      const app = buildApp();

      new Session().enableFor(app);
      app.locals.redisClient.set('key', 'value');
      app.locals.redisClient.get('key');

      expect(secondaryClient.get).toHaveBeenCalledTimes(1);
      expect(primaryClient.get).not.toHaveBeenCalled();
      expect(secondaryClient.set).toHaveBeenCalledTimes(1);
      expect(primaryClient.set).toHaveBeenCalledTimes(1);
    });
  });

  describe('cookie signing secret', () => {
    it('signs with the single secret when no previous secret is mounted', () => {
      new Session().enableFor(buildApp());

      expect(mockSessionOptions).toHaveBeenCalledWith(expect.objectContaining({ secret: 'current-secret' }));
    });

    it('still verifies cookies signed with the previous secret', () => {
      mockConfigValues['session.previousSecret'] = 'old-secret';

      new Session().enableFor(buildApp());

      expect(mockSessionOptions).toHaveBeenCalledWith(
        expect.objectContaining({ secret: ['current-secret', 'old-secret'] })
      );
    });

    it('does not repeat the secret when it has not been rotated', () => {
      mockConfigValues['session.previousSecret'] = 'current-secret';

      new Session().enableFor(buildApp());

      expect(mockSessionOptions).toHaveBeenCalledWith(expect.objectContaining({ secret: 'current-secret' }));
    });
  });
});
