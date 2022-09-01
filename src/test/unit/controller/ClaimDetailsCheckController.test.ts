import { LoggerInstance } from 'winston';

import ClaimDetailsCheckController from '../../../main/controllers/ClaimDetailsCheckController';
import { YesOrNo } from '../../../main/definitions/case';
import { PageUrls, TranslationKeys } from '../../../main/definitions/constants';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Test claim details check controller', () => {
  const t = {
    claimDetailsCheck: {},
    common: {},
  };

  const mockLogger = {
    error: jest.fn().mockImplementation((message: string) => message),
    info: jest.fn().mockImplementation((message: string) => message),
  } as unknown as LoggerInstance;

  it('should render the task list check page', () => {
    const controller = new ClaimDetailsCheckController(mockLogger);
    const response = mockResponse();
    const request = mockRequest({ t });
    controller.get(request, response);
    expect(response.render).toHaveBeenCalledWith(TranslationKeys.CLAIM_DETAILS_CHECK, expect.anything());
  });

  it('should render the claim steps page', () => {
    const body = { claimDetailsCheck: YesOrNo.YES };
    const controller = new ClaimDetailsCheckController(mockLogger);
    const req = mockRequest({ body });
    const res = mockResponse();
    controller.post(req, res);
    expect(res.redirect).toHaveBeenCalledWith(PageUrls.CLAIM_STEPS);
  });
});
