import * as CaseHelper from '../../../../main/controllers/helpers/CaseHelpers';
import ClaimantPayController from '../../../../main/controllers/non-hmcts/ClaimantPayController';
import { PageUrls, TranslationKeys } from '../../../../main/definitions/constants';
import { mockRequest, mockRequestEmpty } from '../../mocks/mockRequest';
import { mockResponse } from '../../mocks/mockResponse';

jest.spyOn(CaseHelper, 'handleUpdateDraftCase').mockImplementation(() => Promise.resolve());

describe('ClaimantPayController', () => {
  const t = {
    'claimant-pay': {},
    common: {},
  };

  describe('get()', () => {
    it('should render the claimant pay page', () => {
      const controller = new ClaimantPayController();
      const response = mockResponse();
      const request = mockRequest({ t });

      controller.get(request, response);

      expect(response.render).toHaveBeenCalledWith(TranslationKeys.CLAIMANT_PAY, expect.anything());
    });

    it('should clear pay fields when clearSelection query param is present', () => {
      const controller = new ClaimantPayController();
      const response = mockResponse();
      const request = mockRequest({
        t,
        userCase: { payBeforeTax: 50000, payAfterTax: 40000, payInterval: 'Monthly' as any },
      });
      request.query = { redirect: 'clearSelection' };

      controller.get(request, response);

      expect(request.session.userCase.payBeforeTax).toBeUndefined();
      expect(request.session.userCase.payAfterTax).toBeUndefined();
      expect(request.session.userCase.payInterval).toBeUndefined();
    });

    it('should pass languageParam to render context', () => {
      const controller = new ClaimantPayController();
      const response = mockResponse();
      const request = mockRequest({ t });

      controller.get(request, response);

      const renderArgs = (response.render as jest.Mock).mock.calls[0][1];
      expect(renderArgs).toHaveProperty('languageParam');
    });
  });

  describe('post()', () => {
    it('should redirect to CLAIMANT_PENSION on valid submission (AC4)', async () => {
      const body = { payBeforeTax: '50000', payAfterTax: '40000', payInterval: 'Monthly' };
      const controller = new ClaimantPayController();
      const req = mockRequest({ body });
      const res = mockResponse();

      await controller.post(req, res);

      expect(res.redirect).toHaveBeenCalledWith(PageUrls.CLAIMANT_PENSION);
    });

    it('should redirect to CLAIMANT_PENSION when all pay fields are empty (optional)', async () => {
      const body = { payBeforeTax: '', payAfterTax: '', payInterval: '' };
      const controller = new ClaimantPayController();
      const req = mockRequestEmpty({ body });
      const res = mockResponse();

      await controller.post(req, res);

      expect(res.redirect).toHaveBeenCalledWith(PageUrls.CLAIMANT_PENSION);
    });

    it('should stay on page and error when payBeforeTax is non-numeric (AC2)', async () => {
      const body = { payBeforeTax: 'abc', payAfterTax: '', payInterval: '' };
      const controller = new ClaimantPayController();
      const req = mockRequestEmpty({ body });
      const res = mockResponse();

      await controller.post(req, res);

      expect(res.redirect).toHaveBeenCalledWith(req.path);
      expect(req.session.errors.some((e: any) => e.propertyName === 'payBeforeTax')).toBe(true);
    });

    it('should stay on page and error when payAfterTax is non-numeric (AC2)', async () => {
      const body = { payBeforeTax: '', payAfterTax: 'xyz', payInterval: '' };
      const controller = new ClaimantPayController();
      const req = mockRequestEmpty({ body });
      const res = mockResponse();

      await controller.post(req, res);

      expect(res.redirect).toHaveBeenCalledWith(req.path);
      expect(req.session.errors.some((e: any) => e.propertyName === 'payAfterTax')).toBe(true);
    });

    it('should stay on page and error when pay entered without pay interval (AC3)', async () => {
      const body = { payBeforeTax: '50000', payAfterTax: '', payInterval: '' };
      const controller = new ClaimantPayController();
      const req = mockRequestEmpty({ body });
      const res = mockResponse();

      await controller.post(req, res);

      expect(res.redirect).toHaveBeenCalledWith(req.path);
      expect(req.session.errors.some((e: any) => e.propertyName === 'payInterval')).toBe(true);
    });
  });
});
