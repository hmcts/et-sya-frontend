import PastEmployerController from '../../../main/controllers/PastEmployerController';
import { AppRequest } from '../../../main/definitions/appRequest';
import { YesOrNo } from '../../../main/definitions/case';
import { PageUrls } from '../../../main/definitions/constants';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Update Past Employer Controller', () => {
  const t = {
    'past-employer': {},
    common: {},
  };

  it('should render the Update Preference page', () => {
    const controller = new PastEmployerController();
    const response = mockResponse();
    const request = <AppRequest>mockRequest({ t });
    controller.get(request, response);
    expect(response.render).toHaveBeenCalledWith('past-employer', expect.anything());
  });

  it('should redirect to the same screen when errors are present', () => {
    const errors = [{ propertyName: 'pastEmployer', errorType: 'required' }];
    const body = { pastEmployer: '' };

    const controller = new PastEmployerController();

    const req = mockRequest({ body });
    const res = mockResponse();
    controller.post(req, res);

    expect(res.redirect).toHaveBeenCalledWith(req.path);
    expect(req.session.errors).toEqual(errors);
  });

  it('should render are you still working page when the page submitted', () => {
    const body = { pastEmployer: YesOrNo.YES };
    const controller = new PastEmployerController();

    const req = mockRequest({ body });
    const res = mockResponse();
    controller.post(req, res);

    expect(res.redirect).toHaveBeenCalledWith(PageUrls.STILL_WORKING);
  });

  it('should add pastEmployer to the session userCase', () => {
    const body = { pastEmployer: YesOrNo.YES };

    const controller = new PastEmployerController();

    const req = mockRequest({ body });
    const res = mockResponse();
    req.session.userCase = undefined;

    controller.post(req, res);

    expect(req.session.userCase).toStrictEqual({
      pastEmployer: YesOrNo.YES,
    });
  });
});
