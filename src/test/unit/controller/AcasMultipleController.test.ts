import AcasMultipleController from '../../../main/controllers/AcasMultipleController';
import { AppRequest } from '../../../main/definitions/appRequest';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Acas Multiple Controller', () => {
  const t = {
    'acas-multiple': {},
    common: {},
  };

  it('should render the AcasMultipleController page', () => {
    const acasMultipleController = new AcasMultipleController();
    const response = mockResponse();
    const request = <AppRequest>mockRequest({ t });

    acasMultipleController.get(request, response);
    expect(response.render).toHaveBeenCalledWith('acas-multiple', expect.anything());
  });

  it('should redirect to the same screen when errors are present', () => {
    const errors = [{ propertyName: 'acasMultiple', errorType: 'required' }];
    const body = { 'acas-multiple': '' };

    const controller = new AcasMultipleController();

    const req = mockRequest({ body });
    const res = mockResponse();
    controller.post(req, res);

    expect(res.redirect).toBeCalledWith(req.path);
    expect(req.session.errors).toEqual(errors);
  });
});
