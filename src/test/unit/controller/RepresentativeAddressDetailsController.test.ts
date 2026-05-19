import RepresentativeAddressDetailsController from '../../../main/controllers/RepresentativeAddressDetailsController';
import * as CaseHelper from '../../../main/controllers/helpers/CaseHelpers';
import { PageUrls } from '../../../main/definitions/constants';
import { mockRequest, mockRequestEmpty } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

jest.spyOn(CaseHelper, 'handleUpdateDraftCase').mockImplementation(() => Promise.resolve());

describe('Representative Address Details Controller', () => {
  const t = {
    'representative-address-details': {},
    'enter-address': {},
    common: {},
  };

  describe('get()', () => {
    it('should render the Representative Address Details page', () => {
      const controller = new RepresentativeAddressDetailsController();
      const response = mockResponse();
      const request = mockRequest({ t });

      controller.get(request, response);

      expect(response.render).toHaveBeenCalledWith('representative-address-details', expect.anything());
    });

    it('should pre-populate address fields when an address type has been selected', () => {
      const controller = new RepresentativeAddressDetailsController();
      const response = mockResponse();
      const request = mockRequest({
        t,
        userCase: {
          representativeAddressTypes: [
            { selected: true, label: '1 address found' },
            { value: 0, label: '1 The Street, London, SW1A 1AA' },
          ],
          representativeAddresses: [
            {
              street1: '1 The Street',
              street2: '',
              town: 'London',
              country: 'England',
              postcode: 'SW1A 1AA',
              fullAddress: '1 The Street, London, SW1A 1AA',
            },
          ],
        },
      });

      controller.get(request, response);

      expect(response.render).toHaveBeenCalledWith('representative-address-details', expect.anything());
    });
  });

  describe('post()', () => {
    it('should redirect to the representative phone number page on valid submission', async () => {
      const body = {
        repAddress1: '1 The Street',
        repAddress2: '',
        repAddressTown: 'London',
        repAddressCountry: 'England',
        repAddressPostcode: 'SW1A 1AA',
      };
      const controller = new RepresentativeAddressDetailsController();
      const req = mockRequestEmpty({ body });
      const res = mockResponse();

      await controller.post(req, res);

      expect(res.redirect).toHaveBeenCalledWith(PageUrls.REPRESENTATIVE_PHONE_NUMBER);
      expect(req.session.errors).toHaveLength(0);
    });

    it('should return a required error when address line 1 is empty', async () => {
      const body = {
        repAddress1: '',
        repAddressTown: 'London',
        repAddressCountry: 'England',
      };
      const controller = new RepresentativeAddressDetailsController();
      const req = mockRequestEmpty({ body });
      const res = mockResponse();

      await controller.post(req, res);

      expect(res.redirect).toHaveBeenCalledWith(req.path);
      expect(req.session.errors).toEqual(
        expect.arrayContaining([{ propertyName: 'repAddress1', errorType: 'required' }])
      );
    });

    it('should return a required error when town is empty', async () => {
      const body = {
        repAddress1: '1 The Street',
        repAddressTown: '',
        repAddressCountry: 'England',
      };
      const controller = new RepresentativeAddressDetailsController();
      const req = mockRequestEmpty({ body });
      const res = mockResponse();

      await controller.post(req, res);

      expect(res.redirect).toHaveBeenCalledWith(req.path);
      expect(req.session.errors).toEqual(
        expect.arrayContaining([{ propertyName: 'repAddressTown', errorType: 'required' }])
      );
    });

    it('should return a required error when country is empty', async () => {
      const body = {
        repAddress1: '1 The Street',
        repAddressTown: 'London',
        repAddressCountry: '',
      };
      const controller = new RepresentativeAddressDetailsController();
      const req = mockRequestEmpty({ body });
      const res = mockResponse();

      await controller.post(req, res);

      expect(res.redirect).toHaveBeenCalledWith(req.path);
      expect(req.session.errors).toEqual(
        expect.arrayContaining([{ propertyName: 'repAddressCountry', errorType: 'required' }])
      );
    });

    it('should accept a submission without address line 2 and postcode as they are optional', async () => {
      const body = {
        repAddress1: '1 The Street',
        repAddress2: '',
        repAddressTown: 'London',
        repAddressCountry: 'England',
        repAddressPostcode: '',
      };
      const controller = new RepresentativeAddressDetailsController();
      const req = mockRequestEmpty({ body });
      const res = mockResponse();

      await controller.post(req, res);

      expect(res.redirect).toHaveBeenCalledWith(PageUrls.REPRESENTATIVE_PHONE_NUMBER);
      expect(req.session.errors).toHaveLength(0);
    });

    it('should save the address fields to userCase', async () => {
      const body = {
        repAddress1: '1 The Street',
        repAddress2: 'Flat 2',
        repAddressTown: 'London',
        repAddressCountry: 'England',
        repAddressPostcode: 'SW1A 1AA',
      };
      const controller = new RepresentativeAddressDetailsController();
      const req = mockRequestEmpty({ body });
      const res = mockResponse();

      await controller.post(req, res);

      expect(req.session.userCase).toMatchObject({
        repAddress1: '1 The Street',
        repAddress2: 'Flat 2',
        repAddressTown: 'London',
        repAddressCountry: 'England',
        repAddressPostcode: 'SW1A 1AA',
      });
    });
  });
});
