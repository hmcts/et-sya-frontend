import { LoggerInstance } from 'winston';

import EndDateController from '../../../main/controllers/EndDateController';
import { TranslationKeys } from '../../../main/definitions/constants';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('End date Controller', () => {
  const t = {
    'end-date': {},
    common: {},
  };

  const mockLogger = {
    error: jest.fn().mockImplementation((message: string) => message),
    info: jest.fn().mockImplementation((message: string) => message),
  } as unknown as LoggerInstance;

  it('should render end date page', () => {
    const endDateController = new EndDateController(mockLogger);
    const response = mockResponse();
    const request = mockRequest({ t });

    endDateController.get(request, response);
    expect(response.render).toHaveBeenCalledWith(TranslationKeys.END_DATE, expect.anything());
  });

  it('should redirect to the same screen when date is in the future', () => {
    const errors = [{ propertyName: 'endDate', errorType: 'invalidDateInFuture', fieldName: 'day' }];
    const body = {
      'endDate-day': '23',
      'endDate-month': '11',
      'endDate-year': '2039',
    };

    const controller = new EndDateController(mockLogger);

    const req = mockRequest({ body });
    const res = mockResponse();
    controller.post(req, res);

    expect(req.session.userCase).toEqual({
      dobDate: {
        year: '2000',
        month: '12',
        day: '24',
      },
      endDate: {
        day: '23',
        month: '11',
        year: '2039',
      },
      id: '1234',
      startDate: {
        day: '21',
        month: '04',
        year: '2019',
      },
    });

    expect(res.redirect).toHaveBeenCalledWith(req.path);
    expect(req.session.errors).toEqual(errors);
  });

  it('should redirect to the same screen when date is in the 10 years past', () => {
    const errors = [{ propertyName: 'endDate', errorType: 'invalidDateMoreThanTenYearsInPast', fieldName: 'year' }];
    const body = {
      'endDate-day': '23',
      'endDate-month': '11',
      'endDate-year': '2000',
    };

    const controller = new EndDateController(mockLogger);

    const req = mockRequest({ body });
    const res = mockResponse();
    controller.post(req, res);

    expect(req.session.userCase).toEqual({
      dobDate: {
        year: '2000',
        month: '12',
        day: '24',
      },
      endDate: {
        day: '23',
        month: '11',
        year: '2000',
      },
      id: '1234',
      startDate: {
        day: '21',
        month: '04',
        year: '2019',
      },
    });

    expect(res.redirect).toHaveBeenCalledWith(req.path);
    expect(req.session.errors).toEqual(errors);
  });

  it('should redirect to the same screen when day is empty', () => {
    const errors = [{ propertyName: 'endDate', errorType: 'dayRequired', fieldName: 'day' }];
    const body = {
      'endDate-day': '',
      'endDate-month': '11',
      'endDate-year': '2000',
    };

    const controller = new EndDateController(mockLogger);

    const req = mockRequest({ body });
    const res = mockResponse();
    controller.post(req, res);

    expect(req.session.userCase).toEqual({
      dobDate: {
        year: '2000',
        month: '12',
        day: '24',
      },
      endDate: {
        day: '',
        month: '11',
        year: '2000',
      },
      id: '1234',
      startDate: {
        day: '21',
        month: '04',
        year: '2019',
      },
    });

    expect(res.redirect).toHaveBeenCalledWith(req.path);
    expect(req.session.errors).toEqual(errors);
  });

  it('should redirect to the same screen when date fields are empty', () => {
    const errors = [{ propertyName: 'endDate', errorType: 'required', fieldName: 'day' }];
    const body = {
      'endDate-day': '',
      'endDate-month': '',
      'endDate-year': '',
    };

    const controller = new EndDateController(mockLogger);

    const req = mockRequest({ body });
    const res = mockResponse();
    controller.post(req, res);

    expect(req.session.userCase).toEqual({
      dobDate: {
        year: '2000',
        month: '12',
        day: '24',
      },
      endDate: {
        day: '',
        month: '',
        year: '',
      },
      id: '1234',
      startDate: {
        day: '21',
        month: '04',
        year: '2019',
      },
    });

    expect(res.redirect).toHaveBeenCalledWith(req.path);
    expect(req.session.errors).toEqual(errors);
  });
});
