import axios from 'axios';
import { LoggerInstance } from 'winston';

import StillWorkingController from '../../../main/controllers/StillWorkingController';
import { StillWorking } from '../../../main/definitions/case';
import { PageUrls, TranslationKeys } from '../../../main/definitions/constants';
import { CaseApi } from '../../../main/services/CaseService';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

jest.mock('axios');
const caseApi = new CaseApi(axios as jest.Mocked<typeof axios>);

describe('Are you still working controller', () => {
  const t = {
    isStillWorking: {},
    common: {},
  };

  const mockLogger = {
    error: jest.fn().mockImplementation((message: string) => message),
    info: jest.fn().mockImplementation((message: string) => message),
  } as unknown as LoggerInstance;

  it('should render are you still working page', () => {
    const controller = new StillWorkingController(mockLogger);

    const response = mockResponse();
    const request = mockRequest({ t });

    controller.get(request, response);
    expect(response.render).toHaveBeenCalledWith(TranslationKeys.STILL_WORKING, expect.anything());
  });

  it('should render the employment details page', () => {
    const body = { isStillWorking: StillWorking.WORKING };
    const controller = new StillWorkingController(mockLogger);

    const req = mockRequest({ body });
    const res = mockResponse();
    controller.post(req, res);

    expect(res.redirect).toBeCalledWith(PageUrls.JOB_TITLE);
  });

  it('should render the job title page when the page submitted', () => {
    const body = { isStillWorking: StillWorking.WORKING };
    const controller = new StillWorkingController(mockLogger);

    const req = mockRequest({ body });
    const res = mockResponse();
    controller.post(req, res);

    expect(res.redirect).toBeCalledWith(PageUrls.JOB_TITLE);
  });

  it('should add isStillWorking to the session userCase', () => {
    const body = { isStillWorking: StillWorking.WORKING };

    const controller = new StillWorkingController(mockLogger);
    const req = mockRequest({ body });
    const res = mockResponse();
    req.session.userCase = undefined;

    controller.post(req, res);

    expect(res.redirect).toBeCalledWith(PageUrls.JOB_TITLE);
    expect(req.session.userCase).toStrictEqual({
      isStillWorking: StillWorking.WORKING,
    });
  });

  it('should redirect to the same screen when errors are present', () => {
    const errors = [{ propertyName: 'isStillWorking', errorType: 'required' }];
    const body = {
      isStillWorking: '',
    };

    const controller = new StillWorkingController(mockLogger);

    const req = mockRequest({ body });
    const res = mockResponse();
    controller.post(req, res);

    expect(res.redirect).toBeCalledWith(req.path);
    expect(req.session.errors).toEqual(errors);
  });

  it('should run logger in catch block', async () => {
    const controller = new StillWorkingController(mockLogger);
    const request = mockRequest({ body: { isStillWorking: StillWorking.WORKING } });
    const response = mockResponse();

    await controller.post(request, response);

    return caseApi.updateDraftCase(request.session.userCase).then(() => expect(mockLogger.error).toBeCalled());
  });
});
