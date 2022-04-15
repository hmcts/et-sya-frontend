import { randomUUID } from 'crypto';

import redis from 'redis-mock';

import { CaseDataCacheKey, CaseType } from '../../../main/definitions/case';
import { TypesOfClaim } from '../../../main/definitions/definition';
import { cachePreloginCaseData } from '../../../main/services/CacheService';

const redisClient = redis.createClient();
const uuid = 'f0d62bc6-5c7b-4ac1-98d2-c745a2df79b8';
const cacheMap = new Map<CaseDataCacheKey, string>([
  [CaseDataCacheKey.CASE_TYPE, JSON.stringify(CaseType.SINGLE)],
  [CaseDataCacheKey.TYPES_OF_CLAIM, JSON.stringify([TypesOfClaim.BREACH_OF_CONTRACT])],
]);

jest.mock('crypto');
const mockedRandomUUID = randomUUID as jest.Mock<string>;

describe('Cache Types of Claim to Redis', () => {
  it('should generate an uuid and store it in Redis', () => {
    mockedRandomUUID.mockImplementation(() => uuid);
    jest.spyOn(redisClient, 'set');

    cachePreloginCaseData(redisClient, cacheMap);
    expect(redisClient.set).toHaveBeenCalledWith(uuid, JSON.stringify(Array.from(cacheMap.entries())));
  });

  it('should return an uuid', () => {
    mockedRandomUUID.mockImplementation(() => uuid);
    jest.spyOn(redisClient, 'set');
    jest.spyOn(redisClient, 'set');

    expect(cachePreloginCaseData(redisClient, cacheMap)).toBe(uuid);
  });
});
