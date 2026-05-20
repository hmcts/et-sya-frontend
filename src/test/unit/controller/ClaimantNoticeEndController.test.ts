import ClaimantNoticeEndController from '../../../main/controllers/ClaimantNoticeEndController';
import * as CaseHelper from '../../../main/controllers/helpers/CaseHelpers';
import { PageUrls, TranslationKeys } from '../../../main/definitions/constants';
import { mockRequest, mockRequestEmpty } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

jest.spyOn(CaseHelper, 'handleUpdateDraftCase').mockImplementation(() => Promise.resolve());

describe('ClaimantNoticeEndController', () => {
  const t = {
    'notice-end': {},
    common: {},
  };

  describe('get()', () => {
    it('should render the notice end page', () => {
      const controller = new ClaimantNoticeEndController();
      const response = mockResponse();
      const request = mockRequest({ t });

      controller.get(request, response);

      expect(response.render).toHaveBeenCalledWith(TranslationKeys.NOTICE_END, expect.anything());
    });

    it('should pre-populate form with existing noticeEnds value from session', () => {
      const controller = new ClaimantNoticeEndController();
      const response = mockResponse();
      const request = mockRequest({ t, userCase: { noticeEnds: { year: '2027', month: '06', day: '15' } } });

      controller.get(request, response);

      expect(response.render).toHaveBeenCalledWith(TranslationKeys.NOTICE_END, expect.anything());
      expect(request.session.userCase.noticeEnds).toStrictEqual({ year: '2027', month: '06', day: '15' });
    });
  });

  describe('post()', () => {
    it('should redirect to CLAIMANT_NOTICE_TYPE on a valid future date (AC1)', async () => {
      const body = {
        'noticeEnds-day': '15',
        'noticeEnds-month': '06',
        'noticeEnds-year': '2027',
      };
      const controller = new ClaimantNoticeEndController();
      const req = mockRequestEmpty({ body });
      const res = mockResponse();

      await controller.post(req, res);

      expect(res.redirect).toHaveBeenCalledWith(PageUrls.CLAIMANT_NOTICE_TYPE);
    });

    it('should save noticeEnds to session userCase', async () => {
      const body = {
        'noticeEnds-day': '15',
        'noticeEnds-month': '06',
        'noticeEnds-year': '2027',
      };
      const controller = new ClaimantNoticeEndController();
      const req = mockRequestEmpty({ body });
      const res = mockResponse();

      await controller.post(req, res);

      expect(req.session.userCase.noticeEnds).toStrictEqual({ day: '15', month: '06', year: '2027' });
    });

    it('should stay on page with dayRequired error when day is missing', async () => {
      const body = { 'noticeEnds-day': '', 'noticeEnds-month': '06', 'noticeEnds-year': '2027' };
      const controller = new ClaimantNoticeEndController();
      const req = mockRequestEmpty({ body });
      const res = mockResponse();

      await controller.post(req, res);

      expect(res.redirect).toHaveBeenCalledWith(req.path);
      expect(req.session.errors).toEqual([{ propertyName: 'noticeEnds', errorType: 'dayRequired', fieldName: 'day' }]);
    });

    it('should stay on page with required error when all date fields are empty', async () => {
      const body = { 'noticeEnds-day': '', 'noticeEnds-month': '', 'noticeEnds-year': '' };
      const controller = new ClaimantNoticeEndController();
      const req = mockRequestEmpty({ body });
      const res = mockResponse();

      await controller.post(req, res);

      expect(res.redirect).toHaveBeenCalledWith(req.path);
      expect(req.session.errors[0].propertyName).toEqual('noticeEnds');
    });

    it('should stay on page when date is in the past', async () => {
      const body = { 'noticeEnds-day': '01', 'noticeEnds-month': '01', 'noticeEnds-year': '2000' };
      const controller = new ClaimantNoticeEndController();
      const req = mockRequestEmpty({ body });
      const res = mockResponse();

      await controller.post(req, res);

      expect(res.redirect).toHaveBeenCalledWith(req.path);
      expect(req.session.errors[0].propertyName).toEqual('noticeEnds');
    });

    it('should stay on page when date is more than 10 years in the future', async () => {
      const body = { 'noticeEnds-day': '01', 'noticeEnds-month': '01', 'noticeEnds-year': '2040' };
      const controller = new ClaimantNoticeEndController();
      const req = mockRequestEmpty({ body });
      const res = mockResponse();

      await controller.post(req, res);

      expect(res.redirect).toHaveBeenCalledWith(req.path);
      expect(req.session.errors[0].propertyName).toEqual('noticeEnds');
    });
  });
});
