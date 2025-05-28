import { AppRequest } from '../../../main/definitions/appRequest';
import { CaseDataCacheKey } from '../../../main/definitions/case';
import { RedisErrors } from '../../../main/definitions/constants';
import { cachePreloginCaseData } from '../../../main/services/CacheService';
import { RedisUtils } from '../../../main/utils/RedisUtils';

jest.mock('../../../main/services/CacheService');

describe('RedisUtils', () => {
  let mockRedisClient: any;
  let mockReq: AppRequest;

  beforeEach(() => {
    mockRedisClient = {
      set: jest.fn(),
    };

    mockReq = {
      app: {
        locals: {
          redisClient: mockRedisClient,
        },
      },
      session: {
        userCase: {
          claimJurisdiction: 'Employment',
          claimantRepresentedQuestion: 'Yes',
          caseType: 'Single',
          typeOfClaim: ['Unfair Dismissal'],
          otherClaim: 'Other details',
          acasMultiple: 'Yes',
          validNoAcasReason: 'Reason',
        },
      },
    } as unknown as AppRequest;

    jest.clearAllMocks();
  });

  it('should cache user case data successfully', async () => {
    (cachePreloginCaseData as jest.Mock).mockReturnValue('mock-guid');

    await RedisUtils.cacheUserCaseData(mockReq);

    expect(cachePreloginCaseData).toHaveBeenCalledWith(
      mockRedisClient,
      new Map<CaseDataCacheKey, string>([
        [CaseDataCacheKey.CLAIM_JURISDICTION, 'Employment'],
        [CaseDataCacheKey.CLAIMANT_REPRESENTED, 'Yes'],
        [CaseDataCacheKey.CASE_TYPE, 'Single'],
        [CaseDataCacheKey.TYPES_OF_CLAIM, JSON.stringify(['Unfair Dismissal'])],
        [CaseDataCacheKey.OTHER_CLAIM_TYPE, 'Other details'],
        [CaseDataCacheKey.ACAS_MULTIPLE, 'Yes'],
        [CaseDataCacheKey.VALID_NO_ACAS_REASON, 'Reason'],
      ])
    );
    expect(mockReq.session.guid).toBe('mock-guid');
  });

  it('should throw an error if redisClient is not found', async () => {
    mockReq.app.locals.redisClient = null;

    await expect(RedisUtils.cacheUserCaseData(mockReq)).rejects.toThrow(RedisErrors.CLIENT_NOT_FOUND);
  });

  it('should throw an error if cachePreloginCaseData fails', async () => {
    (cachePreloginCaseData as jest.Mock).mockImplementation(() => {
      throw new Error('Redis error');
    });

    await expect(RedisUtils.cacheUserCaseData(mockReq)).rejects.toThrow('Redis error');
  });
});
