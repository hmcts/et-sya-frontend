import axios from 'axios';
import { LoggerInstance } from 'winston';

import NoticePeriodController from '../../../main/controllers/NoticePeriodController';
import { AppRequest } from '../../../main/definitions/appRequest';
import { YesOrNo } from '../../../main/definitions/case';
import { PageUrls, TranslationKeys } from '../../../main/definitions/constants';
import { CaseApi } from '../../../main/services/CaseService';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

jest.mock('axios');
const caseApi = new CaseApi(axios as jest.Mocked<typeof axios>);

describe('Notice Period Controller', () => {
  const t = {
    'notice-period': {},
    common: {},
  };

  const mockLogger = {
    error: jest.fn().mockImplementation((message: string) => message),
    info: jest.fn().mockImplementation((message: string) => message),
  } as unknown as LoggerInstance;

  it('should render the notice period page', () => {
    const controller = new NoticePeriodController(mockLogger);
    const response = mockResponse();
    const request = <AppRequest>mockRequest({ t });

    controller.get(request, response);
    expect(response.render).toHaveBeenCalledWith(TranslationKeys.NOTICE_PERIOD, expect.anything());
  });

  it('should render the notice type page when yes radio button is selected', () => {
    const body = { noticePeriod: YesOrNo.YES };
    const controller = new NoticePeriodController(mockLogger);

    const req = mockRequest({ body });
    const res = mockResponse();
    controller.post(req, res);

    expect(res.redirect).toBeCalledWith(PageUrls.NOTICE_TYPE);
  });

  it('should render the average weekly hours page when no radio button is selected', () => {
    const body = { noticePeriod: YesOrNo.NO };
    const controller = new NoticePeriodController(mockLogger);

    const req = mockRequest({ body });
    const res = mockResponse();
    controller.post(req, res);

    expect(res.redirect).toBeCalledWith(PageUrls.AVERAGE_WEEKLY_HOURS);
  });

  it('should add the notice period selected value to the session userCase', () => {
    const body = { noticePeriod: YesOrNo.YES };

    const controller = new NoticePeriodController(mockLogger);

    const req = mockRequest({ body });
    const res = mockResponse();
    req.session.userCase = undefined;

    controller.post(req, res);

    expect(req.session.userCase).toStrictEqual({
      noticePeriod: YesOrNo.YES,
    });
  });

  it('should reset notice period values if No selected', () => {
    const body = { noticePeriod: YesOrNo.NO };

    const controller = new NoticePeriodController(mockLogger);

    const req = mockRequest({ body });
    const res = mockResponse();
    req.session.userCase = undefined;

    controller.post(req, res);

    expect(req.session.userCase).toStrictEqual({
      noticePeriod: YesOrNo.NO,
      noticePeriodUnit: undefined,
      noticePeriodLength: undefined,
    });
  });

  it('should run logger in catch block', async () => {
    const body = { noticePeriod: YesOrNo.YES };
    const controller = new NoticePeriodController(mockLogger);
    const request = mockRequest({ body });
    const response = mockResponse();

    await controller.post(request, response);

    return caseApi.updateDraftCase(request.session.userCase).then(() => expect(mockLogger.error).toBeCalled());
  });
});
