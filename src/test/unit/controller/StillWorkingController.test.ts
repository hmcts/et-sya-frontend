import StillWorkingController from '../../../main/controllers/StillWorkingController';
import { StillWorking } from '../../../main/definitions/case';
import { PageUrls, TranslationKeys } from '../../../main/definitions/constants';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Are you still working controller', () => {
  const t = {
    isStillWorking: {},
    common: {},
  };

  it('should render are you still working page', () => {
    const controller = new StillWorkingController();

    const response = mockResponse();
    const request = mockRequest({ t });

    controller.get(request, response);

    expect(response.render).toHaveBeenCalledWith(TranslationKeys.STILL_WORKING, expect.anything());
  });

  it('should render the employment details page', () => {
    const body = { isStillWorking: StillWorking.WORKING };
    const controller = new StillWorkingController();

    const req = mockRequest({ body });
    const res = mockResponse();
    controller.post(req, res);
    expect(res.redirect).toBeCalledWith(PageUrls.JOB_TITLE);
  });

  it('should render same page if nothing selected', () => {
    const errors = [{ propertyName: 'isStillWorking', errorType: 'required' }];
    const body = { isStillWorking: '' };
    const controller = new StillWorkingController();

    const req = mockRequest({ body });
    const res = mockResponse();
    controller.post(req, res);

    expect(res.redirect).toBeCalledWith(req.path);
    expect(req.session.errors).toEqual(errors);
  });

  it('should render the job title page when the page submitted', () => {
    const body = { isStillWorking: StillWorking.WORKING };
    const controller = new StillWorkingController();

    const req = mockRequest({ body });
    const res = mockResponse();
    controller.post(req, res);

    expect(res.redirect).toBeCalledWith(PageUrls.JOB_TITLE);
  });

  it('should add isStillWorking to the session userCase', () => {
    const body = { isStillWorking: StillWorking.WORKING };

    const controller = new StillWorkingController();
    const req = mockRequest({ body });
    const res = mockResponse();
    req.session.userCase = undefined;

    controller.post(req, res);

    expect(res.redirect).toBeCalledWith(PageUrls.JOB_TITLE);
    expect(req.session.userCase).toStrictEqual({
      isStillWorking: StillWorking.WORKING,
    });
  });

  it('should redirect to the same screen when errors are present', () => {
    const errors = [{ propertyName: 'isStillWorking', errorType: 'required' }];
    const body = {
      isStillWorking: '',
    };

    const controller = new StillWorkingController();

    const req = mockRequest({ body });
    const res = mockResponse();
    controller.post(req, res);

    expect(res.redirect).toBeCalledWith(req.path);
    expect(req.session.errors).toEqual(errors);
  });
});
