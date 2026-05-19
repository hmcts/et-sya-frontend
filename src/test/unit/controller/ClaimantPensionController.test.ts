import ClaimantPensionController from '../../../main/controllers/ClaimantPensionController';
import * as CaseHelper from '../../../main/controllers/helpers/CaseHelpers';
import { YesOrNoOrNotSure } from '../../../main/definitions/case';
import { PageUrls, TranslationKeys } from '../../../main/definitions/constants';
import { mockRequest, mockRequestEmpty } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

jest.spyOn(CaseHelper, 'handleUpdateDraftCase').mockImplementation(() => Promise.resolve());

describe('ClaimantPensionController', () => {
  const t = {
    'claimant-pension': {},
    common: {},
  };

  describe('get()', () => {
    it('should render the claimant pension page', () => {
      const controller = new ClaimantPensionController();
      const response = mockResponse();
      const request = mockRequest({ t });

      controller.get(request, response);

      expect(response.render).toHaveBeenCalledWith(TranslationKeys.CLAIMANT_PENSION, expect.anything());
    });

    it('should pre-populate form with existing pension contribution from session', () => {
      const controller = new ClaimantPensionController();
      const response = mockResponse();
      const request = mockRequest({ t, userCase: { claimantPensionContribution: YesOrNoOrNotSure.YES } });

      controller.get(request, response);

      expect(request.session.userCase.claimantPensionContribution).toEqual(YesOrNoOrNotSure.YES);
    });

    it('should clear pension fields when clearSelection query param is present', () => {
      const controller = new ClaimantPensionController();
      const response = mockResponse();
      const request = mockRequest({
        t,
        userCase: { claimantPensionContribution: YesOrNoOrNotSure.YES, claimantPensionWeeklyContribution: 50 },
      });
      request.query = { redirect: 'clearSelection' };

      controller.get(request, response);

      expect(request.session.userCase.claimantPensionContribution).toBeUndefined();
      expect(request.session.userCase.claimantPensionWeeklyContribution).toBeUndefined();
    });

    it('should pass languageParam to render context', () => {
      const controller = new ClaimantPensionController();
      const response = mockResponse();
      const request = mockRequest({ t });

      controller.get(request, response);

      const renderArgs = (response.render as jest.Mock).mock.calls[0][1];
      expect(renderArgs).toHaveProperty('languageParam');
    });
  });

  describe('post()', () => {
    it('should redirect to CLAIMANT_BENEFITS when Yes is selected (AC3)', async () => {
      const body = { claimantPensionContribution: YesOrNoOrNotSure.YES };
      const controller = new ClaimantPensionController();
      const req = mockRequest({ body });
      const res = mockResponse();

      await controller.post(req, res);

      expect(res.redirect).toHaveBeenCalledWith(PageUrls.CLAIMANT_BENEFITS);
    });

    it('should redirect to CLAIMANT_BENEFITS when No is selected (AC3)', async () => {
      const body = { claimantPensionContribution: YesOrNoOrNotSure.NO };
      const controller = new ClaimantPensionController();
      const req = mockRequest({ body });
      const res = mockResponse();

      await controller.post(req, res);

      expect(res.redirect).toHaveBeenCalledWith(PageUrls.CLAIMANT_BENEFITS);
    });

    it('should redirect to CLAIMANT_BENEFITS when Not sure is selected (AC3)', async () => {
      const body = { claimantPensionContribution: YesOrNoOrNotSure.NOT_SURE };
      const controller = new ClaimantPensionController();
      const req = mockRequest({ body });
      const res = mockResponse();

      await controller.post(req, res);

      expect(res.redirect).toHaveBeenCalledWith(PageUrls.CLAIMANT_BENEFITS);
    });

    it('should redirect to CLAIMANT_BENEFITS when no answer is given', async () => {
      const body = { claimantPensionContribution: '' };
      const controller = new ClaimantPensionController();
      const req = mockRequestEmpty({ body });
      const res = mockResponse();

      await controller.post(req, res);

      expect(res.redirect).toHaveBeenCalledWith(PageUrls.CLAIMANT_BENEFITS);
    });

    it('should save pension contribution and weekly amount to session (AC2)', async () => {
      const body = { claimantPensionContribution: YesOrNoOrNotSure.YES, claimantPensionWeeklyContribution: '50' };
      const controller = new ClaimantPensionController();
      const req = mockRequestEmpty({ body });
      const res = mockResponse();

      await controller.post(req, res);

      expect(req.session.userCase.claimantPensionContribution).toEqual(YesOrNoOrNotSure.YES);
    });
  });
});
