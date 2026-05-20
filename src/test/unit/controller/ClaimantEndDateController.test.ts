import ClaimantEndDateController from '../../../main/controllers/ClaimantEndDateController';
import * as CaseHelper from '../../../main/controllers/helpers/CaseHelpers';
import { PageUrls, TranslationKeys } from '../../../main/definitions/constants';
import { mockRequest, mockRequestEmpty } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

jest.spyOn(CaseHelper, 'handleUpdateDraftCase').mockImplementation(() => Promise.resolve());

describe('ClaimantEndDateController', () => {
  const t = {
    'end-date': {},
    common: {},
  };

  describe('get()', () => {
    it('should render the end date page', () => {
      const controller = new ClaimantEndDateController();
      const response = mockResponse();
      const request = mockRequest({ t });

      controller.get(request, response);

      expect(response.render).toHaveBeenCalledWith(TranslationKeys.END_DATE, expect.anything());
    });

    it('should pre-populate form with existing endDate value from session', () => {
      const controller = new ClaimantEndDateController();
      const response = mockResponse();
      const request = mockRequest({ t, userCase: { endDate: { year: '2022', month: '03', day: '10' } } });

      controller.get(request, response);

      expect(response.render).toHaveBeenCalledWith(TranslationKeys.END_DATE, expect.anything());
      expect(request.session.userCase.endDate).toStrictEqual({ year: '2022', month: '03', day: '10' });
    });
  });

  describe('post()', () => {
    it('should redirect to CLAIMANT_NOTICE_PERIOD on a valid past date (AC1)', async () => {
      const body = {
        'endDate-day': '10',
        'endDate-month': '03',
        'endDate-year': '2022',
      };
      const controller = new ClaimantEndDateController();
      const req = mockRequestEmpty({ body });
      const res = mockResponse();

      await controller.post(req, res);

      expect(res.redirect).toHaveBeenCalledWith(PageUrls.CLAIMANT_NOTICE_PERIOD);
    });

    it('should save endDate to session userCase', async () => {
      const body = {
        'endDate-day': '10',
        'endDate-month': '03',
        'endDate-year': '2022',
      };
      const controller = new ClaimantEndDateController();
      const req = mockRequestEmpty({ body });
      const res = mockResponse();

      await controller.post(req, res);

      expect(req.session.userCase.endDate).toStrictEqual({ day: '10', month: '03', year: '2022' });
    });

    it('should stay on page with dayRequired error when day is missing', async () => {
      const body = { 'endDate-day': '', 'endDate-month': '03', 'endDate-year': '2022' };
      const controller = new ClaimantEndDateController();
      const req = mockRequestEmpty({ body });
      const res = mockResponse();

      await controller.post(req, res);

      expect(res.redirect).toHaveBeenCalledWith(req.path);
      expect(req.session.errors).toEqual([{ propertyName: 'endDate', errorType: 'dayRequired', fieldName: 'day' }]);
    });

    it('should stay on page with required error when all date fields are empty', async () => {
      const body = { 'endDate-day': '', 'endDate-month': '', 'endDate-year': '' };
      const controller = new ClaimantEndDateController();
      const req = mockRequestEmpty({ body });
      const res = mockResponse();

      await controller.post(req, res);

      expect(res.redirect).toHaveBeenCalledWith(req.path);
      expect(req.session.errors[0].propertyName).toEqual('endDate');
    });

    it('should stay on page when date is in the future', async () => {
      const body = { 'endDate-day': '01', 'endDate-month': '01', 'endDate-year': '2099' };
      const controller = new ClaimantEndDateController();
      const req = mockRequestEmpty({ body });
      const res = mockResponse();

      await controller.post(req, res);

      expect(res.redirect).toHaveBeenCalledWith(req.path);
      expect(req.session.errors[0].propertyName).toEqual('endDate');
    });

    it('should stay on page when date is more than 10 years in the past', async () => {
      const body = { 'endDate-day': '01', 'endDate-month': '01', 'endDate-year': '2000' };
      const controller = new ClaimantEndDateController();
      const req = mockRequestEmpty({ body });
      const res = mockResponse();

      await controller.post(req, res);

      expect(res.redirect).toHaveBeenCalledWith(req.path);
      expect(req.session.errors[0].propertyName).toEqual('endDate');
    });
  });
});
