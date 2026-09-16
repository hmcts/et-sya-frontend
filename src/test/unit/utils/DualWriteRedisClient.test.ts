import { RedisClient } from 'redis';

import { createDualWriteRedisClient } from '../../../main/utils/DualWriteRedisClient';

jest.mock('../../../main/logger', () => {
  const mockError = jest.fn();
  return {
    __mockError: mockError,
    getLogger: () => ({
      error: mockError,
      info: jest.fn(),
      warn: jest.fn(),
    }),
  };
});

const { __mockError: mockLoggerError } = jest.requireMock('../../../main/logger') as {
  __mockError: jest.Mock;
};

const createFakeClient = () => ({
  on: jest.fn(),
  get: jest.fn(),
  set: jest.fn(),
  setex: jest.fn(),
  expire: jest.fn(),
  del: jest.fn(),
  ping: jest.fn().mockReturnValue(true),
});

describe('DualWriteRedisClient', () => {
  let readClient: ReturnType<typeof createFakeClient>;
  let mirrorClient: ReturnType<typeof createFakeClient>;
  let client: RedisClient;

  beforeEach(() => {
    jest.clearAllMocks();
    readClient = createFakeClient();
    mirrorClient = createFakeClient();
    client = createDualWriteRedisClient(readClient as unknown as RedisClient, mirrorClient as unknown as RedisClient);
  });

  it('serves reads from the read client only', () => {
    client.get('session-key', jest.fn());

    expect(readClient.get).toHaveBeenCalledTimes(1);
    expect(mirrorClient.get).not.toHaveBeenCalled();
  });

  it.each(['set', 'setex', 'expire', 'del'])('mirrors %s to both instances', command => {
    (client as unknown as Record<string, (...args: unknown[]) => void>)[command]('key', 'value');

    expect(readClient[command as keyof typeof readClient]).toHaveBeenCalledTimes(1);
    expect(mirrorClient[command as keyof typeof mirrorClient]).toHaveBeenCalledTimes(1);
  });

  it('keeps the session TTL arguments on the mirrored write', () => {
    client.set('session-key', 'value', 'EX', 3600);

    expect(mirrorClient.set).toHaveBeenCalledWith('session-key', 'value', 'EX', 3600, expect.any(Function));
  });

  it('does not pass the caller callback to the mirror', () => {
    const callback = jest.fn();
    client.set('session-key', 'value', callback);

    expect(readClient.set).toHaveBeenCalledWith('session-key', 'value', callback);
    expect(mirrorClient.set).toHaveBeenCalledWith('session-key', 'value', expect.any(Function));
  });

  it('logs and swallows a failed mirror write', () => {
    mirrorClient.set.mockImplementation((...args: unknown[]) => {
      const callback = args[args.length - 1] as (err: Error) => void;
      callback(new Error('mirror unavailable'));
    });

    expect(() => client.set('session-key', 'value')).not.toThrow();
    expect(readClient.set).toHaveBeenCalledTimes(1);
    expect(mockLoggerError).toHaveBeenCalledWith('Failed to mirror Redis set', expect.any(Error));
  });

  it('logs and swallows a mirror client that throws synchronously', () => {
    mirrorClient.set.mockImplementation(() => {
      throw new Error('client destroyed');
    });

    expect(() => client.set('session-key', 'value')).not.toThrow();
    expect(readClient.set).toHaveBeenCalledTimes(1);
    expect(mockLoggerError).toHaveBeenCalledWith('Failed to mirror Redis set', expect.any(Error));
  });

  it('logs mirror client error events without affecting requests', () => {
    expect(mirrorClient.on).toHaveBeenCalledWith('error', expect.any(Function));

    const errorHandler = mirrorClient.on.mock.calls[0][1] as (err: Error) => void;
    errorHandler(new Error('connection lost'));

    expect(mockLoggerError).toHaveBeenCalledWith('Mirror Redis client error', expect.any(Error));
  });

  it('forwards commands that are not writes to the read client', () => {
    expect(client.ping()).toBe(true);
    expect(readClient.ping).toHaveBeenCalledTimes(1);
    expect(mirrorClient.ping).not.toHaveBeenCalled();
  });
});
