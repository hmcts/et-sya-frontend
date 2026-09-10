import ClaimantLinkedCasesController from '../../../main/controllers/ClaimantLinkedCasesController';
import * as CaseHelper from '../../../main/controllers/helpers/CaseHelpers';
import { YesOrNo } from '../../../main/definitions/case';
import { PageUrls, TranslationKeys } from '../../../main/definitions/constants';
import { mockRequest, mockRequestEmpty } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

jest.spyOn(CaseHelper, 'handleUpdateDraftCase').mockImplementation(() => Promise.resolve());

describe('ClaimantLinkedCasesController', () => {
  const t = {
    'claimant-linked-cases': {},
    common: {},
  };

  describe('get()', () => {
    it('should render the claimant linked cases page', () => {
      const controller = new ClaimantLinkedCasesController();
      const response = mockResponse();
      const request = mockRequest({ t });

      controller.get(request, response);

      expect(response.render).toHaveBeenCalledWith(TranslationKeys.CLAIMANT_LINKED_CASES, expect.anything());
    });

    it('should pre-populate form with existing linkedCases value from session', () => {
      const controller = new ClaimantLinkedCasesController();
      const response = mockResponse();
      const request = mockRequest({ t, userCase: { linkedCases: YesOrNo.YES, linkedCasesDetail: 'Case 123' } });

      controller.get(request, response);

      expect(response.render).toHaveBeenCalledWith(TranslationKeys.CLAIMANT_LINKED_CASES, expect.anything());
      expect(request.session.userCase.linkedCases).toEqual(YesOrNo.YES);
      expect(request.session.userCase.linkedCasesDetail).toEqual('Case 123');
    });
  });

  describe('post()', () => {
    it('should redirect to CLAIM_DETAILS_CHECK when No is selected', async () => {
      const body = { linkedCases: YesOrNo.NO };
      const controller = new ClaimantLinkedCasesController();
      const req = mockRequestEmpty({ body });
      const res = mockResponse();

      await controller.post(req, res);

      expect(res.redirect).toHaveBeenCalledWith(PageUrls.CLAIM_DETAILS_CHECK);
    });

    it('should redirect to CLAIM_DETAILS_CHECK when Yes is selected with case details', async () => {
      const body = { linkedCases: YesOrNo.YES, linkedCasesDetail: 'Case 456 - John Smith' };
      const controller = new ClaimantLinkedCasesController();
      const req = mockRequestEmpty({ body });
      const res = mockResponse();

      await controller.post(req, res);

      expect(res.redirect).toHaveBeenCalledWith(PageUrls.CLAIM_DETAILS_CHECK);
    });

    it('should redirect to CLAIM_DETAILS_CHECK when nothing is selected (optional field)', async () => {
      const body = {};
      const controller = new ClaimantLinkedCasesController();
      const req = mockRequestEmpty({ body });
      const res = mockResponse();

      await controller.post(req, res);

      expect(res.redirect).toHaveBeenCalledWith(PageUrls.CLAIM_DETAILS_CHECK);
    });

    it('should save linkedCases No to session userCase', async () => {
      const body = { linkedCases: YesOrNo.NO };
      const controller = new ClaimantLinkedCasesController();
      const req = mockRequestEmpty({ body });
      const res = mockResponse();

      await controller.post(req, res);

      expect(req.session.userCase.linkedCases).toEqual(YesOrNo.NO);
    });

    it('should save linkedCases Yes and linkedCasesDetail to session userCase', async () => {
      const body = { linkedCases: YesOrNo.YES, linkedCasesDetail: 'Case 789 - Jane Doe' };
      const controller = new ClaimantLinkedCasesController();
      const req = mockRequestEmpty({ body });
      const res = mockResponse();

      await controller.post(req, res);

      expect(req.session.userCase.linkedCases).toEqual(YesOrNo.YES);
      expect(req.session.userCase.linkedCasesDetail).toEqual('Case 789 - Jane Doe');
    });
  });
});
