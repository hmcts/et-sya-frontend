import axios from 'axios';
import { LoggerInstance } from 'winston';

import NoticeLengthController from '../../../main/controllers/NoticeLengthController';
import { PageUrls, TranslationKeys } from '../../../main/definitions/constants';
import { CaseApi } from '../../../main/services/CaseService';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

jest.mock('axios');
const caseApi = new CaseApi(axios as jest.Mocked<typeof axios>);

describe('Notice length Controller', () => {
  const t = {
    'notice-length': {},
    common: {},
  };

  const mockLogger = {
    error: jest.fn().mockImplementation((message: string) => message),
    info: jest.fn().mockImplementation((message: string) => message),
  } as unknown as LoggerInstance;

  it('should render notice length page', () => {
    const noticeLengthController = new NoticeLengthController(mockLogger);
    const response = mockResponse();
    const request = mockRequest({ t });

    noticeLengthController.get(request, response);
    expect(response.render).toHaveBeenCalledWith(TranslationKeys.NOTICE_LENGTH, expect.anything());
  });

  it('should render the average weekly hours page when value is submitted', () => {
    const body = { noticePeriodLength: '2' };
    const controller = new NoticeLengthController(mockLogger);

    const req = mockRequest({ body });
    const res = mockResponse();
    controller.post(req, res);

    expect(res.redirect).toBeCalledWith(PageUrls.AVERAGE_WEEKLY_HOURS);
  });

  it('should add the notice period length to the session userCase', () => {
    const body = { noticePeriodLength: '2' };

    const controller = new NoticeLengthController(mockLogger);

    const req = mockRequest({ body });
    const res = mockResponse();
    req.session.userCase = undefined;

    controller.post(req, res);

    expect(req.session.userCase).toStrictEqual({
      noticePeriodLength: '2',
    });
  });

  it('should run logger in catch block', async () => {
    const body = { noticePeriodLength: '2' };
    const controller = new NoticeLengthController(mockLogger);
    const request = mockRequest({ body });
    const response = mockResponse();

    await controller.post(request, response);

    return caseApi.updateDraftCase(request.session.userCase).then(() => expect(mockLogger.info).toBeCalled());
  });
});
