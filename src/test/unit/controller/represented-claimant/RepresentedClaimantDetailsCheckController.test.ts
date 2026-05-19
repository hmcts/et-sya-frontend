import * as CaseHelper from '../../../../main/controllers/helpers/CaseHelpers';
import RepresentedClaimantDetailsCheckController from '../../../../main/controllers/represented-claimant/RepresentedClaimantDetailsCheckController';
import { CaseWithId, YesOrNo } from '../../../../main/definitions/case';
import { PageUrls, TranslationKeys } from '../../../../main/definitions/constants';
import { mockRequest } from '../../mocks/mockRequest';
import { mockResponse } from '../../mocks/mockResponse';

jest.spyOn(CaseHelper, 'handleUpdateDraftCase').mockImplementation(() => Promise.resolve());

describe('Represented Claimant Details Check Controller', () => {
  const t = {
    'represented-claimant-details-check': {},
    common: {},
  };

  describe('get()', () => {
    it('should render the task list check page', () => {
      const controller = new RepresentedClaimantDetailsCheckController();
      const response = mockResponse();
      const request = mockRequest({ t });

      controller.get(request, response);

      expect(response.render).toHaveBeenCalledWith(TranslationKeys.TASK_LIST_CHECK, expect.anything());
    });
  });

  describe('post()', () => {
    it('should redirect to CLAIM_STEPS_NON_HMCTS when No is selected', async () => {
      const body = { representedClaimantDetailsCheck: YesOrNo.NO };
      const controller = new RepresentedClaimantDetailsCheckController();
      const req = mockRequest({ body });
      const res = mockResponse();

      await controller.post(req, res);

      expect(res.redirect).toHaveBeenCalledWith(PageUrls.CLAIM_STEPS_NON_HMCTS);
    });

    it('should render same page with required error when nothing is selected', async () => {
      const errors = [{ propertyName: 'representedClaimantDetailsCheck', errorType: 'required' }];
      const body = { representedClaimantDetailsCheck: '' };
      const controller = new RepresentedClaimantDetailsCheckController();
      const req = mockRequest({ body });
      const res = mockResponse();

      await controller.post(req, res);

      expect(res.redirect).toHaveBeenCalledWith(req.path);
      expect(req.session.errors).toEqual(errors);
    });

    it('should redirect to CLAIM_STEPS_NON_HMCTS when Yes is selected and mandatory fields are present', async () => {
      const body = { representedClaimantDetailsCheck: YesOrNo.YES };
      const userCase: Partial<CaseWithId> = {
        representedClaimantAddress1: '10 Claimant Street',
      };
      const controller = new RepresentedClaimantDetailsCheckController();
      const req = mockRequest({ body, userCase });
      const res = mockResponse();

      await controller.post(req, res);

      expect(res.redirect).toHaveBeenCalledWith(PageUrls.CLAIM_STEPS_NON_HMCTS);
    });

    it('should render task list check page with invalid error when Yes is selected but representedClaimantAddress1 is missing', async () => {
      const body = { representedClaimantDetailsCheck: YesOrNo.YES };
      const userCase = {};
      const errors = [{ propertyName: 'representedClaimantDetailsCheck', errorType: 'invalid' }];
      const controller = new RepresentedClaimantDetailsCheckController();
      const req = mockRequest({ body, userCase });
      const res = mockResponse();

      await controller.post(req, res);

      expect(req.session.errors).toEqual(errors);
      expect(res.render).toHaveBeenCalledWith(TranslationKeys.TASK_LIST_CHECK, expect.anything());
    });
  });
});
