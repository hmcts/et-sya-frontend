import * as CaseHelper from '../../../../main/controllers/helpers/CaseHelpers';
import ClaimantNoticeLengthController from '../../../../main/controllers/non-hmcts/ClaimantNoticeLengthController';
import { WeeksOrMonths } from '../../../../main/definitions/case';
import { PageUrls, TranslationKeys } from '../../../../main/definitions/constants';
import { mockRequest, mockRequestEmpty } from '../../mocks/mockRequest';
import { mockResponse } from '../../mocks/mockResponse';

jest.spyOn(CaseHelper, 'handleUpdateDraftCase').mockImplementation(() => Promise.resolve());

describe('ClaimantNoticeLengthController', () => {
  const t = {
    'non-hmcts/claimant-notice-length': {},
    common: {},
  };

  describe('get()', () => {
    it('should render the claimant notice length page', () => {
      const controller = new ClaimantNoticeLengthController();
      const response = mockResponse();
      const request = mockRequest({ t });

      controller.get(request, response);

      expect(response.render).toHaveBeenCalledWith(TranslationKeys.CLAIMANT_NOTICE_LENGTH, expect.anything());
    });

    it('should pass h1Weeks as h1 when noticePeriodUnit is Weeks (AC2)', () => {
      const controller = new ClaimantNoticeLengthController();
      const response = mockResponse();
      const request = mockRequest({ t, userCase: { noticePeriodUnit: WeeksOrMonths.WEEKS } });

      controller.get(request, response);

      const renderArgs = (response.render as jest.Mock).mock.calls[0][1];
      expect(renderArgs.h1).toEqual(renderArgs.h1Weeks);
    });

    it('should pass h1Months as h1 when noticePeriodUnit is Months (AC3)', () => {
      const controller = new ClaimantNoticeLengthController();
      const response = mockResponse();
      const request = mockRequest({ t, userCase: { noticePeriodUnit: WeeksOrMonths.MONTHS } });

      controller.get(request, response);

      const renderArgs = (response.render as jest.Mock).mock.calls[0][1];
      expect(renderArgs.h1).toEqual(renderArgs.h1Months);
    });

    it('should pre-populate form with existing noticePeriodLength from session', () => {
      const controller = new ClaimantNoticeLengthController();
      const response = mockResponse();
      const request = mockRequest({ t, userCase: { noticePeriodLength: '4' } });

      controller.get(request, response);

      expect(response.render).toHaveBeenCalledWith(TranslationKeys.CLAIMANT_NOTICE_LENGTH, expect.anything());
      expect(request.session.userCase.noticePeriodLength).toEqual('4');
    });
  });

  describe('post()', () => {
    it('should redirect to CLAIMANT_AVERAGE_WEEKLY_HOURS on valid whole number (AC5)', async () => {
      const body = { noticePeriodLength: '4' };
      const controller = new ClaimantNoticeLengthController();
      const req = mockRequestEmpty({ body });
      const res = mockResponse();

      await controller.post(req, res);

      expect(res.redirect).toHaveBeenCalledWith(PageUrls.CLAIMANT_AVERAGE_WEEKLY_HOURS);
    });

    it('should redirect to CLAIMANT_AVERAGE_WEEKLY_HOURS when field is empty (optional)', async () => {
      const body = { noticePeriodLength: '' };
      const controller = new ClaimantNoticeLengthController();
      const req = mockRequestEmpty({ body });
      const res = mockResponse();

      await controller.post(req, res);

      expect(res.redirect).toHaveBeenCalledWith(PageUrls.CLAIMANT_AVERAGE_WEEKLY_HOURS);
      expect(req.session.errors).toHaveLength(0);
    });

    it('should stay on page and error when value is not a whole number (AC4)', async () => {
      const body = { noticePeriodLength: 'abc' };
      const controller = new ClaimantNoticeLengthController();
      const req = mockRequestEmpty({ body });
      const res = mockResponse();

      await controller.post(req, res);

      expect(res.redirect).toHaveBeenCalledWith(req.path);
      expect(req.session.errors).toEqual([{ propertyName: 'noticePeriodLength', errorType: 'notANumber' }]);
    });

    it('should stay on page and error when value is a decimal (AC4)', async () => {
      const body = { noticePeriodLength: '4.5' };
      const controller = new ClaimantNoticeLengthController();
      const req = mockRequestEmpty({ body });
      const res = mockResponse();

      await controller.post(req, res);

      expect(res.redirect).toHaveBeenCalledWith(req.path);
      expect(req.session.errors).toEqual([{ propertyName: 'noticePeriodLength', errorType: 'notANumber' }]);
    });

    it('should save noticePeriodLength to session userCase', async () => {
      const body = { noticePeriodLength: '8' };
      const controller = new ClaimantNoticeLengthController();
      const req = mockRequestEmpty({ body });
      const res = mockResponse();

      await controller.post(req, res);

      expect(req.session.userCase.noticePeriodLength).toEqual('8');
    });
  });
});
