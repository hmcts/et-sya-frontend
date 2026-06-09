import * as CaseHelper from '../../../../main/controllers/helpers/CaseHelpers';
import ClaimantBenefitsController from '../../../../main/controllers/non-hmcts/ClaimantBenefitsController';
import { YesOrNo } from '../../../../main/definitions/case';
import { PageUrls, TranslationKeys } from '../../../../main/definitions/constants';
import { mockRequest, mockRequestEmpty } from '../../mocks/mockRequest';
import { mockResponse } from '../../mocks/mockResponse';

jest.spyOn(CaseHelper, 'handleUpdateDraftCase').mockImplementation(() => Promise.resolve());

describe('ClaimantBenefitsController', () => {
  const t = {
    'non-hmcts/claimant-benefits': {},
    common: {},
  };

  describe('get()', () => {
    it('should render the claimant benefits page', () => {
      const controller = new ClaimantBenefitsController();
      const response = mockResponse();
      const request = mockRequest({ t });

      controller.get(request, response);

      expect(response.render).toHaveBeenCalledWith(TranslationKeys.CLAIMANT_BENEFITS, expect.anything());
    });

    it('should pre-populate form with existing employeeBenefits value from session', () => {
      const controller = new ClaimantBenefitsController();
      const response = mockResponse();
      const request = mockRequest({ t, userCase: { employeeBenefits: YesOrNo.YES } });

      controller.get(request, response);

      expect(request.session.userCase.employeeBenefits).toEqual(YesOrNo.YES);
    });

    it('should clear benefits fields when clearSelection query param is present', () => {
      const controller = new ClaimantBenefitsController();
      const response = mockResponse();
      const request = mockRequest({
        t,
        userCase: { employeeBenefits: YesOrNo.YES, benefitsCharCount: 'company car' },
      });
      request.query = { redirect: 'clearSelection' };

      controller.get(request, response);

      expect(request.session.userCase.employeeBenefits).toBeUndefined();
      expect(request.session.userCase.benefitsCharCount).toBeUndefined();
    });

    it('should pass languageParam to render context', () => {
      const controller = new ClaimantBenefitsController();
      const response = mockResponse();
      const request = mockRequest({ t });

      controller.get(request, response);

      const renderArgs = (response.render as jest.Mock).mock.calls[0][1];
      expect(renderArgs).toHaveProperty('languageParam');
    });
  });

  describe('post()', () => {
    it('should redirect to CLAIMANT_NEW_JOB on Yes with benefits text', async () => {
      const body = { employeeBenefits: YesOrNo.YES, benefitsCharCount: 'company car' };
      const controller = new ClaimantBenefitsController();
      const req = mockRequest({ body });
      const res = mockResponse();

      await controller.post(req, res);

      expect(res.redirect).toHaveBeenCalledWith(PageUrls.CLAIMANT_NEW_JOB);
    });

    it('should redirect to CLAIMANT_NEW_JOB on No', async () => {
      const body = { employeeBenefits: YesOrNo.NO };
      const controller = new ClaimantBenefitsController();
      const req = mockRequest({ body });
      const res = mockResponse();

      await controller.post(req, res);

      expect(res.redirect).toHaveBeenCalledWith(PageUrls.CLAIMANT_NEW_JOB);
    });

    it('should redirect to CLAIMANT_NEW_JOB when no answer given', async () => {
      const body = { employeeBenefits: '' };
      const controller = new ClaimantBenefitsController();
      const req = mockRequestEmpty({ body });
      const res = mockResponse();

      await controller.post(req, res);

      expect(res.redirect).toHaveBeenCalledWith(PageUrls.CLAIMANT_NEW_JOB);
    });

    it('should stay on page and error when benefits text exceeds 2500 characters', async () => {
      const body = { employeeBenefits: YesOrNo.YES, benefitsCharCount: 'a'.repeat(2501) };
      const controller = new ClaimantBenefitsController();
      const req = mockRequestEmpty({ body });
      const res = mockResponse();

      await controller.post(req, res);

      expect(res.redirect).toHaveBeenCalledWith(req.path);
      expect(req.session.errors.some((e: any) => e.propertyName === 'benefitsCharCount')).toBe(true);
    });
  });
});
