import axios, { AxiosInstance } from 'axios';
import config from 'config';
import { RedisClient } from 'redis';

import { UserDetails } from '../definitions/appRequest';
import { CaseDataCacheKey, CaseWithId, YesOrNo } from '../definitions/case';
import { CcdDataModel, RedisErrors } from '../definitions/constants';
import { State } from '../definitions/definition';

const { Logger } = require('@hmcts/nodejs-logging');
const logger = Logger.getLogger('app');

export interface initiateCaseDraftResponse {
  id: string;
  jurisdiction?: string;
  state: State;
  case_type_id?: string;
  created_date?: Date;
  last_modified?: Date;
  locked_by_user_id?: boolean | null;
  security_level?: string | null;
  case_data: CaseData;
  security_classification?: string;
  callback_response_status?: string | null;
}

export interface CaseData {
  caseType?: string;
  caseSource?: string;
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

export const formatCaseData = (fromApiCaseData: initiateCaseDraftResponse): CaseWithId => ({
  id: fromApiCaseData.id,
  state: fromApiCaseData.state,
  isASingleClaim: fromApiCaseData.case_data.caseType === 'Single' ? YesOrNo.YES : YesOrNo.NO,
});

export class CaseApi {
  constructor(private readonly axio: AxiosInstance) {}

  public async getCase(caseTypeId = CcdDataModel.SINGLE_CASE_ENGLAND): Promise<CaseWithId | false> {
    try {
      const fetchedCases = await this.getDraftCases(caseTypeId);
      return fetchedCases.length === 0 ? false : formatCaseData(fetchedCases[fetchedCases.length - 1]);
    } catch (err) {
      logger.error('Case could not be retrieved.');
    }
  }

  private async getDraftCases(caseTypeId: string): Promise<initiateCaseDraftResponse[]> {
    try {
      const response = await this.axio.get(`/caseTypes/${caseTypeId}/cases`, {
        data: {
          match: { state: 'Draft' },
        },
      });
      return response.data;
    } catch (error) {
      logger.error(error?.response || error?.request || error?.message);
    }
  }
}

export const getCaseApi = (userDetails: UserDetails): CaseApi => {
  return new CaseApi(
    axios.create({
      baseURL: config.get('services.etSyaApi.host'),
      headers: {
        Authorization: 'Bearer ' + userDetails.accessToken,
        Accept: '*/*',
        'Content-Type': 'application/json',
      },
    })
  );
};
