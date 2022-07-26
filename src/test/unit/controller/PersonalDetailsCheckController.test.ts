import { AxiosResponse } from 'axios';
import { LoggerInstance } from 'winston';

import PersonalDetailsCheckController from '../../../main/controllers/PersonalDetailsCheckController';
import { CaseApiDataResponse } from '../../../main/definitions/api/caseApiResponse';
import { YesOrNo } from '../../../main/definitions/case';
import { PageUrls, TranslationKeys } from '../../../main/definitions/constants';
import * as caseApi from '../../../main/services/CaseService';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Test task List check controller', () => {
  const t = {
    personalDetailsCheck: {},
    common: {},
  };
  const getCaseApiMock = jest.spyOn(caseApi, 'getCaseApi');

  const mockLogger = {
    error: jest.fn().mockImplementation((message: string) => message),
    info: jest.fn().mockImplementation((message: string) => message),
  } as unknown as LoggerInstance;

  it('should render the task list check page', () => {
    const controller = new PersonalDetailsCheckController(mockLogger);

    const response = mockResponse();
    const request = mockRequest({ t });

    controller.get(request, response);

    expect(response.render).toHaveBeenCalledWith(TranslationKeys.TASK_LIST_CHECK, expect.anything());
  });

  it('should render the claim steps page', () => {
    const body = { personalDetailsCheck: YesOrNo.YES };
    const controller = new PersonalDetailsCheckController(mockLogger);

    const req = mockRequest({ body });
    const res = mockResponse();
    controller.post(req, res);
    expect(res.redirect).toBeCalledWith(PageUrls.CLAIM_STEPS);
  });

  it('should render same page if nothing selected', () => {
    const errors = [{ propertyName: 'personalDetailsCheck', errorType: 'required' }];
    const body = { personalDetailsCheck: '' };
    const controller = new PersonalDetailsCheckController(mockLogger);

    const req = mockRequest({ body });
    const res = mockResponse();
    controller.post(req, res);

    expect(res.redirect).toBeCalledWith(req.path);
    expect(req.session.errors).toEqual(errors);
  });

  it('should invoke logger in then() block', async () => {
    const body = { personalDetailsCheck: YesOrNo.NO };
    const controller = new PersonalDetailsCheckController(mockLogger);
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
