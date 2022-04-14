import axios from 'axios';
import config from 'config';
import redis from 'redis-mock';

import { CaseDataCacheKey, YesOrNo } from '../../../main/definitions/case';
import { CcdDataModel, RedisErrors } from '../../../main/definitions/constants';
import { CaseState, TypesOfClaim } from '../../../main/definitions/definition';
import { CaseApi, formatCaseData, getCaseApi, getPreloginCaseData } from '../../../main/services/CaseService';

jest.mock('config');
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;
const redisClient = redis.createClient();
const guid = '7e7dfe56-b16d-43da-8bc4-5feeef9c3d68';
const token = 'testToken';

const cacheMap = new Map<CaseDataCacheKey, string>([
  [CaseDataCacheKey.IS_SINGLE_CASE, JSON.stringify(YesOrNo.YES)],
  [CaseDataCacheKey.TYPES_OF_CLAIM, JSON.stringify([TypesOfClaim.BREACH_OF_CONTRACT])],
]);

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

describe('Format Case Data', () => {
  it('should format single claim type`', () => {
    const mockedApiData = {
      id: '1234',
      state: CaseState.DRAFT,
    };
    const result = formatCaseData(mockedApiData);
    expect(result).toStrictEqual({
      id: '1234',
      state: CaseState.DRAFT,
    });
  });

  it('should format multiple claim type`', () => {
    const mockedApiData = {
      id: '1234',
      state: CaseState.DRAFT,
    };
    const result = formatCaseData(mockedApiData);
    expect(result).toStrictEqual({
      id: '1234',
      state: CaseState.DRAFT,
    });
  });
});

const api = new CaseApi(mockedAxios);

describe('Axios post to iniate case', () => {
  it('should send post request to the correct api endpoint with the case type passed', async () => {
    api.createCase('testCaseType');

    expect(mockedAxios.post).toHaveBeenCalledWith(
      '/case-type/ET_EnglandWales/event-type/initiateCaseDraft/case',
      expect.objectContaining({
        case_source: CcdDataModel.CASE_SOURCE,
        case_type: 'testCaseType',
      })
    );
  });
});

describe('Axios get to retreive draft cases', () => {
  it('should send get request to the correct api endpoint and return an array of draft cases', async () => {
    api.getDraftCases();

    expect(mockedAxios.get).toHaveBeenCalledWith(
      '/caseTypes/ET_EnglandWales/cases',
      expect.objectContaining({
        data: {
          match: { state: 'Draft' },
        },
      })
    );
  });
});

describe('getCaseApi', () => {
  beforeAll(() => {
    config.get('services.etSyaApi.host');
    return 'http://randomurl';
  });
  test('should create a CaseApi', () => {
    expect(getCaseApi(token)).toBeInstanceOf(CaseApi);
  });
});
