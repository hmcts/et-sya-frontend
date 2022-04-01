import { randomUUID } from 'crypto';

import redis from 'redis-mock';

import { TypesOfClaim } from '../../../main/definitions/definition';
import { cacheTypesOfClaim } from '../../../main/services/CacheService';

const redisClient = redis.createClient();
const typesOfClaim = [TypesOfClaim.BREACH_OF_CONTRACT];
const uuid = 'f0d62bc6-5c7b-4ac1-98d2-c745a2df79b8';

jest.mock('crypto');
const mockedRandomUUID = randomUUID as jest.Mock<string>;

describe('Cache Types of Claim to Redis', () => {
  it('should generate an uuid and store it in Redis', () => {
    mockedRandomUUID.mockImplementation(() => uuid);
    jest.spyOn(redisClient, 'set');

    cacheTypesOfClaim(redisClient, typesOfClaim);
    expect(redisClient.set).toHaveBeenCalledWith(uuid, JSON.stringify(typesOfClaim));
  });

  it('should return an uuid', () => {
    mockedRandomUUID.mockImplementation(() => uuid);
    jest.spyOn(redisClient, 'set');
    jest.spyOn(redisClient, 'set');

    expect(cacheTypesOfClaim(redisClient, typesOfClaim)).toBe(uuid);
  });
});
