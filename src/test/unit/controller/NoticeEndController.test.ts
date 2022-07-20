import { AxiosResponse } from 'axios';
import { LoggerInstance } from 'winston';

import NoticeEndController from '../../../main/controllers/NoticeEndController';
import { CaseApiDataResponse } from '../../../main/definitions/api/caseApiResponse';
import { PageUrls, TranslationKeys } from '../../../main/definitions/constants';
import * as caseApi from '../../../main/services/CaseService';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Notice end Controller', () => {
  const t = {
    'notice-end': {},
    common: {},
  };

  const getCaseApiMock = jest.spyOn(caseApi, 'getCaseApi');

  const mockLogger = {
    error: jest.fn().mockImplementation((message: string) => message),
    info: jest.fn().mockImplementation((message: string) => message),
  } as unknown as LoggerInstance;

  it('should render notice end page', () => {
    const noticeEndController = new NoticeEndController(mockLogger);
    const response = mockResponse();
    const request = mockRequest({ t });

    noticeEndController.get(request, response);
    expect(response.render).toHaveBeenCalledWith(TranslationKeys.NOTICE_END, expect.anything());

    const body = { noticeEnds: '' };
    const req = mockRequest({ body });
    const res = mockResponse();
    noticeEndController.post(req, res);
    expect(response.render).toHaveBeenCalledWith(TranslationKeys.NOTICE_END, expect.anything());
  });

  it('should redirect to notice type on successful post', () => {
    const body = {
      'noticeEnds-day': '21',

      'noticeEnds-month': '01',

      'noticeEnds-year': '2023',
    };

    const controller = new NoticeEndController(mockLogger);
    const req = mockRequest({ body });

    const res = mockResponse();

    controller.post(req, res);

    expect(res.redirect).toBeCalledWith(PageUrls.NOTICE_TYPE);
  });

  it('should redirect to the same screen when errors are present', () => {
    const errors = [{ propertyName: 'noticeEnds', errorType: 'dayRequired', fieldName: 'day' }];
    const body = { noticeEnds: '' };
    const controller = new NoticeEndController(mockLogger);
    const req = mockRequest({ body });
    const res = mockResponse();

    controller.post(req, res);
    expect(res.redirect).toBeCalledWith(req.path);
    expect(req.session.errors).toEqual(errors);
  });

  it('should redirect to the same screen when date is in the future', () => {
    const errors = [
      { propertyName: 'noticeEnds', errorType: 'invalidDateMoreThanTenYearsInFuture', fieldName: 'year' },
    ];
    const body = {
      'noticeEnds-day': '23',
      'noticeEnds-month': '11',
      'noticeEnds-year': '2039',
    };
    const controller = new NoticeEndController(mockLogger);
    const req = mockRequest({ body });
    const res = mockResponse();

    controller.post(req, res);
    expect(res.redirect).toBeCalledWith(req.path);
    expect(req.session.errors).toEqual(errors);
  });

  it('should redirect to the same screen when date is in the 10 years past', () => {
    const errors = [{ propertyName: 'noticeEnds', errorType: 'invalidDateInPast', fieldName: 'day' }];
    const body = {
      'noticeEnds-day': '23',
      'noticeEnds-month': '11',
      'noticeEnds-year': '2000',
    };
    const controller = new NoticeEndController(mockLogger);
    const req = mockRequest({ body });
    const res = mockResponse();

    controller.post(req, res);
    expect(res.redirect).toBeCalledWith(req.path);
    expect(req.session.errors).toEqual(errors);
  });

  it('should redirect to the same screen when date fields are empty', () => {
    const errors = [{ propertyName: 'noticeEnds', errorType: 'required', fieldName: 'day' }];
    const body = {
      'noticeEnds-day': '',
      'noticeEnds-month': '',
      'noticeEnds-year': '',
    };
    const controller = new NoticeEndController(mockLogger);
    const req = mockRequest({ body });
    const res = mockResponse();

    controller.post(req, res);
    expect(res.redirect).toBeCalledWith(req.path);
    expect(req.session.errors).toEqual(errors);
  });

  it('should invoke logger in then() block', async () => {
    const body = {
      'noticeEnds-day': '12',
      'noticeEnds-month': '12',
      'noticeEnds-year': `${new Date().getFullYear() + 5}`,
    };
    const controller = new NoticeEndController(mockLogger);
    const request = mockRequest({ body });
    const response = mockResponse();
    const fetchResponse = Promise.resolve({} as AxiosResponse<CaseApiDataResponse>);

    (getCaseApiMock as jest.Mock).mockReturnValue({
      updateDraftCase: jest.fn(() => {
        return fetchResponse;
      }),
    });

    await controller.post(request, response);

    expect(mockLogger.info).toBeCalled();
  });
});
