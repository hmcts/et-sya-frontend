import * as CaseHelper from '../../../../main/controllers/helpers/CaseHelpers';
import ClaimantNoticePeriodController from '../../../../main/controllers/non-hmcts/ClaimantNoticePeriodController';
import { YesOrNo } from '../../../../main/definitions/case';
import { PageUrls, TranslationKeys } from '../../../../main/definitions/constants';
import { mockRequest, mockRequestEmpty } from '../../mocks/mockRequest';
import { mockResponse } from '../../mocks/mockResponse';

jest.spyOn(CaseHelper, 'handleUpdateDraftCase').mockImplementation(() => Promise.resolve());

describe('ClaimantNoticePeriodController', () => {
  const t = {
    'non-hmcts/claimant-notice-period': {},
    common: {},
  };

  describe('get()', () => {
    it('should render the claimant notice period page', () => {
      const controller = new ClaimantNoticePeriodController();
      const response = mockResponse();
      const request = mockRequest({ t });

      controller.get(request, response);

      expect(response.render).toHaveBeenCalledWith(TranslationKeys.CLAIMANT_NOTICE_PERIOD, expect.anything());
    });

    it('should pre-populate form with existing noticePeriod value from session', () => {
      const controller = new ClaimantNoticePeriodController();
      const response = mockResponse();
      const request = mockRequest({ t, userCase: { noticePeriod: YesOrNo.YES } });

      controller.get(request, response);

      expect(response.render).toHaveBeenCalledWith(TranslationKeys.CLAIMANT_NOTICE_PERIOD, expect.anything());
      expect(request.session.userCase.noticePeriod).toEqual(YesOrNo.YES);
    });
  });

  describe('post()', () => {
    it('should redirect to CLAIMANT_PAST_NOTICE_TYPE when Yes is selected', async () => {
      const body = { noticePeriod: YesOrNo.YES };
      const controller = new ClaimantNoticePeriodController();
      const req = mockRequest({ body });
      const res = mockResponse();

      await controller.post(req, res);

      expect(res.redirect).toHaveBeenCalledWith(PageUrls.CLAIMANT_PAST_NOTICE_TYPE);
    });

    it('should redirect to CLAIMANT_AVERAGE_WEEKLY_HOURS when No is selected', async () => {
      const body = { noticePeriod: YesOrNo.NO };
      const controller = new ClaimantNoticePeriodController();
      const req = mockRequest({ body });
      const res = mockResponse();

      await controller.post(req, res);

      expect(res.redirect).toHaveBeenCalledWith(PageUrls.CLAIMANT_AVERAGE_WEEKLY_HOURS);
    });

    it('should redirect to CLAIMANT_AVERAGE_WEEKLY_HOURS when no value is submitted', async () => {
      const body = { noticePeriod: '' };
      const controller = new ClaimantNoticePeriodController();
      const req = mockRequest({ body });
      const res = mockResponse();

      await controller.post(req, res);

      expect(res.redirect).toHaveBeenCalledWith(PageUrls.CLAIMANT_AVERAGE_WEEKLY_HOURS);
    });

    it('should save Yes to session userCase', async () => {
      const body = { noticePeriod: YesOrNo.YES };
      const controller = new ClaimantNoticePeriodController();
      const req = mockRequestEmpty({ body });
      const res = mockResponse();

      await controller.post(req, res);

      expect(req.session.userCase).toStrictEqual({ noticePeriod: YesOrNo.YES });
    });

    it('should save No to session userCase and clear notice period fields', async () => {
      const body = { noticePeriod: YesOrNo.NO };
      const controller = new ClaimantNoticePeriodController();
      const req = mockRequestEmpty({ body });
      const res = mockResponse();

      await controller.post(req, res);

      expect(req.session.userCase.noticePeriod).toEqual(YesOrNo.NO);
      expect(req.session.userCase.noticePeriodUnit).toBeUndefined();
      expect(req.session.userCase.noticePeriodLength).toBeUndefined();
    });
  });
});
