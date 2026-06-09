import * as CaseHelper from '../../../../main/controllers/helpers/CaseHelpers';
import ClaimantNewJobPayController from '../../../../main/controllers/non-hmcts/ClaimantNewJobPayController';
import { PayInterval } from '../../../../main/definitions/case';
import { PageUrls, TranslationKeys } from '../../../../main/definitions/constants';
import { mockRequest } from '../../mocks/mockRequest';
import { mockResponse } from '../../mocks/mockResponse';

jest.spyOn(CaseHelper, 'handleUpdateDraftCase').mockImplementation(() => Promise.resolve());

describe('ClaimantNewJobPayController', () => {
  const t = {
    'claimant-new-job-pay': {},
    common: {},
  };

  describe('get()', () => {
    it('should render the claimant new job pay page', () => {
      const controller = new ClaimantNewJobPayController();
      const response = mockResponse();
      const request = mockRequest({ t });

      controller.get(request, response);

      expect(response.render).toHaveBeenCalledWith(TranslationKeys.CLAIMANT_NEW_JOB_PAY, expect.anything());
    });

    it('should pre-populate form with existing pay values from session', () => {
      const controller = new ClaimantNewJobPayController();
      const response = mockResponse();
      const request = mockRequest({ t, userCase: { newJobPay: 2500, newJobPayInterval: PayInterval.MONTHLY } });

      controller.get(request, response);

      expect(response.render).toHaveBeenCalledWith(TranslationKeys.CLAIMANT_NEW_JOB_PAY, expect.anything());
      expect(request.session.userCase.newJobPay).toEqual(2500);
      expect(request.session.userCase.newJobPayInterval).toEqual(PayInterval.MONTHLY);
    });
  });

  describe('post()', () => {
    it('should redirect to CLAIMANT_RESPONDENT_NAME when both fields are valid (AC4)', async () => {
      const body = { newJobPay: '2500', newJobPayInterval: PayInterval.MONTHLY };
      const controller = new ClaimantNewJobPayController();
      const req = mockRequest({ body });
      const res = mockResponse();

      await controller.post(req, res);

      expect(res.redirect).toHaveBeenCalledWith(PageUrls.CLAIMANT_RESPONDENT_NAME);
    });

    it('should redirect to CLAIMANT_RESPONDENT_NAME when both fields are empty (optional)', async () => {
      const body = { newJobPay: '', newJobPayInterval: '' };
      const controller = new ClaimantNewJobPayController();
      const req = mockRequest({ body });
      const res = mockResponse();

      await controller.post(req, res);

      expect(res.redirect).toHaveBeenCalledWith(PageUrls.CLAIMANT_RESPONDENT_NAME);
      expect(req.session.errors).toHaveLength(0);
    });

    it('should error when pay is entered but interval is not selected (AC3)', async () => {
      const body = { newJobPay: '2500', newJobPayInterval: '' };
      const controller = new ClaimantNewJobPayController();
      const req = mockRequest({ body });
      const res = mockResponse();

      await controller.post(req, res);

      expect(req.session.errors).toEqual([{ propertyName: 'newJobPayInterval', errorType: 'required' }]);
    });

    it('should error when interval is selected but pay is not entered', async () => {
      const body = { newJobPay: '', newJobPayInterval: PayInterval.WEEKLY };
      const controller = new ClaimantNewJobPayController();
      const req = mockRequest({ body });
      const res = mockResponse();

      await controller.post(req, res);

      expect(req.session.errors).toEqual([{ propertyName: 'newJobPay', errorType: 'required' }]);
    });

    it('should error when pay is not a valid currency amount (AC2)', async () => {
      const body = { newJobPay: 'ten', newJobPayInterval: PayInterval.WEEKLY };
      const controller = new ClaimantNewJobPayController();
      const req = mockRequest({ body });
      const res = mockResponse();

      await controller.post(req, res);

      expect(req.session.errors).toEqual([{ propertyName: 'newJobPay', errorType: 'invalidCurrency' }]);
    });

    it('should error when pay exceeds maximum value (AC2)', async () => {
      const body = { newJobPay: '10000000', newJobPayInterval: PayInterval.WEEKLY };
      const controller = new ClaimantNewJobPayController();
      const req = mockRequest({ body });
      const res = mockResponse();

      await controller.post(req, res);

      expect(req.session.errors).toEqual([{ propertyName: 'newJobPay', errorType: 'tooHighCurrency' }]);
    });

    it('should accept pay up to 2 decimal places (AC2)', async () => {
      const body = { newJobPay: '1234.56', newJobPayInterval: PayInterval.ANNUAL };
      const controller = new ClaimantNewJobPayController();
      const req = mockRequest({ body });
      const res = mockResponse();

      await controller.post(req, res);

      expect(res.redirect).toHaveBeenCalledWith(PageUrls.CLAIMANT_RESPONDENT_NAME);
      expect(req.session.errors).toHaveLength(0);
    });
  });
});
