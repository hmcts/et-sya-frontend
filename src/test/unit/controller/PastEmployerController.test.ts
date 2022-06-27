import axios from 'axios';
import { LoggerInstance } from 'winston';

import PastEmployerController from '../../../main/controllers/PastEmployerController';
import { AppRequest } from '../../../main/definitions/appRequest';
import { YesOrNo } from '../../../main/definitions/case';
import { PageUrls } from '../../../main/definitions/constants';
import { CaseApi } from '../../../main/services/CaseService';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

jest.mock('axios');
const caseApi = new CaseApi(axios as jest.Mocked<typeof axios>);

describe('Update Past Employer Controller', () => {
  const t = {
    'past-employer': {},
    common: {},
  };

  const mockLogger = {
    error: jest.fn().mockImplementation((message: string) => message),
    info: jest.fn().mockImplementation((message: string) => message),
  } as unknown as LoggerInstance;

  it('should render the Update Preference page', () => {
    const controller = new PastEmployerController(mockLogger);
    const response = mockResponse();
    const request = <AppRequest>mockRequest({ t });
    controller.get(request, response);
    expect(response.render).toHaveBeenCalledWith('past-employer', expect.anything());
  });

  it('should redirect to the same screen when errors are present', () => {
    const errors = [{ propertyName: 'pastEmployer', errorType: 'required' }];
    const body = { pastEmployer: '' };

    const controller = new PastEmployerController(mockLogger);

    const req = mockRequest({ body });
    const res = mockResponse();
    controller.post(req, res);

    expect(res.redirect).toBeCalledWith(req.path);
    expect(req.session.errors).toEqual(errors);
  });

  it('should render are you still working page when the page submitted', () => {
    const body = { pastEmployer: YesOrNo.YES };
    const controller = new PastEmployerController(mockLogger);

    const req = mockRequest({ body });
    const res = mockResponse();
    controller.post(req, res);

    expect(res.redirect).toBeCalledWith(PageUrls.STILL_WORKING);
  });

  it('should add pastEmployer to the session userCase', () => {
    const body = { pastEmployer: YesOrNo.YES };

    const controller = new PastEmployerController(mockLogger);

    const req = mockRequest({ body });
    const res = mockResponse();
    req.session.userCase = undefined;

    controller.post(req, res);

    expect(req.session.userCase).toStrictEqual({
      pastEmployer: YesOrNo.YES,
    });
  });

  it('should run logger in catch block', async () => {
    const body = { pastEmployer: YesOrNo.YES };
    const controller = new PastEmployerController(mockLogger);
    const request = mockRequest({ body });
    const response = mockResponse();

    await controller.post(request, response);

    return caseApi.updateDraftCase(request.session.userCase).then(() => expect(mockLogger.info).toBeCalled());
  });
});
