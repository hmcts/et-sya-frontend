import RepresentativePhoneNumberController from '../../../main/controllers/RepresentativePhoneNumberController';
import * as CaseHelper from '../../../main/controllers/helpers/CaseHelpers';
import { PageUrls } from '../../../main/definitions/constants';
import { mockRequest, mockRequestEmpty } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

jest.spyOn(CaseHelper, 'handleUpdateDraftCase').mockImplementation(() => Promise.resolve());

describe('Representative Phone Number Controller', () => {
  const t = {
    'representative-phone-number': {},
    common: {},
  };

  describe('get()', () => {
    it('should render the Representative Phone Number page', () => {
      const controller = new RepresentativePhoneNumberController();
      const response = mockResponse();
      const request = mockRequest({ t });

      controller.get(request, response);

      expect(response.render).toHaveBeenCalledWith('representative-phone-number', expect.anything());
    });
  });

  describe('post()', () => {
    it('should redirect to the representative phone number page on a valid phone number', async () => {
      const body = { representativePhoneNumber: '07700 900 983' };
      const controller = new RepresentativePhoneNumberController();
      const req = mockRequestEmpty({ body });
      const res = mockResponse();

      await controller.post(req, res);

      expect(res.redirect).toHaveBeenCalledWith(PageUrls.REPRESENTATIVE_PHONE_NUMBER);
      expect(req.session.errors).toHaveLength(0);
    });

    it('should redirect to the representative phone number page when phone number is blank (optional)', async () => {
      const body = { representativePhoneNumber: '' };
      const controller = new RepresentativePhoneNumberController();
      const req = mockRequestEmpty({ body });
      const res = mockResponse();

      await controller.post(req, res);

      expect(res.redirect).toHaveBeenCalledWith(PageUrls.REPRESENTATIVE_PHONE_NUMBER);
      expect(req.session.errors).toHaveLength(0);
    });

    it('should return an invalid error when the phone number is not a valid UK number', async () => {
      const body = { representativePhoneNumber: 'not-a-number' };
      const controller = new RepresentativePhoneNumberController();
      const req = mockRequestEmpty({ body });
      const res = mockResponse();

      await controller.post(req, res);

      expect(res.redirect).toHaveBeenCalledWith(req.path);
      expect(req.session.errors).toEqual(
        expect.arrayContaining([{ propertyName: 'representativePhoneNumber', errorType: expect.any(String) }])
      );
    });

    it('should save the phone number to userCase', async () => {
      const body = { representativePhoneNumber: '01623 960 001' };
      const controller = new RepresentativePhoneNumberController();
      const req = mockRequestEmpty({ body });
      const res = mockResponse();

      await controller.post(req, res);

      expect(req.session.userCase.representativePhoneNumber).toEqual('01623 960 001');
    });
  });
});
