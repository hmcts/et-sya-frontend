import { LoggerInstance } from 'winston';

import EmploymentAndRespondentCheckController from '../../../main/controllers/EmploymentAndRespondentCheckController';
import { YesOrNo } from '../../../main/definitions/case';
import { PageUrls, TranslationKeys } from '../../../main/definitions/constants';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Test task List check controller', () => {
  const t = {
    employmentAndRespondentCheck: {},
    common: {},
  };

  const mockLogger = {
    error: jest.fn().mockImplementation((message: string) => message),
    info: jest.fn().mockImplementation((message: string) => message),
  } as unknown as LoggerInstance;

  it('should render the task list check page', () => {
    const controller = new EmploymentAndRespondentCheckController(mockLogger);

    const response = mockResponse();
    const request = mockRequest({ t });

    controller.get(request, response);

    expect(response.render).toHaveBeenCalledWith(TranslationKeys.TASK_LIST_CHECK, expect.anything());
  });

  it('should render the claim steps page', () => {
    const body = { employmentAndRespondentCheck: YesOrNo.YES };
    const controller = new EmploymentAndRespondentCheckController(mockLogger);

    const req = mockRequest({ body });
    const res = mockResponse();
    controller.post(req, res);
    expect(res.redirect).toBeCalledWith(PageUrls.CLAIM_STEPS);
  });

  it('should render same page if nothing selected', () => {
    const errors = [{ propertyName: 'employmentAndRespondentCheck', errorType: 'required' }];
    const body = { employmentAndRespondentCheck: '' };
    const controller = new EmploymentAndRespondentCheckController(mockLogger);

    const req = mockRequest({ body });
    const res = mockResponse();
    controller.post(req, res);

    expect(res.redirect).toBeCalledWith(req.path);
    expect(req.session.errors).toEqual(errors);
  });

  it('should render the claim steps page when there is a return url', () => {
    const body = { employmentAndRespondentCheck: YesOrNo.YES };
    const controller = new EmploymentAndRespondentCheckController(mockLogger);

    const req = mockRequest({ body });
    const res = mockResponse();

    req.url = PageUrls.EMPLOYMENT_RESPONDENT_TASK_CHECK;
    req.session.returnUrl = PageUrls.RESPONDENT_DETAILS_CHECK;

    controller.post(req, res);
    expect(res.redirect).toBeCalledWith(PageUrls.CLAIM_STEPS);
    expect(req.session.returnUrl).toBeUndefined();
  });
});
