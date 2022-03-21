import PastEmployerController from '../../../main/controllers/PastEmployerController';
import { AppRequest } from '../../../main/definitions/appRequest';
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

    expect(res.redirect).toBeCalledWith(req.path);
    expect(req.session.errors).toEqual(errors);
  });
});
