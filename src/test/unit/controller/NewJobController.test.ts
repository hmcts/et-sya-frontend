import NewJobController from '../../../main/controllers/NewJobController';
import { YesOrNo } from '../../../main/definitions/case';
import { PageUrls, TranslationKeys } from '../../../main/definitions/constants';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('New Job Controller', () => {
  const t = {
    'new-job': {},
    common: {},
  };

  it('should render the New Job Choice page', () => {
    const controller = new NewJobController();
    const response = mockResponse();
    const request = mockRequest({ t });
    controller.get(request, response);
    expect(response.render).toHaveBeenCalledWith(TranslationKeys.NEW_JOB, expect.anything());
  });

  it('should render the home page when no radio button is selected', () => {
    const body = { newJob: YesOrNo.NO };
    const controller = new NewJobController();

    const req = mockRequest({ body });
    const res = mockResponse();
    controller.post(req, res);

    expect(res.redirect).toBeCalledWith(PageUrls.FIRST_RESPONDENT_NAME);
  });

  it('should render the new job start date page when yes radio button is selected', () => {
    const body = { newJob: YesOrNo.YES };
    const controller = new NewJobController();

    const req = mockRequest({ body });
    const res = mockResponse();
    controller.post(req, res);

    expect(res.redirect).toBeCalledWith(PageUrls.NEW_JOB_START_DATE);
  });
});
