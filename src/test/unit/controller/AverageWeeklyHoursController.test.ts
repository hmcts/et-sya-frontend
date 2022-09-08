import axios from 'axios';
import { LoggerInstance } from 'winston';

import AverageWeeklyHoursController from '../../../main/controllers/AverageWeeklyHoursController';
import { PageUrls, TranslationKeys } from '../../../main/definitions/constants';
import { CaseApi } from '../../../main/services/CaseService';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

jest.mock('axios');
const caseApi = new CaseApi(axios as jest.Mocked<typeof axios>);

describe('Average weekly hours Controller', () => {
  const t = {
    'average-weekly-hours': {},
    common: {},
  };

  const mockLogger = {
    error: jest.fn().mockImplementation((message: string) => message),
    info: jest.fn().mockImplementation((message: string) => message),
  } as unknown as LoggerInstance;

  it('should render average weekly hours page', () => {
    const averageWeeklyHoursController = new AverageWeeklyHoursController(mockLogger);
    const response = mockResponse();
    const request = mockRequest({ t });

    averageWeeklyHoursController.get(request, response);
    expect(response.render).toHaveBeenCalledWith(TranslationKeys.AVERAGE_WEEKLY_HOURS, expect.anything());
  });

  it('should render the pay page when correct value of hours added to input field and the page submitted', () => {
    const body = { avgWeeklyHrs: '2' };
    const controller = new AverageWeeklyHoursController(mockLogger);

    const req = mockRequest({ body });
    const res = mockResponse();
    controller.post(req, res);

    expect(res.redirect).toHaveBeenCalledWith(PageUrls.PAY);
  });

  it('should add average weekly hours to the session userCase', () => {
    const body = { avgWeeklyHrs: '3' };

    const controller = new AverageWeeklyHoursController(mockLogger);

    const req = mockRequest({ body });
    const res = mockResponse();
    req.session.userCase = undefined;

    controller.post(req, res);

    expect(req.session.userCase).toStrictEqual({
      avgWeeklyHrs: '3',
    });
  });

  it('should run logger in catch block', async () => {
    const body = { avgWeeklyHrs: '3' };
    const controller = new AverageWeeklyHoursController(mockLogger);
    const request = mockRequest({ body });
    const response = mockResponse();

    await controller.post(request, response);

    return caseApi.updateDraftCase(request.session.userCase).then(() => expect(mockLogger.error).toHaveBeenCalled());
  });
});
