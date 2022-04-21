import axios from 'axios';
import config from 'config';
import redis from 'redis-mock';

import { UserDetails } from '../../../main/definitions/appRequest';
import { CaseDataCacheKey, CaseType, YesOrNo } from '../../../main/definitions/case';
import { CcdDataModel, JavaApiUrls, RedisErrors } from '../../../main/definitions/constants';
import { CaseState, TypesOfClaim } from '../../../main/definitions/definition';
import { CaseApi, getCaseApi, getPreloginCaseData } from '../../../main/services/CaseService';

jest.mock('config');
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;
const redisClient = redis.createClient();
const guid = '7e7dfe56-b16d-43da-8bc4-5feeef9c3d68';
const token = 'testToken';

const cacheMap = new Map<CaseDataCacheKey, string>([
  [CaseDataCacheKey.CLAIMANT_REPRESENTED, JSON.stringify(YesOrNo.YES)],
  [CaseDataCacheKey.CASE_TYPE, JSON.stringify(CaseType.SINGLE)],
  [CaseDataCacheKey.TYPES_OF_CLAIM, JSON.stringify([TypesOfClaim.BREACH_OF_CONTRACT])],
]);

describe('Get pre-login case data from Redis', () => {
  it('should return case data if it is stored in Redis with the guid provided', async () => {
    redisClient.set(guid, JSON.stringify(Array.from(cacheMap.entries())));
    const caseData = await getPreloginCaseData(redisClient, guid);
    const userDataMap: Map<CaseDataCacheKey, string> = new Map(JSON.parse(caseData));

    expect(userDataMap.get(CaseDataCacheKey.CASE_TYPE)).toEqual('"Single"');
  });

  it('should throw error if case data does not exist in Redis with the guid provided', async () => {
    redisClient.flushdb();
    const error = new Error(RedisErrors.REDIS_ERROR);
    error.name = RedisErrors.FAILED_TO_RETREIVE;
    await expect(getPreloginCaseData(redisClient, guid)).rejects.toEqual(error);
  });
});

const api = new CaseApi(mockedAxios);

describe('Axios post to iniate case', () => {
  it('should send post request to the correct api endpoint with the case type passed', async () => {
    const mockUserDetails: UserDetails = {
      id: '1234',
      givenName: 'Bobby',
      familyName: 'Ryan',
      email: 'bobby@gmail.com',
      accessToken: 'xxxx',
    };
    const caseData =
      '[["claimantRepresentedQuestion","Yes"],["caseType","Single"], ["typesOfClaim", "[\\"discrimination\\"]"]]';
    api.createCase(caseData, mockUserDetails);

    expect(mockedAxios.post).toHaveBeenCalledWith(
      JavaApiUrls.INITIATE_CASE_DRAFT,
      expect.objectContaining({
        caseSource: CcdDataModel.CASE_SOURCE,
        caseType: 'Single',
        claimantRespresentedQuestion: 'Yes',
        claimantIndType: {
          claimant_first_names: 'Bobby',
          claimant_last_name: 'Ryan',
        },
        claimantType: {
          claimant_email_address: 'bobby@gmail.com',
        },
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
          match: { state: CaseState.AWAITING_SUBMISSION_TO_HMCTS },
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
