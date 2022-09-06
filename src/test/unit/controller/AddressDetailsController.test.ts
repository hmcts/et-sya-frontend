import AddressDetailsController from '../../../main/controllers/AddressDetailsController';
import { AppRequest } from '../../../main/definitions/appRequest';
import { PageUrls } from '../../../main/definitions/constants';
import { mockLogger } from '../mocks/mockLogger';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Address details Controller', () => {
  const t = {
    'address-details': {},
    common: {},
  };

  it('should render the Address details controller page', () => {
    const addressDetailsController = new AddressDetailsController(mockLogger);

    const response = mockResponse();
    const userCase = { address1: '10 test street' };
    const request = <AppRequest>mockRequest({ t, userCase });

    addressDetailsController.get(request, response);
    expect(response.render).toHaveBeenCalledWith('address-details', expect.anything());
  });

  describe('post()', () => {
    it('should redirect to the same screen when errors are present', () => {
      const errors = [
        { propertyName: 'address1', errorType: 'required' },
        { propertyName: 'addressTown', errorType: 'required' },
        { propertyName: 'addressCountry', errorType: 'required' },
      ];
      const body = { address1: '' };

      const controller = new AddressDetailsController(mockLogger);

      const req = mockRequest({ body });
      const res = mockResponse();
      controller.post(req, res);

      expect(res.redirect).toBeCalledWith(req.path);
      expect(req.session.errors).toEqual(errors);
    });

    it('should assign userCase from formData', () => {
      const body = {
        address1: '10 test street',
        addressTown: 'test',
        addressCountry: 'country',
        addressPostcode: 'AB1 2CD',
      };

      const controller = new AddressDetailsController(mockLogger);

      const req = mockRequest({ body });
      const res = mockResponse();
      req.session.userCase = undefined;

      controller.post(req, res);

      expect(res.redirect).toBeCalledWith(PageUrls.TELEPHONE_NUMBER);
      expect(req.session.userCase).toStrictEqual({
        address1: '10 test street',
        addressTown: 'test',
        addressCountry: 'country',
        addressPostcode: 'AB1 2CD',
      });
    });
  });
});
