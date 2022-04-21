import axios, { AxiosInstance, AxiosResponse } from 'axios';
import config from 'config';
import { RedisClient } from 'redis';

import { UserDetails } from '../definitions/appRequest';
import { CaseApiResponse, CaseDataCacheKey } from '../definitions/case';
import { JavaApiUrls, RedisErrors } from '../definitions/constants';
import { CaseState } from '../definitions/definition';
import { toApiFormat } from '../helper/ApiFormatter';

export const getPreloginCaseData = (redisClient: RedisClient, guid: string): Promise<string> => {
  return new Promise<string>((resolve, reject) => {
    redisClient.get(guid, (err: Error, userData: string) => {
      if (err || !userData) {
        const error = new Error(err ? err.message : RedisErrors.REDIS_ERROR);
        error.name = RedisErrors.FAILED_TO_RETREIVE;
        if (err?.stack) {
          error.stack = err.stack;
        }
        reject(error);
      }
      resolve(userData);
    });
  });
};

export class CaseApi {
  constructor(private readonly axio: AxiosInstance) {}

  createCase = async (caseData: string, userDetails: UserDetails): Promise<CaseApiResponse> => {
    const userDataMap: Map<CaseDataCacheKey, string> = new Map(JSON.parse(caseData));
    const body = toApiFormat(userDataMap, userDetails);

    return this.axio.post(JavaApiUrls.INITIATE_CASE_DRAFT, body);
  };

  getDraftCases = (): Promise<AxiosResponse<CaseApiResponse[]>> => {
    return this.axio.get<CaseApiResponse[]>(JavaApiUrls.GET_CASES, {
      data: {
        match: { state: CaseState.AWAITING_SUBMISSION_TO_HMCTS },
      },
    });
  };
}

export const getCaseApi = (token: string): CaseApi => {
  return new CaseApi(
    axios.create({
      baseURL: config.get('services.etSyaApi.host'),
      headers: {
        Authorization: 'Bearer ' + token,
        Accept: '*/*',
        'Content-Type': 'application/json',
      },
    })
  );
};
