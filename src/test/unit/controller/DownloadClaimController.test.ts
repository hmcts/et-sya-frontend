import axios from 'axios';

import DownloadClaimController from '../../../main/controllers/DownloadClaimController';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

jest.mock('axios');

describe('Download Claim Controller', () => {
  jest.mock('axios');
  jest.mock('../../../main/auth/index');

  const mockedAxios = axios as jest.Mocked<typeof axios>;
  const t = {};
  it('should display file', () => {
    const controller = new DownloadClaimController();
    const req = mockRequest({ t });
    const res = mockResponse();
    const fetchResponse = {
      headers: { 'content-type': 'application/pdf' },
      statusCode: 200,
      body: 'someBinaryContent',
    };
    const expectedBuffer = Buffer.from(fetchResponse.body, 'binary');

    mockedAxios.get.mockResolvedValueOnce({ data: expectedBuffer });
    const result = controller.get(req, res);

    expect(mockedAxios.get).toHaveBeenCalled();
    expect(result).toBe(expectedBuffer);
  });
});
