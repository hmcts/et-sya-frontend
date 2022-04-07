import { randomUUID } from 'crypto';

import { RedisClient } from 'redis';

import { CaseDataCacheKey } from '../definitions/case';

export const cachePreloginCaseData = (redisClient: RedisClient, cacheMap: Map<CaseDataCacheKey, string>): string => {
  const guid = randomUUID();
  redisClient.set(guid, JSON.stringify(Array.from(cacheMap.entries())));
  return guid;
};
