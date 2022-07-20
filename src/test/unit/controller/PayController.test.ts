import axios from 'axios';
import { LoggerInstance } from 'winston';

import PayController from '../../../main/controllers/PayController';
import { PayInterval } from '../../../main/definitions/case';
import { PageUrls, TranslationKeys } from '../../../main/definitions/constants';
import { CaseApi } from '../../../main/services/CaseService';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

jest.mock('axios');
const caseApi = new CaseApi(axios as jest.Mocked<typeof axios>);

describe('Pay Controller', () => {
  const t = {
    pay: {},
    common: {},
  };

  const mockLogger = {
    error: jest.fn().mockImplementation((message: string) => message),
    info: jest.fn().mockImplementation((message: string) => message),
  } as unknown as LoggerInstance;

  it('should render pay page', () => {
    const payController = new PayController(mockLogger);
    const response = mockResponse();
    const request = mockRequest({ t });

    payController.get(request, response);
    expect(response.render).toHaveBeenCalledWith(TranslationKeys.PAY, expect.anything());
  });

  it('should render the pension page when the page submitted', () => {
    const body = {
      payBeforeTax: '123',
      payAfterTax: '122',
      payInterval: PayInterval.WEEKLY,
    };
    const controller = new PayController(mockLogger);

    const req = mockRequest({ body });
    const res = mockResponse();
    controller.post(req, res);

    expect(res.redirect).toBeCalledWith(PageUrls.PENSION);
  });

  it('should add payBeforeTax, payAfterTax and payInterval to the session userCase', () => {
    const body = { payBeforeTax: '123', payAfterTax: '124', payInterval: PayInterval.WEEKLY };

    const controller = new PayController(mockLogger);

    const req = mockRequest({ body });
    const res = mockResponse();
    req.session.userCase = undefined;

    controller.post(req, res);

    expect(req.session.userCase).toStrictEqual({
      payBeforeTax: '123',
      payAfterTax: '124',
      payInterval: PayInterval.WEEKLY,
    });
  });

  it('should run logger in catch block', async () => {
    const body = { payBeforeTax: '123', payAfterTax: '124', payInterval: PayInterval.WEEKLY };
    const controller = new PayController(mockLogger);
    const request = mockRequest({ body });
    const response = mockResponse();

    await controller.post(request, response);

    return caseApi.updateDraftCase(request.session.userCase).then(() => expect(mockLogger.error).toBeCalled());
  });
});
