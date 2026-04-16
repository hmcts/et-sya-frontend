import RepresentativeDetailsController from '../../../main/controllers/RepresentativeDetailsController';
import * as CaseHelper from '../../../main/controllers/helpers/CaseHelpers';
import { PageUrls } from '../../../main/definitions/constants';
import { mockRequest, mockRequestEmpty } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

jest.spyOn(CaseHelper, 'handleUpdateDraftCase').mockImplementation(() => Promise.resolve());

describe('Representative Details Controller', () => {
  const t = {
    'representative-details': {},
    common: {},
  };

  describe('get()', () => {
    it('should render the Representative Details page', () => {
      const controller = new RepresentativeDetailsController();
      const response = mockResponse();
      const request = mockRequest({ t });

      controller.get(request, response);

      expect(response.render).toHaveBeenCalledWith('representative-details', expect.anything());
    });

    it('should render with existing session data pre-populated', () => {
      const controller = new RepresentativeDetailsController();
      const response = mockResponse();
      const request = mockRequest({
        t,
        userCase: {
          representativeType: 'Solicitor',
          representativeOrgName: 'Smith & Co',
          representativeName: 'Jane Smith',
        },
      });

      controller.get(request, response);

      expect(response.render).toHaveBeenCalledWith('representative-details', expect.anything());
    });
  });

  describe('post()', () => {
    it('should redirect to the representative postcode enter page when all required fields are valid', async () => {
      const body = {
        representativeType: 'Solicitor',
        representativeOrgName: 'Smith & Co',
        representativeName: 'Jane Smith',
      };
      const controller = new RepresentativeDetailsController();
      const req = mockRequestEmpty({ body });
      const res = mockResponse();

      await controller.post(req, res);

      expect(res.redirect).toHaveBeenCalledWith(PageUrls.REPRESENTATIVE_POSTCODE_ENTER);
      expect(req.session.errors).toHaveLength(0);
    });

    it('should save representative type to the session userCase', async () => {
      const body = {
        representativeType: 'Trade Union',
        representativeOrgName: '',
        representativeName: 'John Doe',
      };
      const controller = new RepresentativeDetailsController();
      const req = mockRequestEmpty({ body });
      const res = mockResponse();

      await controller.post(req, res);

      expect(req.session.userCase).toMatchObject({
        representativeType: 'Trade Union',
        representativeName: 'John Doe',
      });
    });

    it('should save organisation name when provided', async () => {
      const body = {
        representativeType: 'Citizens Advice Bureau',
        representativeOrgName: 'Citizens Advice Southwark',
        representativeName: 'John Doe',
      };
      const controller = new RepresentativeDetailsController();
      const req = mockRequestEmpty({ body });
      const res = mockResponse();

      await controller.post(req, res);

      expect(req.session.userCase).toMatchObject({
        representativeOrgName: 'Citizens Advice Southwark',
      });
    });

    it('should return a required error when representative type is not selected', async () => {
      const body = {
        representativeType: '',
        representativeOrgName: '',
        representativeName: 'Jane Smith',
      };
      const controller = new RepresentativeDetailsController();
      const req = mockRequestEmpty({ body });
      const res = mockResponse();

      await controller.post(req, res);

      expect(res.redirect).toHaveBeenCalledWith(req.path);
      expect(req.session.errors).toEqual([{ propertyName: 'representativeType', errorType: 'required' }]);
    });

    it('should return a required error when representative name is empty', async () => {
      const body = {
        representativeType: 'Solicitor',
        representativeOrgName: '',
        representativeName: '',
      };
      const controller = new RepresentativeDetailsController();
      const req = mockRequestEmpty({ body });
      const res = mockResponse();

      await controller.post(req, res);

      expect(res.redirect).toHaveBeenCalledWith(req.path);
      expect(req.session.errors).toEqual([{ propertyName: 'representativeName', errorType: 'required' }]);
    });

    it('should return errors for both required fields when both are empty', async () => {
      const body = {
        representativeType: '',
        representativeOrgName: '',
        representativeName: '',
      };
      const controller = new RepresentativeDetailsController();
      const req = mockRequestEmpty({ body });
      const res = mockResponse();

      await controller.post(req, res);

      expect(res.redirect).toHaveBeenCalledWith(req.path);
      expect(req.session.errors).toHaveLength(2);
      expect(req.session.errors).toEqual(
        expect.arrayContaining([
          { propertyName: 'representativeType', errorType: 'required' },
          { propertyName: 'representativeName', errorType: 'required' },
        ])
      );
    });

    it('should succeed without organisation name as it is optional', async () => {
      const body = {
        representativeType: 'Private Individual',
        representativeOrgName: '',
        representativeName: 'Bob Jones',
      };
      const controller = new RepresentativeDetailsController();
      const req = mockRequestEmpty({ body });
      const res = mockResponse();

      await controller.post(req, res);

      expect(res.redirect).toHaveBeenCalledWith(PageUrls.REPRESENTATIVE_POSTCODE_ENTER);
      expect(req.session.errors).toHaveLength(0);
    });

    it('should redirect to returnUrl when one is set in the session', async () => {
      const body = {
        representativeType: 'Solicitor',
        representativeOrgName: '',
        representativeName: 'Jane Smith',
      };
      const controller = new RepresentativeDetailsController();
      const req = mockRequest({ body });
      const res = mockResponse();
      req.session.returnUrl = PageUrls.CHECK_ANSWERS;

      await controller.post(req, res);

      expect(res.redirect).toHaveBeenCalledWith(PageUrls.CHECK_ANSWERS);
    });
  });
});
