import axios from 'axios';
import redis from 'redis-mock';

import { CaseDataCacheKey, YesOrNo } from '../../../main/definitions/case';
import { CcdDataModel, RedisErrors } from '../../../main/definitions/constants';
import { TypesOfClaim } from '../../../main/definitions/definition';
import { createCase, getPreloginCaseData } from '../../../main/services/CaseService';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;
const redisClient = redis.createClient();
const guid = '7e7dfe56-b16d-43da-8bc4-5feeef9c3d68';

const cacheMap = new Map<CaseDataCacheKey, string>([
  [CaseDataCacheKey.IS_SINGLE_CASE, JSON.stringify(YesOrNo.YES)],
  [CaseDataCacheKey.TYPES_OF_CLAIM, JSON.stringify([TypesOfClaim.BREACH_OF_CONTRACT])],
]);

describe('Axios post to iniate case', () => {
  it('should make call to the api with axios with correct url and data', async () => {
    createCase('testCaseData', 'testToken', 'testurl');

    expect(mockedAxios.post).toHaveBeenCalledWith(
      'testurl/case-type/ET_EnglandWales/event-type/initiateCaseDraft/case',
      expect.objectContaining({
        case_source: CcdDataModel.CASE_SOURCE,
        case_type: 'testCaseData',
      }),
      expect.objectContaining({
        headers: { Authorization: 'Bearer testToken' },
      })
    );
  });
});

describe('Get pre-login case data from Redis', () => {
  it('should return case data if it is stored in Redis with the guid provided', async () => {
    redisClient.set(guid, JSON.stringify(Array.from(cacheMap.entries())));
    await expect(getPreloginCaseData(redisClient, guid)).resolves.toEqual(CcdDataModel.SINGLE_CASE_ENGLAND);
  });

  it('should throw error if case data does not exist in Redis with the guid provided', async () => {
    redisClient.flushdb();
    const error = new Error(RedisErrors.REDIS_ERROR);
    error.name = RedisErrors.FAILED_TO_RETREIVE;
    await expect(getPreloginCaseData(redisClient, guid)).rejects.toEqual(error);
  });
});
