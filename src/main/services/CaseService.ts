import axios, { AxiosInstance } from 'axios';
import config from 'config';
import { RedisClient } from 'redis';

import { CaseDataCacheKey, YesOrNo } from '../definitions/case';
import { CcdDataModel, RedisErrors } from '../definitions/constants';

export interface initiateCaseDraftResponse {
  id: number;
  jurisdiction: string;
  state: string;
  case_type_id: string;
  created_date: Date;
  last_modified: Date;
  locked_by_user_id?: boolean | null;
  security_level?: string | null;
  case_data: CaseData;
  security_classification: string;
  callback_response_status: string | null;
}

export interface CaseData {
  case_type?: string;
  case_source?: string;
}

export const createCase = async (
  caseType: string,
  accessToken: string,
  url: string
): Promise<initiateCaseDraftResponse> => {
  const conf = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };
  const body = {
    case_type: caseType,
    case_source: CcdDataModel.CASE_SOURCE,
  };

  return axios.post(`${url}/case-type/ET_EnglandWales/event-type/initiateCaseDraft/case`, body, conf);
};

//ToDo - Eventually this should return all the pre-login case data
export const getPreloginCaseData = (redisClient: RedisClient, guid: string): Promise<string> => {
  return new Promise<string>((resolve, reject) => {
    redisClient.get(guid, (err: Error, userData: string) => {
      if (userData) {
        const userDataMap = new Map(JSON.parse(userData));
        switch (String(userDataMap.get(CaseDataCacheKey.IS_SINGLE_CASE)).slice(1, -1)) {
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

class CaseApi {
  constructor(private readonly axio: AxiosInstance) {}

  public async getCase(caseTypeId = 'ET_EnglandWales'): Promise<initiateCaseDraftResponse | false> {
    const fetchedCases = await this.getDraftCasesForUser(caseTypeId);
    switch (fetchedCases.length) {
      case 0: {
        return false;
      }
      default: {
        return fetchedCases[fetchedCases.length - 1];
      }
    }
  }

  private async getDraftCasesForUser(caseTypeId: string): Promise<initiateCaseDraftResponse[]> {
    try {
      const response = await this.axio.get(`/caseTypes/${caseTypeId}/cases`, {
        data: {
          match: { state: 'Draft' },
        },
      });
      return response.data;
    } catch (err) {
      throw new Error('Cases for user could not be retrieved.');
    }
  }
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
