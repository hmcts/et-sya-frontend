import { AxiosInstance, AxiosResponse } from 'axios';

import { DocumentUploadResponse } from '../definitions/api/documentApiResponse';
import { JavaApiUrls } from '../definitions/constants';

export class DocumentApi {
  constructor(private readonly axio: AxiosInstance) {}

  upload = async (document: Blob, caseTypeId: string): Promise<AxiosResponse<DocumentUploadResponse>> => {
    const formData = new FormData();
    formData.append('document_upload', document);
    return this.axio.post(JavaApiUrls.UPLOAD_FILE + caseTypeId, formData, {
      headers: { 'content-type': 'multipart/form-data' },
    });
  };
}
