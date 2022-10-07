import axios, { AxiosInstance, AxiosResponse } from 'axios';
import config from 'config';
import FormData from 'form-data';

import { CaseApiDataResponse } from '../definitions/api/caseApiResponse';
import { DocumentUploadResponse } from '../definitions/api/documentApiResponse';
import { UserDetails } from '../definitions/appRequest';
import { CaseDataCacheKey, CaseWithId } from '../definitions/case';
import { JavaApiUrls } from '../definitions/constants';
import { toApiFormat, toApiFormatCreate } from '../helper/ApiFormatter';

export class CaseApi {
  constructor(private readonly axio: AxiosInstance) {}

  createCase = async (caseData: string, userDetails: UserDetails): Promise<AxiosResponse<CaseApiDataResponse>> => {
    const userDataMap: Map<CaseDataCacheKey, string> = new Map(JSON.parse(caseData));
    const body = toApiFormatCreate(userDataMap, userDetails);
    return this.axio.post(JavaApiUrls.INITIATE_CASE_DRAFT, body);
  };

  getUserCases = async (): Promise<AxiosResponse<CaseApiDataResponse[]>> => {
    return this.axio.get<CaseApiDataResponse[]>(JavaApiUrls.GET_CASES);
  };

  downloadClaimPdf = async (caseId: string): Promise<AxiosResponse> => {
    const data = {
      caseId,
    };
    return this.axio.post(`${JavaApiUrls.DOWNLOAD_CLAIM_PDF}`, data, {
      responseType: 'arraybuffer',
      headers: {
        'Content-Type': 'application/pdf',
      },
    });
  };

  getCaseDocument = async (docId: string): Promise<AxiosResponse> => {
    return this.axio.get(`${JavaApiUrls.DOCUMENT_DOWNLOAD}${docId}`, {
      responseType: 'arraybuffer',
    });
  };

  updateDraftCase = async (caseItem: CaseWithId): Promise<AxiosResponse<CaseApiDataResponse>> => {
    return this.axio.put(JavaApiUrls.UPDATE_CASE_DRAFT, toApiFormat(caseItem));
  };

  updateSubmittedCase = async (caseItem: CaseWithId): Promise<AxiosResponse<CaseApiDataResponse>> => {
    return this.axio.put(JavaApiUrls.UPDATE_CASE_SUBMITTED, toApiFormat(caseItem));
  };

  getUserCase = async (id: string): Promise<AxiosResponse<CaseApiDataResponse>> => {
    return this.axio.post(JavaApiUrls.GET_CASE, { case_id: id });
  };

  submitCase = async (caseItem: CaseWithId): Promise<AxiosResponse<CaseApiDataResponse>> => {
    return this.axio.put(JavaApiUrls.SUBMIT_CASE, toApiFormat(caseItem));
  };

  uploadDocument = async (file: UploadedFile, caseTypeId: string): Promise<AxiosResponse<DocumentUploadResponse>> => {
    const formData: FormData = new FormData();
    formData.append('document_upload', file.buffer, file.originalname);

    return this.axio.post(JavaApiUrls.UPLOAD_FILE + caseTypeId, formData, {
      headers: {
        ...formData.getHeaders(),
      },
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
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

export type UploadedFile =
  | {
      [fieldname: string]: Express.Multer.File;
    }
  | Express.Multer.File;
