import AddressDetailsController from '../../../main/controllers/AddressDetailsController';
import * as CaseHelper from '../../../main/controllers/helpers/CaseHelpers';
import { AppRequest } from '../../../main/definitions/appRequest';
import { PageUrls } from '../../../main/definitions/constants';
import { mockRequest, mockRequestEmpty } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

jest.spyOn(CaseHelper, 'handleUpdateDraftCase').mockImplementation(() => Promise.resolve());

describe('Address details Controller', () => {
  const t = {
    'address-details': {},
    common: {},
  };

  it('should render the Address details controller page', () => {
    const addressDetailsController = new AddressDetailsController();

    const response = mockResponse();
    const userCase = { address1: '10 test street' };
    const request = <AppRequest>mockRequest({ t, userCase });

    addressDetailsController.get(request, response);
    expect(response.render).toHaveBeenCalledWith('address-details', expect.anything());
  });

  describe('post()', () => {
    it('should redirect to the same screen when errors are present', async () => {
      const errors = [
        { propertyName: 'address1', errorType: 'required' },
        { propertyName: 'addressTown', errorType: 'required' },
        { propertyName: 'addressCountry', errorType: 'required' },
      ];
      const body = { address1: '' };

      const controller = new AddressDetailsController();

      const req = mockRequest({ body });
      const res = mockResponse();
      await await controller.post(req, res);

      expect(res.redirect).toHaveBeenCalledWith(req.path);
      expect(req.session.errors).toEqual(errors);
    });

    it('should assign userCase from formData', async () => {
      const body = {
        address1: '10 test street',
        addressTown: 'test',
        addressCountry: 'country',
        addressPostcode: 'AB1 2CD',
      };

      const controller = new AddressDetailsController();

      const req = mockRequestEmpty({ body });
      const res = mockResponse();

      await await controller.post(req, res);

      expect(res.redirect).toHaveBeenCalledWith(PageUrls.TELEPHONE_NUMBER);
      expect(req.session.userCase).toStrictEqual({
        address1: '10 test street',
        addressTown: 'test',
        addressCountry: 'country',
        addressPostcode: 'AB1 2CD',
      });
    });
  });
});
