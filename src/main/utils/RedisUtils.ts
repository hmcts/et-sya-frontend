import { AppRequest } from '../definitions/appRequest';
import { CaseDataCacheKey } from '../definitions/case';
import { RedisErrors } from '../definitions/constants';
import { cachePreloginCaseData } from '../services/CacheService';

export class RedisUtils {
  public static async cacheUserCaseData(req: AppRequest): Promise<void> {
    if (req.app?.locals) {
      const redisClient = req.app.locals?.redisClient;
      if (redisClient) {
        const cacheMap = new Map<CaseDataCacheKey, string>([
          [CaseDataCacheKey.CLAIM_JURISDICTION, req.session.userCase?.claimJurisdiction],
          [CaseDataCacheKey.CLAIMANT_REPRESENTED, req.session.userCase?.claimantRepresentedQuestion],
          [CaseDataCacheKey.CASE_TYPE, req.session.userCase?.caseType],
          [CaseDataCacheKey.TYPES_OF_CLAIM, JSON.stringify(req.session.userCase?.typeOfClaim)],
          [CaseDataCacheKey.OTHER_CLAIM_TYPE, req.session.userCase?.otherClaim],
          [CaseDataCacheKey.ACAS_MULTIPLE, req.session.userCase?.acasMultiple],
          [CaseDataCacheKey.VALID_NO_ACAS_REASON, req.session.userCase?.validNoAcasReason],
        ]);
        try {
          req.session.guid = cachePreloginCaseData(redisClient, cacheMap);
        } catch (err) {
          const error = new Error(err.message);
          error.name = RedisErrors.FAILED_TO_SAVE;
          if (err.stack) {
            error.stack = err.stack;
          }
          throw error;
        }
      } else {
        const err = new Error(RedisErrors.CLIENT_NOT_FOUND);
        err.name = RedisErrors.FAILED_TO_CONNECT;
        throw err;
      }
    }
  }
}
