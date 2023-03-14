import axiosService, { AxiosInstance, AxiosResponse } from 'axios';
import config from 'config';
import FormData from 'form-data';

import { CaseApiDataResponse } from '../definitions/api/caseApiResponse';
import { DocumentUploadResponse } from '../definitions/api/documentApiResponse';
import { DocumentDetailsResponse } from '../definitions/api/documentDetailsResponse';
import { UserDetails } from '../definitions/appRequest';
import { CaseWithId } from '../definitions/case';
import { JavaApiUrls } from '../definitions/constants';
import { applicationTypes } from '../definitions/contact-applications';
import { toApiFormat, toApiFormatCreate } from '../helper/ApiFormatter';

import { axiosErrorDetails } from './AxiosErrorAdapter';

export class CaseApi {
  constructor(private readonly axios: AxiosInstance) {}

  createCase = async (caseData: string, userDetails: UserDetails): Promise<AxiosResponse<CaseApiDataResponse>> => {
    try {
      return await this.axios.post(
        JavaApiUrls.INITIATE_CASE_DRAFT,
        toApiFormatCreate(new Map(JSON.parse(caseData)), userDetails)
      );
    } catch (error) {
      throw new Error('Error creating case: ' + axiosErrorDetails(error));
    }
  };

  getUserCases = async (): Promise<AxiosResponse<CaseApiDataResponse[]>> => {
    try {
      return await this.axios.get<CaseApiDataResponse[]>(JavaApiUrls.GET_CASES);
    } catch (error) {
      throw new Error('Error getting user cases: ' + axiosErrorDetails(error));
    }
  };

  downloadClaimPdf = async (caseId: string): Promise<AxiosResponse> => {
    try {
      return await this.axios.post(
        `${JavaApiUrls.DOWNLOAD_CLAIM_PDF}`,
        {
          caseId,
        },
        {
          responseType: 'arraybuffer',
          headers: {
            'Content-Type': 'application/pdf',
          },
        }
      );
    } catch (error) {
      throw new Error('Error downloading claim pdf: ' + axiosErrorDetails(error));
    }
  };

  getCaseDocument = async (docId: string): Promise<AxiosResponse> => {
    try {
      return await this.axios.get(`${JavaApiUrls.DOCUMENT_DOWNLOAD}${docId}`, {
        responseType: 'arraybuffer',
      });
    } catch (error) {
      throw new Error('Error fetching document: ' + axiosErrorDetails(error));
    }
  };

  getDocumentDetails = async (docId: string): Promise<AxiosResponse<DocumentDetailsResponse>> => {
    try {
      return await this.axios.get(`${JavaApiUrls.DOCUMENT_DETAILS}${docId}`);
    } catch (error) {
      throw new Error('Error fetching document details: ' + axiosErrorDetails(error));
    }
  };

  updateDraftCase = async (caseItem: CaseWithId): Promise<AxiosResponse<CaseApiDataResponse>> => {
    try {
      return await this.axios.put(JavaApiUrls.UPDATE_CASE_DRAFT, toApiFormat(caseItem));
    } catch (error) {
      throw new Error('Error updating draft case: ' + axiosErrorDetails(error));
    }
  };

  updateHubLinksStatuses = async (caseItem: CaseWithId): Promise<AxiosResponse<CaseApiDataResponse>> => {
    try {
      return await this.axios.put(JavaApiUrls.UPDATE_CASE_SUBMITTED, {
        case_id: caseItem.id,
        case_type_id: caseItem.caseTypeId,
        hub_links_statuses: caseItem.hubLinksStatuses,
      });
    } catch (error) {
      throw new Error('Error updating hub links statuses: ' + axiosErrorDetails(error));
    }
  };

  submitClaimantTse = async (caseItem: CaseWithId): Promise<AxiosResponse<CaseApiDataResponse>> => {
    try {
      return await this.axios.put(JavaApiUrls.SUBMIT_CLAIMANT_APPLICATION, {
        case_id: caseItem.id,
        case_type_id: caseItem.caseTypeId,
        type_c: applicationTypes.claimant.c.includes(caseItem.contactApplicationType),
        claimant_tse: {
          contactApplicationType: caseItem.contactApplicationType,
          contactApplicationText: caseItem.contactApplicationText,
          contactApplicationFile: caseItem.contactApplicationFile,
          copyToOtherPartyYesOrNo: caseItem.copyToOtherPartyYesOrNo,
          copyToOtherPartyText: caseItem.copyToOtherPartyText,
        },
      });
    } catch (error) {
      throw new Error('Error submitting claimant tse application: ' + axiosErrorDetails(error));
    }
  };

  respondToApplication = async (caseItem: CaseWithId): Promise<AxiosResponse<CaseApiDataResponse>> => {
    try {
      return await this.axios.put('cases/respond-to-application', {
        case_id: caseItem.id,
        case_type_id: caseItem.caseTypeId,
        applicationId: caseItem.selectedGenericTseApplication.id,
        response: {
          response: caseItem.respondToApplicationText,
          hasSupportingMaterial: caseItem.hasSupportingMaterial,
          supportingMaterial: [
            {
              value: {
                uploadedDocument: caseItem.supportingMaterialFile,
              },
            },
          ],
          copyToOtherParty: caseItem.copyToOtherPartyYesOrNo,
          copyNoGiveDetails: caseItem.copyToOtherPartyText,
        },
      });
    } catch (error) {
      throw new Error('Error responding to tse application: ' + axiosErrorDetails(error));
    }
  };

  getUserCase = async (id: string): Promise<AxiosResponse<CaseApiDataResponse>> => {
    try {
      return await this.axios.post(JavaApiUrls.GET_CASE, { case_id: id });
    } catch (error) {
      throw new Error('Error getting user case: ' + axiosErrorDetails(error));
    }
  };

  submitCase = async (caseItem: CaseWithId): Promise<AxiosResponse<CaseApiDataResponse>> => {
    try {
      return await this.axios.put(JavaApiUrls.SUBMIT_CASE, toApiFormat(caseItem));
    } catch (error) {
      throw new Error('Error submitting case: ' + axiosErrorDetails(error));
    }
  };

  uploadDocument = async (file: UploadedFile, caseTypeId: string): Promise<AxiosResponse<DocumentUploadResponse>> => {
    try {
      const formData: FormData = new FormData();
      formData.append('document_upload', file.buffer, file.originalname);

      return await this.axios.post(JavaApiUrls.UPLOAD_FILE + caseTypeId, formData, {
        headers: {
          ...formData.getHeaders(),
        },
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
      });
    } catch (error) {
      throw new Error('Error uploading document: ' + axiosErrorDetails(error));
    }
  };
}

export const getCaseApi = (token: string): CaseApi => {
  return new CaseApi(
    axiosService.create({
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
