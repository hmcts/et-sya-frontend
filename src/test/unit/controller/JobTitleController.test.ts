import JobTitleController from '../../../main/controllers/JobTitleController';
import * as CaseHelper from '../../../main/controllers/helpers/CaseHelpers';
import { PageUrls } from '../../../main/definitions/constants';
import { mockRequest, mockRequestEmpty } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

jest.spyOn(CaseHelper, 'handleUpdateDraftCase').mockImplementation(() => Promise.resolve());
describe('Job Title Controller', () => {
  const t = {
    'job-title': {},
    common: {},
  };

  it('should render the Job Title page', () => {
    const controller = new JobTitleController();

    const response = mockResponse();
    const request = mockRequest({ t });

    controller.get(request, response);

    expect(response.render).toHaveBeenCalledWith('job-title', expect.anything());
  });

  describe('post()', () => {
    it('should not return an error when the job title is empty', async () => {
      const body = {
        jobTitle: '',
      };
      const controller = new JobTitleController();

      const req = mockRequestEmpty({ body });
      const res = mockResponse();

      await controller.post(req, res);

      expect(res.redirect).toHaveBeenCalledWith(PageUrls.START_DATE);
      expect(req.session.errors).toHaveLength(0);
    });

    it('should add the job title to the session userCase', async () => {
      const body = { jobTitle: 'Vice President Branch Co-Manager' };

      const controller = new JobTitleController();

      const req = mockRequestEmpty({ body });
      const res = mockResponse();

      await controller.post(req, res);

      expect(res.redirect).toHaveBeenCalledWith(PageUrls.START_DATE);
      expect(req.session.userCase).toStrictEqual({
        jobTitle: 'Vice President Branch Co-Manager',
      });
    });
  });

  it('should redirect to respondent details check if there is a returnUrl', async () => {
    const body = { jobTitle: 'Assistant Vice President Branch Manager' };

    const controller = new JobTitleController();

    const req = mockRequest({ body });
    const res = mockResponse();

    req.session.returnUrl = PageUrls.CHECK_ANSWERS;

    await controller.post(req, res);

    expect(res.redirect).toHaveBeenCalledWith(PageUrls.CHECK_ANSWERS);
  });
});
