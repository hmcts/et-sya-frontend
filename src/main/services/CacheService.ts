import { randomUUID } from 'crypto';

import { RedisClient } from 'redis';

import { CaseDataCacheKey } from '../definitions/case';
import { RedisErrors } from '../definitions/constants';

export const cachePreloginCaseData = (redisClient: RedisClient, cacheMap: Map<CaseDataCacheKey, string>): string => {
  const guid = randomUUID();
  redisClient.set(guid, JSON.stringify(Array.from(cacheMap.entries())));
  return guid;
};

export const getPreloginCaseData = (redisClient: RedisClient, guid: string): Promise<string> => {
  return new Promise<string>((resolve, reject) => {
    redisClient.get(guid, (err: Error, userData: string) => {
      if (err || !userData) {
        const error = new Error(err ? err.message : RedisErrors.REDIS_ERROR);
        error.name = RedisErrors.FAILED_TO_RETREIVE;
        if (err?.stack) {
          error.stack = err.stack;
        }
        reject(error);
      }
      resolve(userData);
    });
  });
};
