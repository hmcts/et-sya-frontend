import { randomUUID } from 'crypto';

import { RedisClient } from 'redis';

export const cacheTypesOfClaim = (redisClient: RedisClient, cacheMap: Map<string, string>): string => {
  const guid = randomUUID();
  redisClient.set(guid, JSON.stringify(Array.from(cacheMap.entries())));
  return guid;
};
