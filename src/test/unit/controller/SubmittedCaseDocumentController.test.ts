import { AxiosResponse } from 'axios';

import SubmittedCaseDocumentController from '../../../main/controllers/SubmittedCaseDocumentController';
import * as caseApi from '../../../main/services/CaseService';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Submitted Case Document Controller', () => {
  const t = {};
  const getCaseApiMock = jest.spyOn(caseApi, 'getCaseApi');

  it('should retrieve the binary document', async () => {
    const response = mockResponse();
    const request = mockRequest({ t });
    request.params.docId = '1234';
    request.session.user = {
      id: '1',
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

    (getCaseApiMock as jest.Mock).mockReturnValue({
      getCaseDocument: jest.fn(() => {
        return fetchResponse;
      }),
    });

    const expectedBuffer = Buffer.from(fetchResponse.data, 'binary');
    await new SubmittedCaseDocumentController().get(request, response);
    expect(response.setHeader).toHaveBeenCalledWith('Content-Type', 'application/pdf');
    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.send).toHaveBeenCalledWith(expectedBuffer);
  });

  it('should redirect to not-found on error during request', async () => {
    const response = mockResponse();
    const request = mockRequest({ t });
    request.params.docId = '1234';
    request.session.user = {
      id: '1',
      givenName: 'Bobby',
      familyName: 'Ryan',
      email: 'bobby@gmail.com',
      accessToken: 'token',
      isCitizen: true,
    };
    request.session.userCase.acknowledgementOfClaimLetterDetail = [
      {
        id: '1234',
        description: 'desc',
        mimeType: 'test mimeType',
      },
    ];

    (getCaseApiMock as jest.Mock).mockReturnValue({
      getCaseDocument: jest.fn().mockRejectedValue(new Error('test error message')),
    });
    await new SubmittedCaseDocumentController().get(request, response);
    expect(response.redirect).toHaveBeenCalledWith('/not-found');
  });

  it('should redirect to not found on bad request parameter', async () => {
    const response = mockResponse();
    const request = mockRequest({ t });
    request.params.docId = '';
    await new SubmittedCaseDocumentController().get(request, response);
    expect(response.redirect).toHaveBeenCalledWith('/not-found');
  });
});
