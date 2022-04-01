import { randomUUID } from 'crypto';

import { RedisClient } from 'redis';

import { TypesOfClaim } from '../definitions/definition';

export const cacheTypesOfClaim = (redisClient: RedisClient, typeOfClaim: TypesOfClaim[]): string => {
  const guid = randomUUID();
  redisClient.set(guid, JSON.stringify(typeOfClaim));
  return guid;
};
