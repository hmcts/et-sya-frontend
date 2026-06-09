import * as CaseHelper from '../../../../main/controllers/helpers/CaseHelpers';
import RepresentedClaimantAddressDetailsController from '../../../../main/controllers/non-hmcts/RepresentedClaimantAddressDetailsController';
import { AddressType } from '../../../../main/definitions/case';
import { PageUrls } from '../../../../main/definitions/constants';
import { mockRequest, mockRequestEmpty } from '../../mocks/mockRequest';
import { mockResponse } from '../../mocks/mockResponse';

jest.spyOn(CaseHelper, 'handleUpdateDraftCase').mockImplementation(() => Promise.resolve());

describe('Represented Claimant Address Details Controller', () => {
  const t = {
    'non-hmcts/represented-claimant-address-details': {},
    'enter-address': {},
    common: {},
  };

  describe('get()', () => {
    it('should render the Represented Claimant Address Details page', () => {
      const controller = new RepresentedClaimantAddressDetailsController();
      const response = mockResponse();
      const request = mockRequest({ t });

      controller.get(request, response);

      expect(response.render).toHaveBeenCalledWith('non-hmcts/represented-claimant-address-details', expect.anything());
    });

    it('should pre-populate address fields when an address type has been selected', () => {
      const controller = new RepresentedClaimantAddressDetailsController();
      const response = mockResponse();
      const request = mockRequest({
        t,
        userCase: {
          representedClaimantAddressTypes: 0 as unknown as AddressType[],
          representedClaimantAddresses: [
            {
              street1: '1 The Street',
              street2: '',
              town: 'London',
              country: 'England',
              postcode: 'SW1A 1AA',
              fullAddress: '1 The Street, London, LE5 5HD',
            },
          ],
        },
      });

      controller.get(request, response);

      expect(request.session.userCase).toMatchObject({
        representedClaimantAddress1: '1 The Street',
        representedClaimantAddress2: '',
        representedClaimantAddressTown: 'London',
        representedClaimantAddressCountry: 'England',
        representedClaimantAddressPostcode: 'SW1A 1AA',
      });
      expect(response.render).toHaveBeenCalledWith('non-hmcts/represented-claimant-address-details', expect.anything());
    });
  });

  describe('post()', () => {
    it('should redirect to the represented claimant email page on valid submission', async () => {
      const body = {
        representedClaimantAddress1: '1 The Street',
        representedClaimantAddress2: '',
        representedClaimantAddressTown: 'London',
        representedClaimantAddressCountry: 'England',
        representedClaimantAddressPostcode: 'LE5 5HD',
      };
      const controller = new RepresentedClaimantAddressDetailsController();
      const req = mockRequestEmpty({ body });
      const res = mockResponse();

      await controller.post(req, res);

      expect(res.redirect).toHaveBeenCalledWith(PageUrls.REPRESENTED_CLAIMANT_ENTER_EMAIL);
      expect(req.session.errors).toHaveLength(0);
    });

    it('should return a required error when address line 1 is empty', async () => {
      const body = {
        representedClaimantAddress1: '',
        representedClaimantAddressTown: 'London',
        representedClaimantAddressCountry: 'England',
      };
      const controller = new RepresentedClaimantAddressDetailsController();
      const req = mockRequestEmpty({ body });
      const res = mockResponse();

      await controller.post(req, res);

      expect(res.redirect).toHaveBeenCalledWith(req.path);
      expect(req.session.errors).toEqual(
        expect.arrayContaining([{ propertyName: 'representedClaimantAddress1', errorType: 'required' }])
      );
    });

    it('should return a required error when town is empty', async () => {
      const body = {
        representedClaimantAddress1: '1 The Street',
        representedClaimantAddressTown: '',
        representedClaimantAddressCountry: 'England',
      };
      const controller = new RepresentedClaimantAddressDetailsController();
      const req = mockRequestEmpty({ body });
      const res = mockResponse();

      await controller.post(req, res);

      expect(res.redirect).toHaveBeenCalledWith(req.path);
      expect(req.session.errors).toEqual(
        expect.arrayContaining([{ propertyName: 'representedClaimantAddressTown', errorType: 'required' }])
      );
    });

    it('should return a required error when country is empty', async () => {
      const body = {
        representedClaimantAddress1: '1 The Street',
        representedClaimantAddressTown: 'London',
        representedClaimantAddressCountry: '',
      };
      const controller = new RepresentedClaimantAddressDetailsController();
      const req = mockRequestEmpty({ body });
      const res = mockResponse();

      await controller.post(req, res);

      expect(res.redirect).toHaveBeenCalledWith(req.path);
      expect(req.session.errors).toEqual(
        expect.arrayContaining([{ propertyName: 'representedClaimantAddressCountry', errorType: 'required' }])
      );
    });

    it('should accept a submission without address line 2 and postcode as they are optional', async () => {
      const body = {
        representedClaimantAddress1: '1 The Street',
        representedClaimantAddress2: '',
        representedClaimantAddressTown: 'London',
        representedClaimantAddressCountry: 'England',
        representedClaimantAddressPostcode: '',
      };
      const controller = new RepresentedClaimantAddressDetailsController();
      const req = mockRequestEmpty({ body });
      const res = mockResponse();

      await controller.post(req, res);

      expect(res.redirect).toHaveBeenCalledWith(PageUrls.REPRESENTED_CLAIMANT_ENTER_EMAIL);
      expect(req.session.errors).toHaveLength(0);
    });

    it('should save the address fields to userCase', async () => {
      const body = {
        representedClaimantAddress1: '1 The Street',
        representedClaimantAddress2: 'Flat 2',
        representedClaimantAddressTown: 'London',
        representedClaimantAddressCountry: 'England',
        representedClaimantAddressPostcode: 'LE5 5HD',
      };
      const controller = new RepresentedClaimantAddressDetailsController();
      const req = mockRequestEmpty({ body });
      const res = mockResponse();

      await controller.post(req, res);

      expect(req.session.userCase).toMatchObject({
        representedClaimantAddress1: '1 The Street',
        representedClaimantAddress2: 'Flat 2',
        representedClaimantAddressTown: 'London',
        representedClaimantAddressCountry: 'England',
        representedClaimantAddressPostcode: 'LE5 5HD',
      });
    });
  });
});
