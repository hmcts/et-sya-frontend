import axios, { AxiosInstance, AxiosResponse } from 'axios';
import config from 'config';
import { RedisClient } from 'redis';

import { CaseDataCacheKey, CaseWithId, YesOrNo } from '../definitions/case';
import { CcdDataModel, RedisErrors } from '../definitions/constants';
import { CaseState } from '../definitions/definition';

export interface CaseDraftResponse {
  id: string;
  jurisdiction?: string;
  state: CaseState;
  case_type_id?: string;
  created_date?: Date;
  last_modified?: Date;
  locked_by_user_id?: boolean | null;
  security_level?: string | null;
  case_data?: CaseData;
  security_classification?: string;
  callback_response_status?: string | null;
}

export interface CaseData {
  caseType?: string;
  caseSource?: string;
}

//ToDo - Eventually this should return all the pre-login case data
export const getPreloginCaseData = (redisClient: RedisClient, guid: string): Promise<string> => {
  return new Promise<string>((resolve, reject) => {
    redisClient.get(guid, (err: Error, userData: string) => {
      if (userData) {
        const userDataMap = new Map(JSON.parse(userData));
        switch (String(userDataMap.get(CaseDataCacheKey.CASE_TYPE)).slice(1, -1)) {
          case YesOrNo.YES:
            resolve(CcdDataModel.SINGLE_CASE_ENGLAND);
            break;
          case YesOrNo.NO:
            resolve(CcdDataModel.MULTIPLE_CASE_ENGLAND);
            break;
        }
      }
      if (err || !userData) {
        const error = new Error(err ? err.message : RedisErrors.REDIS_ERROR);
        error.name = RedisErrors.FAILED_TO_RETREIVE;
        if (err?.stack) {
          error.stack = err.stack;
        }
        reject(error);
      }
    });
  });
};

export const formatCaseData = (fromApiCaseData: CaseDraftResponse): CaseWithId => ({
  id: fromApiCaseData.id,
  state: fromApiCaseData.state,
  //ToDo - need a better case data type to store caseType in session (instead of using isASingleClaim)
});

export class CaseApi {
  constructor(private readonly axio: AxiosInstance) {}

  createCase = async (caseType: string): Promise<CaseDraftResponse> => {
    const body = {
      case_type: caseType,
      case_source: CcdDataModel.CASE_SOURCE,
    };

    return this.axio.post('/case-type/ET_EnglandWales/event-type/initiateCaseDraft/case', body);
  };

  getDraftCases = (): Promise<AxiosResponse<CaseDraftResponse[]>> => {
    return this.axio.get<CaseDraftResponse[]>('/caseTypes/ET_EnglandWales/cases', {
      data: {
        match: { state: 'Draft' },
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
