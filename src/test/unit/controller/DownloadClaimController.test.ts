import { AxiosResponse } from 'axios';

import DownloadClaimController from '../../../main/controllers/DownloadClaimController';
import * as caseApi from '../../../main/services/CaseService';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Download claim Controller', () => {
  const t = {};
  const getCaseApiMock = jest.spyOn(caseApi, 'getCaseApi');

  it('should download pdf binary array', async () => {
    const response = mockResponse();
    const request = mockRequest({ t });
    request.session.user = {
      id: '1234',
      givenName: 'Bobby',
      familyName: 'Ryan',
      email: 'bobby@gmail.com',
      accessToken: 'token',
      isCitizen: true,
    };
    const fetchResponse = {
      status: 200,
      data: 'someBinaryContent',
    } as AxiosResponse;

    const controller = new DownloadClaimController();

    (getCaseApiMock as jest.Mock).mockReturnValue({
      downloadClaimPdf: jest.fn(() => {
        return fetchResponse;
      }),
    });

    const expectedBuffer = Buffer.from(fetchResponse.data, 'binary');

    await controller.get(request, response);
    expect(getCaseApiMock).toHaveBeenCalledWith('token');
    expect(response.setHeader).toHaveBeenCalledWith('Content-Type', 'application/pdf');
    expect(response.setHeader).toHaveBeenCalledWith('Content-Disposition', 'attachment; filename=submitted-claim.pdf');
    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.send).toHaveBeenCalledWith(expectedBuffer);
  });

  it('should redirect to not-found on error', async () => {
    const response = mockResponse();
    const request = mockRequest({ t });
    request.session.user = {
      id: '1234',
      givenName: 'Bobby',
      familyName: 'Ryan',
      email: 'bobby@gmail.com',
      accessToken: 'token',
      isCitizen: true,
    };

    const controller = new DownloadClaimController();

    (getCaseApiMock as jest.Mock).mockReturnValue({
      downloadClaimPdf: jest.fn().mockRejectedValue(new Error('test error message')),
    });
    await controller.get(request, response);

    expect(response.redirect).toHaveBeenCalledWith('not-found');
  });
});
