import { randomUUID } from 'crypto';

import { RedisClient } from 'redis';

import { RedisErrors } from '../definitions/constants';
import { TypesOfClaim } from '../definitions/definition';

export const cacheTypesOfClaim = (redisClient: RedisClient, typeOfClaim: TypesOfClaim[]): string => {
  const guid = randomUUID();
  redisClient.set(guid, JSON.stringify(typeOfClaim), err => {
    if (err) {
      const error = new Error(err.message);
      error.name = RedisErrors.FAILED_TO_SAVE;
      if (err.stack) {
        error.stack = err.stack;
      }
      throw error;
    }
  });

  return guid;
};
