import DidClaimantHaveWrittenContractController from '../../../main/controllers/DidClaimantHaveWrittenContractController';
import * as CaseHelper from '../../../main/controllers/helpers/CaseHelpers';
import { YesOrNo } from '../../../main/definitions/case';
import { PageUrls, TranslationKeys } from '../../../main/definitions/constants';
import { mockRequest, mockRequestEmpty } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

jest.spyOn(CaseHelper, 'handleUpdateDraftCase').mockImplementation(() => Promise.resolve());

describe('DidClaimantHaveWrittenContractController', () => {
  const t = {
    'did-claimant-have-written-contract': {},
    common: {},
  };

  describe('get()', () => {
    it('should render the did claimant have written contract page', () => {
      const controller = new DidClaimantHaveWrittenContractController();
      const response = mockResponse();
      const request = mockRequest({ t });

      controller.get(request, response);

      expect(response.render).toHaveBeenCalledWith(
        TranslationKeys.DID_CLAIMANT_HAVE_WRITTEN_CONTRACT,
        expect.anything()
      );
    });

    it('should pre-populate form with existing claimantWrittenContract value from session', () => {
      const controller = new DidClaimantHaveWrittenContractController();
      const response = mockResponse();
      const request = mockRequest({ t, userCase: { claimantWrittenContract: YesOrNo.YES } });

      controller.get(request, response);

      expect(response.render).toHaveBeenCalledWith(
        TranslationKeys.DID_CLAIMANT_HAVE_WRITTEN_CONTRACT,
        expect.anything()
      );
      expect(request.session.userCase.claimantWrittenContract).toEqual(YesOrNo.YES);
    });
  });

  describe('post()', () => {
    it('should redirect to NOTICE_PERIOD when Yes is selected', async () => {
      const body = { claimantWrittenContract: YesOrNo.YES };
      const controller = new DidClaimantHaveWrittenContractController();
      const req = mockRequest({ body });
      const res = mockResponse();

      await controller.post(req, res);

      expect(res.redirect).toHaveBeenCalledWith(PageUrls.NOTICE_PERIOD);
    });

    it('should redirect to NOTICE_PERIOD when No is selected', async () => {
      const body = { claimantWrittenContract: YesOrNo.NO };
      const controller = new DidClaimantHaveWrittenContractController();
      const req = mockRequest({ body });
      const res = mockResponse();

      await controller.post(req, res);

      expect(res.redirect).toHaveBeenCalledWith(PageUrls.NOTICE_PERIOD);
    });

    it('should redirect to NOTICE_PERIOD when no value is submitted', async () => {
      const body = { claimantWrittenContract: '' };
      const controller = new DidClaimantHaveWrittenContractController();
      const req = mockRequest({ body });
      const res = mockResponse();

      await controller.post(req, res);

      expect(res.redirect).toHaveBeenCalledWith(PageUrls.NOTICE_PERIOD);
    });

    it('should save Yes to session userCase', async () => {
      const body = { claimantWrittenContract: YesOrNo.YES };
      const controller = new DidClaimantHaveWrittenContractController();
      const req = mockRequestEmpty({ body });
      const res = mockResponse();

      await controller.post(req, res);

      expect(req.session.userCase).toStrictEqual({ claimantWrittenContract: YesOrNo.YES });
    });

    it('should save No to session userCase', async () => {
      const body = { claimantWrittenContract: YesOrNo.NO };
      const controller = new DidClaimantHaveWrittenContractController();
      const req = mockRequestEmpty({ body });
      const res = mockResponse();

      await controller.post(req, res);

      expect(req.session.userCase).toStrictEqual({ claimantWrittenContract: YesOrNo.NO });
    });
  });
});
