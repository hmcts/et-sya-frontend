import axios from 'axios';

import SubmitCaseController from '../../../main/controllers/SubmitClaimController';
import { PageUrls } from '../../../main/definitions/constants';
import * as CaseService from '../../../main/services/CaseService';
import { CaseApi } from '../../../main/services/CaseService';
import { submittedCaseResponse } from '../mocks/mockEt1DataModel';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

jest.mock('axios');
const caseApi = new CaseApi(axios as jest.Mocked<typeof axios>);

describe('Submit case controller', () => {
  const t = {
    common: {},
  };

  it('should successfully submit case', async () => {
    const controller = new SubmitCaseController();
    const mockClient = jest.spyOn(CaseService, 'getCaseApi');
    mockClient.mockReturnValue(caseApi);
    caseApi.submitCase = jest.fn().mockResolvedValue(submittedCaseResponse);

    const response = mockResponse();
    const request = mockRequest({ t });
    await controller.get(request, response);

    expect(request.session.errors).toEqual([]);
    expect(response.redirect).toHaveBeenCalledWith(PageUrls.CLAIM_SUBMITTED);
  });

  it('should return errors', async () => {
    const controller = new SubmitCaseController();
    const mockClient = jest.spyOn(CaseService, 'getCaseApi');
    mockClient.mockReturnValue(caseApi);
    caseApi.submitCase = jest.fn().mockImplementation(() => {
      throw new Error('Error');
    });

    const response = mockResponse();
    const request = mockRequest({ t });
    await controller.get(request, response);

    expect(request.session.errors).toEqual([{ errorType: 'api', propertyName: 'hiddenErrorField' }]);
    expect(response.redirect).toHaveBeenCalledWith(PageUrls.CHECK_ANSWERS);
  });
});
