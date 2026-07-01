import ClaimantClaimTypePayController from '../../../main/controllers/ClaimantClaimTypePayController';
import * as CaseHelper from '../../../main/controllers/helpers/CaseHelpers';
import { PageUrls, TranslationKeys } from '../../../main/definitions/constants';
import { ClaimTypePay } from '../../../main/definitions/definition';
import { mockRequest, mockRequestEmpty } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

jest.spyOn(CaseHelper, 'handleUpdateDraftCase').mockImplementation(() => Promise.resolve());

describe('ClaimantClaimTypePayController', () => {
  const t = {
    'claimant-claim-type-pay': {},
    common: {},
  };

  describe('get()', () => {
    it('should render the claimant claim type pay page', () => {
      const controller = new ClaimantClaimTypePayController();
      const response = mockResponse();
      const request = mockRequest({ t });

      controller.get(request, response);

      expect(response.render).toHaveBeenCalledWith(TranslationKeys.CLAIMANT_CLAIM_TYPE_PAY, expect.anything());
    });

    it('should pre-populate form with existing claimTypePay values from session', () => {
      const controller = new ClaimantClaimTypePayController();
      const response = mockResponse();
      const request = mockRequest({ t, userCase: { claimTypePay: [ClaimTypePay.ARREARS] } });

      controller.get(request, response);

      expect(response.render).toHaveBeenCalledWith(TranslationKeys.CLAIMANT_CLAIM_TYPE_PAY, expect.anything());
      expect(request.session.userCase.claimTypePay).toContain(ClaimTypePay.ARREARS);
    });
  });

  describe('post()', () => {
    it('should redirect to CLAIMANT_DESCRIBE_WHAT_HAPPENED when a single option is selected', async () => {
      const body = { claimTypePay: [ClaimTypePay.ARREARS] };
      const controller = new ClaimantClaimTypePayController();
      const req = mockRequestEmpty({ body });
      const res = mockResponse();

      await controller.post(req, res);

      expect(res.redirect).toHaveBeenCalledWith(PageUrls.CLAIMANT_DESCRIBE_WHAT_HAPPENED);
    });

    it('should allow multiple selections and redirect to CLAIMANT_DESCRIBE_WHAT_HAPPENED (AC2)', async () => {
      const body = { claimTypePay: [ClaimTypePay.HOLIDAY_PAY, ClaimTypePay.NOTICE_PAY, ClaimTypePay.REDUNDANCY_PAY] };
      const controller = new ClaimantClaimTypePayController();
      const req = mockRequestEmpty({ body });
      const res = mockResponse();

      await controller.post(req, res);

      expect(res.redirect).toHaveBeenCalledWith(PageUrls.CLAIMANT_DESCRIBE_WHAT_HAPPENED);
      expect(req.session.errors).toHaveLength(0);
    });

    it('should redirect to CLAIMANT_DESCRIBE_WHAT_HAPPENED when all options are selected', async () => {
      const body = {
        claimTypePay: [
          ClaimTypePay.ARREARS,
          ClaimTypePay.HOLIDAY_PAY,
          ClaimTypePay.NOTICE_PAY,
          ClaimTypePay.REDUNDANCY_PAY,
          ClaimTypePay.OTHER_PAYMENTS,
        ],
      };
      const controller = new ClaimantClaimTypePayController();
      const req = mockRequestEmpty({ body });
      const res = mockResponse();

      await controller.post(req, res);

      expect(res.redirect).toHaveBeenCalledWith(PageUrls.CLAIMANT_DESCRIBE_WHAT_HAPPENED);
    });

    it('should error when no option is selected', async () => {
      const body = { claimTypePay: [] as string[] };
      const controller = new ClaimantClaimTypePayController();
      const req = mockRequestEmpty({ body });
      const res = mockResponse();

      await controller.post(req, res);

      expect(res.redirect).toHaveBeenCalledWith(req.path);
      expect(req.session.errors).toEqual([{ propertyName: 'claimTypePay', errorType: 'required' }]);
    });

    it('should save selected pay claim types to session userCase', async () => {
      const body = { claimTypePay: [ClaimTypePay.ARREARS, ClaimTypePay.HOLIDAY_PAY] };
      const controller = new ClaimantClaimTypePayController();
      const req = mockRequestEmpty({ body });
      const res = mockResponse();

      await controller.post(req, res);

      expect(req.session.userCase.claimTypePay).toContain(ClaimTypePay.ARREARS);
      expect(req.session.userCase.claimTypePay).toContain(ClaimTypePay.HOLIDAY_PAY);
    });
  });
});
