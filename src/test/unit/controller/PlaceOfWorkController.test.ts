import PlaceOfWorkController from '../../../main/controllers/PlaceOfWorkController';
import { PageUrls } from '../../../main/definitions/constants';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Place Of Work Controller Tests', () => {
  const t = {
    'place-of-work': {},
    'enter-address': {},
    common: {},
  };

  it('should render place of work page', () => {
    const controller = new PlaceOfWorkController();
    const response = mockResponse();
    const request = mockRequest({ t });

    controller.get(request, response);

    expect(response.render).toHaveBeenCalledWith('place-of-work', expect.anything());
  });

  it('should redirect back to self if there are errors', () => {
    const errors = [{ propertyName: 'workAddress1', errorType: 'required' }];
    const body = {
      workAddress1: '',
      workAddress12: '',
      workAddressTown: 'Exeter',
      workAddressCounty: '',
      workAddressPostcode: 'EX7 8KK',
    };
    const controller = new PlaceOfWorkController();

    const req = mockRequest({ body });
    const res = mockResponse();

    controller.post(req, res);

    expect(res.redirect).toBeCalledWith(req.path);
    expect(req.session.errors).toEqual(errors);
  });

  it('should redirect to Acas number page if no errors', () => {
    const body = {
      workAddress1: '31 The Street',
      workAddress12: '',
      workAddressTown: 'Exeter',
      workAddressCounty: '',
      workAddressPostcode: 'EX7 8KK',
    };
    const controller = new PlaceOfWorkController();

    const req = mockRequest({ body });
    const res = mockResponse();

    controller.post(req, res);

    expect(res.redirect).toBeCalledWith(PageUrls.ACAS_CERT_NUM);
    expect(req.session.errors).toEqual([]);
  });
});
