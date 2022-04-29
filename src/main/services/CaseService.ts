import axios, { AxiosInstance, AxiosResponse } from 'axios';
import config from 'config';

import { CaseApiDataResponse } from '../definitions/api/caseApiResponse';
import { UserDetails } from '../definitions/appRequest';
import { CaseDataCacheKey, CaseWithId } from '../definitions/case';
import { JavaApiUrls } from '../definitions/constants';
import { CaseState } from '../definitions/definition';
import { toApiFormat, toApiFormatPreLogin } from '../helper/ApiFormatter';

export class CaseApi {
  constructor(private readonly axio: AxiosInstance) {}

  createCase = async (caseData: string, userDetails: UserDetails): Promise<AxiosResponse<CaseApiDataResponse>> => {
    const userDataMap: Map<CaseDataCacheKey, string> = new Map(JSON.parse(caseData));
    const body = toApiFormatPreLogin(userDataMap, userDetails);
    return this.axio.post(JavaApiUrls.INITIATE_CASE_DRAFT, body);
  };

  getDraftCases = async (): Promise<AxiosResponse<CaseApiDataResponse[]>> => {
    return this.axio.get<CaseApiDataResponse[]>(JavaApiUrls.GET_CASES, {
      data: {
        match: { state: CaseState.AWAITING_SUBMISSION_TO_HMCTS },
      },
    });
  };

  updateDraftCase = async (caseItem: CaseWithId): Promise<AxiosResponse<CaseApiDataResponse>> => {
    return this.axio.put(`${JavaApiUrls.UPDATE_CASE_DRAFT}/${caseItem.id}`, toApiFormat(caseItem));
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
