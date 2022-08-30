import { randomUUID } from 'crypto';

import redis from 'redis-mock';

import { CaseDataCacheKey, CaseType, YesOrNo } from '../../../main/definitions/case';
import { RedisErrors } from '../../../main/definitions/constants';
import { TypesOfClaim } from '../../../main/definitions/definition';
import { cachePreloginCaseData, getPreloginCaseData } from '../../../main/services/CacheService';

const redisClient = redis.createClient();
const uuid = 'f0d62bc6-5c7b-4ac1-98d2-c745a2df79b8';
const cacheMap = new Map<CaseDataCacheKey, string>([
  [CaseDataCacheKey.CLAIMANT_REPRESENTED, YesOrNo.YES],
  [CaseDataCacheKey.CASE_TYPE, CaseType.SINGLE],
  [CaseDataCacheKey.TYPES_OF_CLAIM, JSON.stringify([TypesOfClaim.BREACH_OF_CONTRACT])],
]);

const guid = '7e7dfe56-b16d-43da-8bc4-5feeef9c3d68';

jest.mock('crypto');
const mockedRandomUUID = randomUUID as jest.Mock<string>;

describe('Get pre-login case data from Redis', () => {
  it('should return case data if it is stored in Redis with the guid provided', async () => {
    redisClient.set(guid, JSON.stringify(Array.from(cacheMap.entries())));
    const caseData = await getPreloginCaseData(redisClient, guid);
    const userDataMap: Map<CaseDataCacheKey, string> = new Map(JSON.parse(caseData));

    expect(userDataMap.get(CaseDataCacheKey.CASE_TYPE)).toEqual('Single');
    expect(userDataMap.get(CaseDataCacheKey.CLAIMANT_REPRESENTED)).toEqual('Yes');
  });

  it('should throw error if case data does not exist in Redis with the guid provided', async () => {
    redisClient.flushdb();
    const error = new Error(RedisErrors.REDIS_ERROR);
    error.name = RedisErrors.FAILED_TO_RETRIEVE;
    await expect(getPreloginCaseData(redisClient, guid)).rejects.toEqual(error);
  });
});

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
