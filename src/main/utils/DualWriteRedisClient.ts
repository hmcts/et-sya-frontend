import { RedisClient } from 'redis';

import { getLogger } from '../logger';

const logger = getLogger('DualWriteRedisClient');

// Commands that change state and so have to reach both instances while the
// migration is in flight. connect-redis uses set/expire/del, CacheService uses set.
const MIRRORED_COMMANDS: ReadonlySet<string> = new Set(['set', 'setex', 'expire', 'del']);

type RedisCommand = (...args: unknown[]) => unknown;

/**
 * Wraps the Redis client that serves reads so that every write also reaches a
 * second instance.
 *
 * Used during the move from Azure Cache for Redis to Azure Managed Redis: writes
 * go to both, reads come from whichever instance is currently authoritative. A
 * failed mirror write is logged and never surfaced to the request, because the
 * instance serving reads remains the source of truth until the cutover.
 */
export const createDualWriteRedisClient = (readClient: RedisClient, mirrorClient: RedisClient): RedisClient => {
  mirrorClient.on('error', (err: Error) => logger.error('Mirror Redis client error', err));

  const mirror = (command: string, args: unknown[]): void => {
    // Drop the caller's callback so the mirror write can never complete the request.
    const mirrorArgs = typeof args[args.length - 1] === 'function' ? args.slice(0, -1) : args;

    try {
      const mirrorCommand = (mirrorClient as unknown as Record<string, RedisCommand>)[command];
      mirrorCommand.call(mirrorClient, ...mirrorArgs, (err: Error | null) => {
        if (err) {
          logger.error(`Failed to mirror Redis ${command}`, err);
        }
      });
    } catch (err) {
      logger.error(`Failed to mirror Redis ${command}`, err);
    }
  };

  return new Proxy(readClient, {
    get(target: RedisClient, property: string | symbol, receiver: unknown) {
      const value = Reflect.get(target, property, receiver);

      if (typeof value !== 'function') {
        return value;
      }

      const command = value as RedisCommand;

      if (typeof property !== 'string' || !MIRRORED_COMMANDS.has(property)) {
        return command.bind(target);
      }

      return (...args: unknown[]) => {
        mirror(property, args);
        return command.apply(target, args);
      };
    },
  });
};
