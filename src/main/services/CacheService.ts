import { randomUUID } from 'crypto';

import { CaseDataCacheKey } from '../definitions/case';
import { RedisErrors } from '../definitions/constants';

type RedisClient = any;
type RedisError = any;

export const cachePreloginCaseData = (redisClient: RedisClient, cacheMap: Map<CaseDataCacheKey, string>): string => {
  const guid = randomUUID();
  redisClient.set(guid, JSON.stringify([...cacheMap.entries()]));
  return guid;
};

export const getPreloginCaseData = (redisClient: RedisClient, guid: string): Promise<string> => {
  return new Promise<string>((resolve, reject) => {
    redisClient.get(guid, (err: RedisError, userData: string) => {
      if (err || !userData) {
        const error = new Error(err ? err.message : RedisErrors.REDIS_ERROR);
        error.name = RedisErrors.FAILED_TO_RETRIEVE;
        if (err?.stack) {
          error.stack = err.stack;
        }
        reject(error);
      }
      resolve(userData);
    });
  });
};
