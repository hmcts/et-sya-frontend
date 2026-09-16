import IsClaimantStillWorkingController from '../../../main/controllers/IsClaimantStillWorkingController';
import * as CaseHelper from '../../../main/controllers/helpers/CaseHelpers';
import { StillWorking } from '../../../main/definitions/case';
import { PageUrls, TranslationKeys } from '../../../main/definitions/constants';
import { mockRequest, mockRequestEmpty } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

jest.spyOn(CaseHelper, 'handleUpdateDraftCase').mockImplementation(() => Promise.resolve());

describe('IsClaimantStillWorkingController', () => {
  const t = {
    'is-claimant-still-working': {},
    common: {},
  };

  describe('get()', () => {
    it('should render the is claimant still working page', () => {
      const controller = new IsClaimantStillWorkingController();
      const response = mockResponse();
      const request = mockRequest({ t });

      controller.get(request, response);

      expect(response.render).toHaveBeenCalledWith(TranslationKeys.IS_CLAIMANT_STILL_WORKING, expect.anything());
    });

    it('should pre-populate form with existing isStillWorking value from session', () => {
      const controller = new IsClaimantStillWorkingController();
      const response = mockResponse();
      const request = mockRequest({ t, userCase: { isStillWorking: StillWorking.WORKING } });

      controller.get(request, response);

      expect(response.render).toHaveBeenCalledWith(TranslationKeys.IS_CLAIMANT_STILL_WORKING, expect.anything());
      expect(request.session.userCase.isStillWorking).toEqual(StillWorking.WORKING);
    });
  });

  describe('post()', () => {
    it('should redirect to CLAIMANT_EMPLOYMENT_DETAILS when claimant is still working', async () => {
      const body = { isStillWorking: StillWorking.WORKING };
      const controller = new IsClaimantStillWorkingController();
      const req = mockRequest({ body });
      const res = mockResponse();

      await controller.post(req, res);

      expect(res.redirect).toHaveBeenCalledWith(PageUrls.CLAIMANT_EMPLOYMENT_DETAILS);
    });

    it('should redirect to CLAIMANT_EMPLOYMENT_DETAILS when claimant is working a notice period', async () => {
      const body = { isStillWorking: StillWorking.NOTICE };
      const controller = new IsClaimantStillWorkingController();
      const req = mockRequest({ body });
      const res = mockResponse();

      await controller.post(req, res);

      expect(res.redirect).toHaveBeenCalledWith(PageUrls.CLAIMANT_EMPLOYMENT_DETAILS);
    });

    it('should redirect to CLAIMANT_EMPLOYMENT_DETAILS when claimant is no longer working', async () => {
      const body = { isStillWorking: StillWorking.NO_LONGER_WORKING };
      const controller = new IsClaimantStillWorkingController();
      const req = mockRequest({ body });
      const res = mockResponse();

      await controller.post(req, res);

      expect(res.redirect).toHaveBeenCalledWith(PageUrls.CLAIMANT_EMPLOYMENT_DETAILS);
    });

    it('should redirect to CLAIMANT_EMPLOYMENT_DETAILS when no value is submitted', async () => {
      const body = { isStillWorking: '' };
      const controller = new IsClaimantStillWorkingController();
      const req = mockRequest({ body });
      const res = mockResponse();

      await controller.post(req, res);

      // All statuses (including empty / no selection) now route through employment details
      expect(res.redirect).toHaveBeenCalledWith(PageUrls.CLAIMANT_EMPLOYMENT_DETAILS);
    });

    it('should save WORKING to session userCase and clear date fields', async () => {
      const body = { isStillWorking: StillWorking.WORKING };
      const controller = new IsClaimantStillWorkingController();
      const req = mockRequestEmpty({ body });
      const res = mockResponse();

      await controller.post(req, res);

      expect(req.session.userCase).toStrictEqual({
        isStillWorking: StillWorking.WORKING,
        endDate: undefined,
        noticeEnds: undefined,
      });
    });

    it('should save NOTICE to session userCase and clear endDate', async () => {
      const body = { isStillWorking: StillWorking.NOTICE };
      const controller = new IsClaimantStillWorkingController();
      const req = mockRequestEmpty({ body });
      const res = mockResponse();

      await controller.post(req, res);

      expect(req.session.userCase.isStillWorking).toEqual(StillWorking.NOTICE);
      expect(req.session.userCase.endDate).toBeUndefined();
    });

    it('should save NO_LONGER_WORKING to session userCase and clear noticeEnds', async () => {
      const body = { isStillWorking: StillWorking.NO_LONGER_WORKING };
      const controller = new IsClaimantStillWorkingController();
      const req = mockRequestEmpty({ body });
      const res = mockResponse();

      await controller.post(req, res);

      expect(req.session.userCase.isStillWorking).toEqual(StillWorking.NO_LONGER_WORKING);
      expect(req.session.userCase.noticeEnds).toBeUndefined();
    });

    it('should clear both endDate and noticeEnds when claimant is still working', async () => {
      const body = { isStillWorking: StillWorking.WORKING };
      const controller = new IsClaimantStillWorkingController();
      const req = mockRequestEmpty({ body });
      const res = mockResponse();
      req.session.userCase.endDate = { year: '2024', month: '01', day: '01' };
      req.session.userCase.noticeEnds = { year: '2024', month: '02', day: '02' };

      await controller.post(req, res);

      expect(req.session.userCase.endDate).toBeUndefined();
      expect(req.session.userCase.noticeEnds).toBeUndefined();
    });

    it('should clear noticeEnds but keep endDate when claimant is no longer working', async () => {
      const body = { isStillWorking: StillWorking.NO_LONGER_WORKING };
      const controller = new IsClaimantStillWorkingController();
      const req = mockRequestEmpty({ body });
      const res = mockResponse();
      req.session.userCase.endDate = { year: '2024', month: '01', day: '01' };
      req.session.userCase.noticeEnds = { year: '2024', month: '02', day: '02' };

      await controller.post(req, res);

      expect(req.session.userCase.endDate).toStrictEqual({ year: '2024', month: '01', day: '01' });
      expect(req.session.userCase.noticeEnds).toBeUndefined();
    });

    it('should clear endDate but keep noticeEnds when claimant is working a notice period', async () => {
      const body = { isStillWorking: StillWorking.NOTICE };
      const controller = new IsClaimantStillWorkingController();
      const req = mockRequestEmpty({ body });
      const res = mockResponse();
      req.session.userCase.endDate = { year: '2024', month: '01', day: '01' };
      req.session.userCase.noticeEnds = { year: '2024', month: '02', day: '02' };

      await controller.post(req, res);

      expect(req.session.userCase.endDate).toBeUndefined();
      expect(req.session.userCase.noticeEnds).toStrictEqual({ year: '2024', month: '02', day: '02' });
    });
  });
});
