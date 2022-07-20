import axios from 'axios';
import { LoggerInstance } from 'winston';

import NoticeTypeController from '../../../main/controllers/NoticeTypeController';
import { AppRequest } from '../../../main/definitions/appRequest';
import { WeeksOrMonths, YesOrNo } from '../../../main/definitions/case';
import { PageUrls, TranslationKeys } from '../../../main/definitions/constants';
import { CaseApi } from '../../../main/services/CaseService';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

jest.mock('axios');
const caseApi = new CaseApi(axios as jest.Mocked<typeof axios>);

describe('Notice Type Controller', () => {
  const t = {
    'notice-type': {},
    common: {},
  };

  const mockLogger = {
    error: jest.fn().mockImplementation((message: string) => message),
    info: jest.fn().mockImplementation((message: string) => message),
  } as unknown as LoggerInstance;

  it('should render the notice type page', () => {
    const controller = new NoticeTypeController(mockLogger);
    const response = mockResponse();
    const request = <AppRequest>mockRequest({ t });

    controller.get(request, response);
    expect(response.render).toHaveBeenCalledWith(TranslationKeys.NOTICE_TYPE, expect.anything());
  });

  it('should render the notice length page when weeks or months radio button is selected', () => {
    const body = { noticePeriodUnit: YesOrNo.YES };
    const controller = new NoticeTypeController(mockLogger);

    const req = mockRequest({ body });
    const res = mockResponse();
    controller.post(req, res);

    expect(res.redirect).toBeCalledWith(PageUrls.NOTICE_LENGTH);
  });

  it('should add the notice period to the session userCase', () => {
    const body = { noticePeriodUnit: WeeksOrMonths.WEEKS };

    const controller = new NoticeTypeController(mockLogger);

    const req = mockRequest({ body });
    const res = mockResponse();
    req.session.userCase = undefined;

    controller.post(req, res);

    expect(req.session.userCase).toStrictEqual({
      noticePeriodUnit: WeeksOrMonths.WEEKS,
    });
  });

  it('should run logger in catch block', async () => {
    const body = { noticePeriodUnit: WeeksOrMonths.WEEKS };
    const controller = new NoticeTypeController(mockLogger);
    const request = mockRequest({ body });
    const response = mockResponse();

    await controller.post(request, response);

    return caseApi.updateDraftCase(request.session.userCase).then(() => expect(mockLogger.error).toBeCalled());
  });
});
