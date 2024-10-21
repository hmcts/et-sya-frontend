import AcasMultipleController from '../../../main/controllers/AcasMultipleController';
import { returnValidUrl } from '../../../main/controllers/helpers/RouterHelpers';
import { AppRequest } from '../../../main/definitions/appRequest';
import { PageUrls } from '../../../main/definitions/constants';
import { mockRequest, mockRequestEmpty } from '../mocks/mockRequest';
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
    const body = { acasMultiple: '' };

    const controller = new AcasMultipleController();

    const req = mockRequest({ body });
    const res = mockResponse();
    controller.post(req, res);

    expect(res.redirect).toHaveBeenCalledWith(returnValidUrl(req.path, Object.values(PageUrls)));
    expect(req.session.errors).toEqual(errors);
  });

  it('should add Yes selection to user case and continue to Type of claim page', () => {
    const body = { acasMultiple: 'Yes' };

    const controller = new AcasMultipleController();

    const req = mockRequestEmpty({ body });
    const res = mockResponse();
    controller.post(req, res);

    expect(res.redirect).toHaveBeenCalledWith(PageUrls.TYPE_OF_CLAIM);
    expect(req.session.userCase).toEqual(body);
  });
});
