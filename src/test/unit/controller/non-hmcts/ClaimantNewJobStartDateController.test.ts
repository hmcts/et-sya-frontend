import * as CaseHelper from '../../../../main/controllers/helpers/CaseHelpers';
import ClaimantNewJobStartDateController from '../../../../main/controllers/non-hmcts/ClaimantNewJobStartDateController';
import { PageUrls, TranslationKeys } from '../../../../main/definitions/constants';
import { mockRequest, mockRequestEmpty } from '../../mocks/mockRequest';
import { mockResponse } from '../../mocks/mockResponse';

jest.spyOn(CaseHelper, 'handleUpdateDraftCase').mockImplementation(() => Promise.resolve());

describe('ClaimantNewJobStartDateController', () => {
  const t = {
    'claimant-new-job-start-date': {},
    common: {},
  };

  describe('get()', () => {
    it('should render the claimant new job start date page', () => {
      const controller = new ClaimantNewJobStartDateController();
      const response = mockResponse();
      const request = mockRequest({ t });

      controller.get(request, response);

      expect(response.render).toHaveBeenCalledWith(TranslationKeys.CLAIMANT_NEW_JOB_START_DATE, expect.anything());
    });

    it('should pre-populate form with existing newJobStartDate from session', () => {
      const controller = new ClaimantNewJobStartDateController();
      const response = mockResponse();
      const request = mockRequest({ t, userCase: { newJobStartDate: { year: '2027', month: '06', day: '15' } } });

      controller.get(request, response);

      expect(response.render).toHaveBeenCalledWith(TranslationKeys.CLAIMANT_NEW_JOB_START_DATE, expect.anything());
      expect(request.session.userCase.newJobStartDate).toStrictEqual({ year: '2027', month: '06', day: '15' });
    });
  });

  describe('post()', () => {
    it('should redirect to CLAIMANT_NEW_JOB_PAY on a valid date (AC3)', async () => {
      const body = { 'newJobStartDate-day': '15', 'newJobStartDate-month': '06', 'newJobStartDate-year': '2027' };
      const controller = new ClaimantNewJobStartDateController();
      const req = mockRequestEmpty({ body });
      const res = mockResponse();

      await controller.post(req, res);

      expect(res.redirect).toHaveBeenCalledWith(PageUrls.CLAIMANT_NEW_JOB_PAY);
    });

    it('should redirect to CLAIMANT_NEW_JOB_PAY when all date fields are empty (optional)', async () => {
      const body = { 'newJobStartDate-day': '', 'newJobStartDate-month': '', 'newJobStartDate-year': '' };
      const controller = new ClaimantNewJobStartDateController();
      const req = mockRequestEmpty({ body });
      const res = mockResponse();

      await controller.post(req, res);

      expect(res.redirect).toHaveBeenCalledWith(PageUrls.CLAIMANT_NEW_JOB_PAY);
      expect(req.session.errors).toHaveLength(0);
    });

    it('should save newJobStartDate to session userCase', async () => {
      const body = { 'newJobStartDate-day': '15', 'newJobStartDate-month': '06', 'newJobStartDate-year': '2027' };
      const controller = new ClaimantNewJobStartDateController();
      const req = mockRequestEmpty({ body });
      const res = mockResponse();

      await controller.post(req, res);

      expect(req.session.userCase.newJobStartDate).toStrictEqual({ day: '15', month: '06', year: '2027' });
    });

    it('should redirect to CLAIMANT_NEW_JOB_PAY when date is in the past (valid — job may have started already)', async () => {
      const body = { 'newJobStartDate-day': '01', 'newJobStartDate-month': '01', 'newJobStartDate-year': '2020' };
      const controller = new ClaimantNewJobStartDateController();
      const req = mockRequestEmpty({ body });
      const res = mockResponse();

      await controller.post(req, res);

      expect(res.redirect).toHaveBeenCalledWith(PageUrls.CLAIMANT_NEW_JOB_PAY);
      expect(req.session.errors).toHaveLength(0);
    });

    it('should stay on page and error when date is more than 10 years in the future', async () => {
      const body = { 'newJobStartDate-day': '01', 'newJobStartDate-month': '01', 'newJobStartDate-year': '2040' };
      const controller = new ClaimantNewJobStartDateController();
      const req = mockRequestEmpty({ body });
      const res = mockResponse();

      await controller.post(req, res);

      expect(res.redirect).toHaveBeenCalledWith(req.path);
      expect(req.session.errors[0].propertyName).toEqual('newJobStartDate');
    });
  });
});
