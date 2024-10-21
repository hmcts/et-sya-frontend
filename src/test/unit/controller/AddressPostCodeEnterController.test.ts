import AddressPostCodeEnterController from '../../../main/controllers/AddressPostCodeEnterController';
import { returnValidUrl } from '../../../main/controllers/helpers/RouterHelpers';
import { PageUrls } from '../../../main/definitions/constants';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Address Postcode Enter Controller', () => {
  const t = {
    'address-postcode-enter': {},
    common: {},
  };

  it('should render the Address Enter Postcode page', () => {
    const response = mockResponse();
    const request = mockRequest({ t });

    new AddressPostCodeEnterController().get(request, response);

    expect(response.render).toHaveBeenCalledWith('address-postcode-enter', expect.anything());
  });

  describe('post()', () => {
    it("should return a 'required' error when the postcode field is empty", () => {
      const body = {
        addressEnterPostcode: '',
      };
      const errors = [{ propertyName: 'addressEnterPostcode', errorType: 'required' }];

      const req = mockRequest({ body });
      const res = mockResponse();
      new AddressPostCodeEnterController().post(req, res);

      expect(res.redirect).toHaveBeenCalledWith(returnValidUrl(req.path, Object.values(PageUrls)));
      expect(req.session.errors).toEqual(errors);
    });

    it('should set the addressEnterPostCode value in userCase', () => {
      const postCode = 'G44 5TY';
      const body = { addressEnterPostcode: postCode };

      const req = mockRequest({ body });
      const res = mockResponse();
      new AddressPostCodeEnterController().post(req, res);
      expect(req.session.userCase.addressEnterPostcode).toEqual(postCode);
    });

    it('should redirect to the same screen when no postcode is entered', async () => {
      const errors = [{ propertyName: 'addressEnterPostcode', errorType: 'required' }];
      const body = { addressEnterPostcode: '' };

      const controller = new AddressPostCodeEnterController();

      const req = mockRequest({ body });
      const res = mockResponse();
      await controller.post(req, res);

      expect(res.redirect).toHaveBeenCalledWith(returnValidUrl(req.path, Object.values(PageUrls)));
      expect(req.session.errors).toEqual(errors);
    });

    it('should redirect to the same screen when wrong postcode is entered', async () => {
      const errors = [{ propertyName: 'addressEnterPostcode', errorType: 'invalid' }];
      const body = { addressEnterPostcode: 'G44 555' };

      const controller = new AddressPostCodeEnterController();

      const req = mockRequest({ body });
      const res = mockResponse();
      await controller.post(req, res);

      expect(res.redirect).toHaveBeenCalledWith(returnValidUrl(req.path, Object.values(PageUrls)));
      expect(req.session.errors).toEqual(errors);
    });
  });
});
