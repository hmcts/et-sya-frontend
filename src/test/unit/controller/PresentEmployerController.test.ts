import PresentEmployerController from '../../../main/controllers/PresentEmployerController';
import { AppRequest } from '../../../main/definitions/appRequest';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Update present Employer Controller', () => {
  const t = {
    'present-employer': {},
    common: {},
  };

  it('should render the Update Preference page', () => {
    const controller = new PresentEmployerController();
    const response = mockResponse();
    const request = <AppRequest>mockRequest({ t });

    controller.get(request, response);
    expect(response.render).toHaveBeenCalledWith('present-employer', expect.anything());
  });

  it('should redirect to the same screen when errors are present', () => {
    const errors = [{ propertyName: 'presentEmployer', errorType: 'required' }];
    const body = { presentEmployer: '' };

    const controller = new PresentEmployerController();

    const req = mockRequest({ body });
    const res = mockResponse();
    controller.post(req, res);

    expect(res.redirect).toBeCalledWith(req.path);
    expect(req.session.errors).toEqual(errors);
  });
});
