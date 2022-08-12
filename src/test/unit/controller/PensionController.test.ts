import axios from 'axios';
import { LoggerInstance } from 'winston';

import PensionController from '../../../main/controllers/PensionController';
import { YesOrNo } from '../../../main/definitions/case';
import { PageUrls } from '../../../main/definitions/constants';
import { FormError } from '../../../main/definitions/form';
import { CaseApi } from '../../../main/services/CaseService';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

jest.mock('axios');
const caseApi = new CaseApi(axios as jest.Mocked<typeof axios>);

describe('Pension controller', () => {
  const t = {
    pension: {},
    common: {},
  };

  const mockLogger = {
    error: jest.fn().mockImplementation((message: string) => message),
    info: jest.fn().mockImplementation((message: string) => message),
  } as unknown as LoggerInstance;

  it('should render the pension page', () => {
    const controller = new PensionController(mockLogger);
    const response = mockResponse();
    const request = mockRequest({ t });
    controller.get(request, response);
    expect(response.render).toHaveBeenCalledWith('pension', expect.anything());
  });

  it('should not return an error when no radio buttons are selected', () => {
    const body = {
      pension: '',
    };
    const errors: FormError[] = [];
    const controller = new PensionController(mockLogger);

    const req = mockRequest({ body });
    const res = mockResponse();
    req.session.userCase = undefined;

    controller.post(req, res);

    expect(res.redirect).toBeCalledWith(PageUrls.BENEFITS);
    expect(req.session.errors).toEqual(errors);
  });

  it('should add the pension form value to the userCase', () => {
    const body = { claimantPensionContribution: YesOrNo.YES, claimantPensionWeeklyContribution: '14' };

    const controller = new PensionController(mockLogger);

    const req = mockRequest({ body });
    const res = mockResponse();
    req.session.userCase = undefined;

    controller.post(req, res);

    expect(res.redirect).toBeCalledWith(PageUrls.BENEFITS);
    expect(req.session.userCase).toStrictEqual(body);
  });

  it('should reset contribution if No selected', () => {
    const body = { claimantPensionContribution: YesOrNo.NO };

    const controller = new PensionController(mockLogger);

    const req = mockRequest({ body });
    const res = mockResponse();
    req.session.userCase = undefined;

    controller.post(req, res);

    expect(res.redirect).toBeCalledWith(PageUrls.BENEFITS);
    expect(req.session.userCase).toStrictEqual({
      claimantPensionContribution: YesOrNo.NO,
      claimantPensionWeeklyContribution: undefined,
    });
  });

  it('should run logger in catch block', async () => {
    const body = { claimantPensionContribution: YesOrNo.NO };
    const controller = new PensionController(mockLogger);
    const request = mockRequest({ body });
    const response = mockResponse();

    await controller.post(request, response);

    return caseApi.updateDraftCase(request.session.userCase).then(() => expect(mockLogger.error).toBeCalled());
  });
});
