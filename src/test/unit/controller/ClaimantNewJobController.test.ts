import ClaimantNewJobController from '../../../main/controllers/ClaimantNewJobController';
import * as CaseHelper from '../../../main/controllers/helpers/CaseHelpers';
import { YesOrNo } from '../../../main/definitions/case';
import { PageUrls, TranslationKeys } from '../../../main/definitions/constants';
import { mockRequest, mockRequestEmpty } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

jest.spyOn(CaseHelper, 'handleUpdateDraftCase').mockImplementation(() => Promise.resolve());

describe('ClaimantNewJobController', () => {
  const t = {
    'claimant-new-job': {},
    common: {},
  };

  describe('get()', () => {
    it('should render the claimant new job page', () => {
      const controller = new ClaimantNewJobController();
      const response = mockResponse();
      const request = mockRequest({ t });

      controller.get(request, response);

      expect(response.render).toHaveBeenCalledWith(TranslationKeys.CLAIMANT_NEW_JOB, expect.anything());
    });

    it('should pre-populate form with existing newJob value from session', () => {
      const controller = new ClaimantNewJobController();
      const response = mockResponse();
      const request = mockRequest({ t, userCase: { newJob: YesOrNo.YES } });

      controller.get(request, response);

      expect(response.render).toHaveBeenCalledWith(TranslationKeys.CLAIMANT_NEW_JOB, expect.anything());
      expect(request.session.userCase.newJob).toEqual(YesOrNo.YES);
    });
  });

  describe('post()', () => {
    it('should redirect to CLAIMANT_RESPONDENT_NAME when No is selected (AC2)', async () => {
      const body = { newJob: YesOrNo.NO };
      const controller = new ClaimantNewJobController();
      const req = mockRequest({ body });
      const res = mockResponse();

      await controller.post(req, res);

      expect(res.redirect).toHaveBeenCalledWith(PageUrls.CLAIMANT_RESPONDENT_NAME);
    });

    it('should redirect to CLAIMANT_RESPONDENT_NAME when Yes is selected', async () => {
      const body = { newJob: YesOrNo.YES };
      const controller = new ClaimantNewJobController();
      const req = mockRequest({ body });
      const res = mockResponse();

      await controller.post(req, res);

      expect(res.redirect).toHaveBeenCalledWith(PageUrls.CLAIMANT_RESPONDENT_NAME);
    });

    it('should redirect to CLAIMANT_RESPONDENT_NAME when no value is submitted', async () => {
      const body = { newJob: '' };
      const controller = new ClaimantNewJobController();
      const req = mockRequest({ body });
      const res = mockResponse();

      await controller.post(req, res);

      expect(res.redirect).toHaveBeenCalledWith(PageUrls.CLAIMANT_RESPONDENT_NAME);
    });

    it('should save newJob to session userCase', async () => {
      const body = { newJob: YesOrNo.NO };
      const controller = new ClaimantNewJobController();
      const req = mockRequestEmpty({ body });
      const res = mockResponse();

      await controller.post(req, res);

      expect(req.session.userCase.newJob).toEqual(YesOrNo.NO);
    });
  });
});
