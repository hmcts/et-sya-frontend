import * as CaseHelper from '../../../../main/controllers/helpers/CaseHelpers';
import ClaimantPastNoticeTypeController from '../../../../main/controllers/non-hmcts/ClaimantPastNoticeTypeController';
import { WeeksOrMonths } from '../../../../main/definitions/case';
import { PageUrls, TranslationKeys } from '../../../../main/definitions/constants';
import { mockRequest, mockRequestEmpty } from '../../mocks/mockRequest';
import { mockResponse } from '../../mocks/mockResponse';

jest.spyOn(CaseHelper, 'handleUpdateDraftCase').mockImplementation(() => Promise.resolve());

describe('ClaimantPastNoticeTypeController', () => {
  const t = {
    'claimant-past-notice-type': {},
    common: {},
  };

  describe('get()', () => {
    it('should render the claimant past notice type page', () => {
      const controller = new ClaimantPastNoticeTypeController();
      const response = mockResponse();
      const request = mockRequest({ t });

      controller.get(request, response);

      expect(response.render).toHaveBeenCalledWith(TranslationKeys.CLAIMANT_PAST_NOTICE_TYPE, expect.anything());
    });

    it('should pre-populate form with existing noticePeriodUnit value from session', () => {
      const controller = new ClaimantPastNoticeTypeController();
      const response = mockResponse();
      const request = mockRequest({ t, userCase: { noticePeriodUnit: WeeksOrMonths.WEEKS } });

      controller.get(request, response);

      expect(response.render).toHaveBeenCalledWith(TranslationKeys.CLAIMANT_PAST_NOTICE_TYPE, expect.anything());
      expect(request.session.userCase.noticePeriodUnit).toEqual(WeeksOrMonths.WEEKS);
    });
  });

  describe('post()', () => {
    it('should redirect to CLAIMANT_NOTICE_LENGTH when Weeks is selected', async () => {
      const body = { noticePeriodUnit: WeeksOrMonths.WEEKS };
      const controller = new ClaimantPastNoticeTypeController();
      const req = mockRequest({ body });
      const res = mockResponse();

      await controller.post(req, res);

      expect(res.redirect).toHaveBeenCalledWith(PageUrls.CLAIMANT_NOTICE_LENGTH);
    });

    it('should redirect to CLAIMANT_NOTICE_LENGTH when Months is selected', async () => {
      const body = { noticePeriodUnit: WeeksOrMonths.MONTHS };
      const controller = new ClaimantPastNoticeTypeController();
      const req = mockRequest({ body });
      const res = mockResponse();

      await controller.post(req, res);

      expect(res.redirect).toHaveBeenCalledWith(PageUrls.CLAIMANT_NOTICE_LENGTH);
    });

    it('should redirect to CLAIMANT_AVERAGE_WEEKLY_HOURS when no value is submitted', async () => {
      const body = { noticePeriodUnit: '' };
      const controller = new ClaimantPastNoticeTypeController();
      const req = mockRequest({ body });
      const res = mockResponse();

      await controller.post(req, res);

      expect(res.redirect).toHaveBeenCalledWith(PageUrls.CLAIMANT_AVERAGE_WEEKLY_HOURS);
    });

    it('should save noticePeriodUnit to session userCase', async () => {
      const body = { noticePeriodUnit: WeeksOrMonths.MONTHS };
      const controller = new ClaimantPastNoticeTypeController();
      const req = mockRequestEmpty({ body });
      const res = mockResponse();

      await controller.post(req, res);

      expect(req.session.userCase).toStrictEqual({ noticePeriodUnit: WeeksOrMonths.MONTHS });
    });
  });
});
