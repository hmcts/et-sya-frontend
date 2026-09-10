import ClaimantEmploymentDetailsController from '../../../main/controllers/ClaimantEmploymentDetailsController';
import * as CaseHelper from '../../../main/controllers/helpers/CaseHelpers';
import { PageUrls, TranslationKeys } from '../../../main/definitions/constants';
import { mockRequest, mockRequestEmpty } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

jest.spyOn(CaseHelper, 'handleUpdateDraftCase').mockImplementation(() => Promise.resolve());

describe('ClaimantEmploymentDetailsController', () => {
  const t = {
    'claimant-employment-details': {},
    common: {},
  };

  describe('get()', () => {
    it('should render the claimant employment details page', () => {
      const controller = new ClaimantEmploymentDetailsController();
      const response = mockResponse();
      const request = mockRequest({ t });

      controller.get(request, response);

      expect(response.render).toHaveBeenCalledWith(TranslationKeys.CLAIMANT_EMPLOYMENT_DETAILS, expect.anything());
    });

    it('should pre-populate form with existing jobTitle value from session', () => {
      const controller = new ClaimantEmploymentDetailsController();
      const response = mockResponse();
      const request = mockRequest({ t, userCase: { jobTitle: 'Software Engineer' } });

      controller.get(request, response);

      expect(response.render).toHaveBeenCalledWith(TranslationKeys.CLAIMANT_EMPLOYMENT_DETAILS, expect.anything());
      expect(request.session.userCase.jobTitle).toEqual('Software Engineer');
    });
  });

  describe('post()', () => {
    it('should redirect to CLAIMANT_EMPLOYMENT_START_DATE with a valid job title', async () => {
      const body = { jobTitle: 'Software Engineer' };
      const controller = new ClaimantEmploymentDetailsController();
      const req = mockRequestEmpty({ body });
      const res = mockResponse();

      await controller.post(req, res);

      expect(res.redirect).toHaveBeenCalledWith(PageUrls.CLAIMANT_EMPLOYMENT_START_DATE);
    });

    it('should redirect to CLAIMANT_EMPLOYMENT_START_DATE when job title is empty (optional)', async () => {
      const body = { jobTitle: '' };
      const controller = new ClaimantEmploymentDetailsController();
      const req = mockRequestEmpty({ body });
      const res = mockResponse();

      await controller.post(req, res);

      expect(res.redirect).toHaveBeenCalledWith(PageUrls.CLAIMANT_EMPLOYMENT_START_DATE);
      expect(req.session.errors).toHaveLength(0);
    });

    it('should return an error and stay on the page when job title is 1 character', async () => {
      const body = { jobTitle: 'A' };
      const controller = new ClaimantEmploymentDetailsController();
      const req = mockRequestEmpty({ body });
      const res = mockResponse();

      await controller.post(req, res);

      expect(res.redirect).toHaveBeenCalledWith(req.path);
      expect(req.session.errors).toEqual([{ propertyName: 'jobTitle', errorType: 'invalid-length' }]);
    });

    it('should return an error and stay on the page when job title exceeds 100 characters', async () => {
      const body = { jobTitle: 'A'.repeat(101) };
      const controller = new ClaimantEmploymentDetailsController();
      const req = mockRequestEmpty({ body });
      const res = mockResponse();

      await controller.post(req, res);

      expect(res.redirect).toHaveBeenCalledWith(req.path);
      expect(req.session.errors).toEqual([{ propertyName: 'jobTitle', errorType: 'invalid-length' }]);
    });

    it('should accept a job title of exactly 2 characters', async () => {
      const body = { jobTitle: 'IT' };
      const controller = new ClaimantEmploymentDetailsController();
      const req = mockRequestEmpty({ body });
      const res = mockResponse();

      await controller.post(req, res);

      expect(res.redirect).toHaveBeenCalledWith(PageUrls.CLAIMANT_EMPLOYMENT_START_DATE);
      expect(req.session.errors).toHaveLength(0);
    });

    it('should accept a job title of exactly 100 characters', async () => {
      const body = { jobTitle: 'A'.repeat(100) };
      const controller = new ClaimantEmploymentDetailsController();
      const req = mockRequestEmpty({ body });
      const res = mockResponse();

      await controller.post(req, res);

      expect(res.redirect).toHaveBeenCalledWith(PageUrls.CLAIMANT_EMPLOYMENT_START_DATE);
      expect(req.session.errors).toHaveLength(0);
    });

    it('should save job title to session userCase', async () => {
      const body = { jobTitle: 'Project Manager' };
      const controller = new ClaimantEmploymentDetailsController();
      const req = mockRequestEmpty({ body });
      const res = mockResponse();

      await controller.post(req, res);

      expect(req.session.userCase).toStrictEqual({ jobTitle: 'Project Manager' });
    });
  });
});
