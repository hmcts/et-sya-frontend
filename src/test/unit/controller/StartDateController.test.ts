import axios from 'axios';
import { LoggerInstance } from 'winston';

import StartDateController from '../../../main/controllers/StartDateController';
import { StillWorking } from '../../../main/definitions/case';
import { PageUrls } from '../../../main/definitions/constants';
import { CaseApi } from '../../../main/services/CaseService';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

jest.mock('axios');
const caseApi = new CaseApi(axios as jest.Mocked<typeof axios>);

describe('Start date Controller', () => {
  const t = {
    'start-date': {},
    common: {},
  };

  const mockLogger = {
    error: jest.fn().mockImplementation((message: string) => message),
    info: jest.fn().mockImplementation((message: string) => message),
  } as unknown as LoggerInstance;

  it('should render start date page', () => {
    const startDateController = new StartDateController(mockLogger);
    const response = mockResponse();
    const request = mockRequest({ t });

    startDateController.get(request, response);

    expect(response.render).toHaveBeenCalledWith('start-date', expect.anything());
    expect(request.session.userCase).toEqual({
      dobDate: {
        year: '2000',
        month: '12',
        day: '24',
      },
      startDate: {
        day: '21',
        month: '04',
        year: '2019',
      },
      id: '1234',
    });
  });

  it('should redirect to the same screen when errors are present', () => {
    const errors = [
      { propertyName: 'startDate', errorType: 'dayRequired', fieldName: 'day' },
      { propertyName: 'startDate', errorType: 'invalidDateBeforeDOB' },
    ];
    const body = {
      'startDate-day': '',
      'startDate-month': '11',
      'startDate-year': '2000',
    };

    const controller = new StartDateController(mockLogger);

    const req = mockRequest({ body });
    const res = mockResponse();
    controller.post(req, res);

    expect(req.session.userCase).toEqual({
      dobDate: {
        year: '2000',
        month: '12',
        day: '24',
      },
      startDate: {
        day: '',
        month: '11',
        year: '2000',
      },
      id: '1234',
    });

    expect(res.redirect).toHaveBeenCalledWith(req.path);
    expect(req.session.errors).toEqual(errors);
  });

  it('should redirect to notice period when WORKING is selected', () => {
    const body = {
      'startDate-day': '11',
      'startDate-month': '11',
      'startDate-year': '2000',
    };
    const userCase = {
      dobDate: { year: '1990', month: '12', day: '24' },
      isStillWorking: StillWorking.WORKING,
    };

    const controller = new StartDateController(mockLogger);

    const req = mockRequest({ body, userCase });
    const res = mockResponse();
    controller.post(req, res);

    expect(req.session.userCase).toEqual({
      dobDate: {
        year: '1990',
        month: '12',
        day: '24',
      },
      startDate: {
        day: '11',
        month: '11',
        year: '2000',
      },
      id: '1234',
      isStillWorking: StillWorking.WORKING,
    });

    expect(res.redirect).toHaveBeenCalledWith(PageUrls.NOTICE_PERIOD);
  });

  it('should redirect to notice end when NOTICE is selected', () => {
    const body = {
      'startDate-day': '11',
      'startDate-month': '11',
      'startDate-year': '2000',
    };
    const userCase = {
      dobDate: { year: '1990', month: '12', day: '24' },
      isStillWorking: StillWorking.NOTICE,
    };

    const controller = new StartDateController(mockLogger);

    const req = mockRequest({ body, userCase });
    const res = mockResponse();
    controller.post(req, res);

    expect(req.session.userCase).toEqual({
      dobDate: {
        year: '1990',
        month: '12',
        day: '24',
      },
      startDate: {
        day: '11',
        month: '11',
        year: '2000',
      },
      id: '1234',
      isStillWorking: StillWorking.NOTICE,
    });

    expect(res.redirect).toHaveBeenCalledWith(PageUrls.NOTICE_END);
  });

  it('should redirect to employment end date when NO_LONGER_WORKING is selected', () => {
    const body = {
      'startDate-day': '11',
      'startDate-month': '11',
      'startDate-year': '2000',
    };
    const userCase = {
      dobDate: { year: '1990', month: '12', day: '24' },
      isStillWorking: StillWorking.NO_LONGER_WORKING,
    };

    const controller = new StartDateController(mockLogger);

    const req = mockRequest({ body, userCase });
    const res = mockResponse();
    controller.post(req, res);

    expect(req.session.userCase).toEqual({
      dobDate: {
        year: '1990',
        month: '12',
        day: '24',
      },
      startDate: {
        day: '11',
        month: '11',
        year: '2000',
      },
      id: '1234',
      isStillWorking: StillWorking.NO_LONGER_WORKING,
    });

    expect(res.redirect).toHaveBeenCalledWith(PageUrls.END_DATE);
  });

  it('should run logger in catch block', async () => {
    const body = {
      'startDate-day': '11',
      'startDate-month': '11',
      'startDate-year': '2000',
    };
    const controller = new StartDateController(mockLogger);
    const request = mockRequest({ body });
    const response = mockResponse();

    await controller.post(request, response);

    return caseApi.updateDraftCase(request.session.userCase).then(() => expect(mockLogger.error).toHaveBeenCalled());
  });
});
