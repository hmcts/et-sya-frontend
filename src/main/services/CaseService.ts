import axios, { AxiosInstance, AxiosResponse } from 'axios';
import config from 'config';

import { CaseApiDataResponse } from '../definitions/api/caseApiResponse';
import { UserDetails } from '../definitions/appRequest';
import { CaseDataCacheKey } from '../definitions/case';
import { JavaApiUrls } from '../definitions/constants';
import { CaseState } from '../definitions/definition';
import { toApiFormat } from '../helper/ApiFormatter';

const { Logger } = require('@hmcts/nodejs-logging');
const logger = Logger.getLogger('app');

export class CaseApi {
  constructor(private readonly axio: AxiosInstance) {}

  createCase = async (caseData: string, userDetails: UserDetails): Promise<AxiosResponse<CaseApiDataResponse>> => {
    const userDataMap: Map<CaseDataCacheKey, string> = new Map(JSON.parse(caseData));
    const body = toApiFormat(userDataMap, userDetails);
    logger.info(body);
    return this.axio.post(JavaApiUrls.INITIATE_CASE_DRAFT, body);
  };

  getDraftCases = async (): Promise<AxiosResponse<CaseApiDataResponse[]>> => {
    return this.axio.get<CaseApiDataResponse[]>(JavaApiUrls.GET_CASES, {
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
