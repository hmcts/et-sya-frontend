import JobTitleController from '../../../main/controllers/job_title/JobTitleController';
import { FormContent } from '../../../main/definitions/form';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Job Title Controller', () => {
  const t = {
    'job-title': {},
    common: {},
  };

  const mockFormContent = {
    fields: {
      jobTitle: {
        id: 'job-title',
        name: 'job-title',
        type: 'text',
        classes: 'govuk-!-width-one-half',
      },
    },
  } as unknown as FormContent;

  it('should render the Job Title page', () => {
    const controller = new JobTitleController(mockFormContent);

    const response = mockResponse();
    const request = mockRequest({ t });

    controller.get(request, response);

    expect(response.render).toHaveBeenCalledWith('job-title', expect.anything());
  });

  describe('post()', () => {
    it('should not return an errors when the job title is empty', () => {
      const body = {
        jobTitle: '',
      };
      const errors: any[] = [];
      const controller = new JobTitleController(mockFormContent);

      const req = mockRequest({ body });
      const res = mockResponse();
      req.session.userCase = undefined;

      controller.post(req, res);

      expect(res.redirect).toBeCalledWith('/');
      expect(req.session.errors).toEqual(errors);
    });

    it('should add the jobtile to the session userCase', () => {
      const body = { jobTitle: 'Vice President Branch Co-Manager' };

      const controller = new JobTitleController(mockFormContent);

      const req = mockRequest({ body });
      const res = mockResponse();
      req.session.userCase = undefined;

      controller.post(req, res);

      expect(res.redirect).toBeCalledWith('/');
      expect(req.session.userCase).toStrictEqual({
        jobTitle: 'Vice President Branch Co-Manager',
      });
    });
  });
});
