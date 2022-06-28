import axios from 'axios';
import { LoggerInstance } from 'winston';

import JobTitleController from '../../../main/controllers/JobTitleController';
import { PageUrls } from '../../../main/definitions/constants';
import { FormError } from '../../../main/definitions/form';
import { CaseApi } from '../../../main/services/CaseService';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

jest.mock('axios');
const caseApi = new CaseApi(axios as jest.Mocked<typeof axios>);

describe('Job Title Controller', () => {
  const t = {
    'job-title': {},
    common: {},
  };

  const mockLogger = {
    error: jest.fn().mockImplementation((message: string) => message),
    info: jest.fn().mockImplementation((message: string) => message),
  } as unknown as LoggerInstance;

  it('should render the Job Title page', () => {
    const controller = new JobTitleController(mockLogger);

    const response = mockResponse();
    const request = mockRequest({ t });

    controller.get(request, response);

    expect(response.render).toHaveBeenCalledWith('job-title', expect.anything());
  });

  describe('post()', () => {
    it('should not return an error when the job title is empty', () => {
      const body = {
        jobTitle: '',
      };
      const errors: FormError[] = [];
      const controller = new JobTitleController(mockLogger);

      const req = mockRequest({ body });
      const res = mockResponse();
      req.session.userCase = undefined;

      controller.post(req, res);

      expect(res.redirect).toBeCalledWith(PageUrls.START_DATE);
      expect(req.session.errors).toEqual(errors);
    });

    it('should add the job title to the session userCase', () => {
      const body = { jobTitle: 'Vice President Branch Co-Manager' };

      const controller = new JobTitleController(mockLogger);

      const req = mockRequest({ body });
      const res = mockResponse();
      req.session.userCase = undefined;

      controller.post(req, res);

      expect(res.redirect).toBeCalledWith(PageUrls.START_DATE);
      expect(req.session.userCase).toStrictEqual({
        jobTitle: 'Vice President Branch Co-Manager',
      });
    });

    it('should run logger in catch block', async () => {
      const body = { jobTitle: 'Vice President Branch Co-Manager' };
      const controller = new JobTitleController(mockLogger);
      const request = mockRequest({ body });
      const response = mockResponse();

      await controller.post(request, response);

      return caseApi.updateDraftCase(request.session.userCase).then(() => expect(mockLogger.info).toBeCalled());
    });
  });
});
