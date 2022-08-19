import axios from 'axios';

import { JavaApiUrls } from '../../../main/definitions/constants';
import { DocumentApi } from '../../../main/services/DocumentService';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

const api = new DocumentApi(mockedAxios);

describe('Axios post to upload document', () => {
  it('should send file to api endpoint', () => {
    const mockType = 'ET_EnglandWales';
    const mockFile: Blob = new Blob(['<html>…</html>'], { type: 'text/html' });
    const mockForm: FormData = new FormData();
    mockForm.append('document_upload', mockFile);
    api.upload(mockFile, mockType);
    expect(mockedAxios.post).toBeCalledWith(JavaApiUrls.UPLOAD_FILE + mockType, mockForm, {
      headers: { 'content-type': 'multipart/form-data' },
    });
  });
});
