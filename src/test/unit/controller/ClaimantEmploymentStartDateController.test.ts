import ClaimantEmploymentStartDateController from '../../../main/controllers/ClaimantEmploymentStartDateController';
import * as CaseHelper from '../../../main/controllers/helpers/CaseHelpers';
import { PageUrls, TranslationKeys } from '../../../main/definitions/constants';
import { mockRequest, mockRequestEmpty } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

jest.spyOn(CaseHelper, 'handleUpdateDraftCase').mockImplementation(() => Promise.resolve());

describe('ClaimantEmploymentStartDateController', () => {
  const t = {
    'claimant-employment-start-date': {},
    common: {},
  };

  describe('get()', () => {
    it('should render the claimant employment start date page', () => {
      const controller = new ClaimantEmploymentStartDateController();
      const response = mockResponse();
      const request = mockRequest({ t });

      controller.get(request, response);

      expect(response.render).toHaveBeenCalledWith(TranslationKeys.CLAIMANT_EMPLOYMENT_START_DATE, expect.anything());
    });

    it('should pre-populate form with existing startDate value from session', () => {
      const controller = new ClaimantEmploymentStartDateController();
      const response = mockResponse();
      const request = mockRequest({ t, userCase: { startDate: { year: '2020', month: '06', day: '15' } } });

      controller.get(request, response);

      expect(response.render).toHaveBeenCalledWith(TranslationKeys.CLAIMANT_EMPLOYMENT_START_DATE, expect.anything());
      expect(request.session.userCase.startDate).toStrictEqual({ year: '2020', month: '06', day: '15' });
    });
  });

  describe('post()', () => {
    it('should redirect to DID_CLAIMANT_HAVE_WRITTEN_CONTRACT on a valid date', async () => {
      const body = { 'startDate-day': '15', 'startDate-month': '06', 'startDate-year': '2020' };
      const controller = new ClaimantEmploymentStartDateController();
      const req = mockRequestEmpty({ body, userCase: { dobDate: { year: '1990', month: '01', day: '01' } } });
      const res = mockResponse();

      await controller.post(req, res);

      expect(res.redirect).toHaveBeenCalledWith(PageUrls.DID_CLAIMANT_HAVE_WRITTEN_CONTRACT);
    });

    it('should save startDate to session userCase', async () => {
      const body = { 'startDate-day': '15', 'startDate-month': '06', 'startDate-year': '2020' };
      const controller = new ClaimantEmploymentStartDateController();
      const req = mockRequestEmpty({ body, userCase: { dobDate: { year: '1990', month: '01', day: '01' } } });
      const res = mockResponse();

      await controller.post(req, res);

      expect(req.session.userCase.startDate).toStrictEqual({ day: '15', month: '06', year: '2020' });
    });

    it('should redirect to DID_CLAIMANT_HAVE_WRITTEN_CONTRACT when all date fields are empty (optional)', async () => {
      const body = { 'startDate-day': '', 'startDate-month': '', 'startDate-year': '' };
      const controller = new ClaimantEmploymentStartDateController();
      const req = mockRequestEmpty({ body });
      const res = mockResponse();

      await controller.post(req, res);

      expect(res.redirect).toHaveBeenCalledWith(PageUrls.DID_CLAIMANT_HAVE_WRITTEN_CONTRACT);
      expect(req.session.errors).toHaveLength(0);
    });

    it('should redirect to the same page and set dayRequired error when day is missing', async () => {
      const body = { 'startDate-day': '', 'startDate-month': '06', 'startDate-year': '2020' };
      const controller = new ClaimantEmploymentStartDateController();
      const req = mockRequestEmpty({ body });
      const res = mockResponse();

      await controller.post(req, res);

      expect(res.redirect).toHaveBeenCalledWith(req.path);
      expect(req.session.errors).toEqual([{ propertyName: 'startDate', errorType: 'dayRequired', fieldName: 'day' }]);
    });

    it('should redirect to the same page and set monthRequired error when month is missing', async () => {
      const body = { 'startDate-day': '15', 'startDate-month': '', 'startDate-year': '2020' };
      const controller = new ClaimantEmploymentStartDateController();
      const req = mockRequestEmpty({ body });
      const res = mockResponse();

      await controller.post(req, res);

      expect(res.redirect).toHaveBeenCalledWith(req.path);
      expect(req.session.errors).toEqual([
        { propertyName: 'startDate', errorType: 'monthRequired', fieldName: 'month' },
      ]);
    });

    it('should redirect to the same page and set yearRequired error when year is missing', async () => {
      const body = { 'startDate-day': '15', 'startDate-month': '06', 'startDate-year': '' };
      const controller = new ClaimantEmploymentStartDateController();
      const req = mockRequestEmpty({ body });
      const res = mockResponse();

      await controller.post(req, res);

      expect(res.redirect).toHaveBeenCalledWith(req.path);
      expect(req.session.errors).toEqual([{ propertyName: 'startDate', errorType: 'yearRequired', fieldName: 'year' }]);
    });

    it('should redirect to the same page when date is in the future', async () => {
      const body = { 'startDate-day': '01', 'startDate-month': '01', 'startDate-year': '2099' };
      const controller = new ClaimantEmploymentStartDateController();
      const req = mockRequestEmpty({ body });
      const res = mockResponse();

      await controller.post(req, res);

      expect(res.redirect).toHaveBeenCalledWith(req.path);
      expect(req.session.errors[0].propertyName).toEqual('startDate');
    });

    it('should redirect to the same page when date values are not numbers', async () => {
      const body = { 'startDate-day': 'aa', 'startDate-month': '06', 'startDate-year': '2020' };
      const controller = new ClaimantEmploymentStartDateController();
      const req = mockRequestEmpty({ body });
      const res = mockResponse();

      await controller.post(req, res);

      expect(res.redirect).toHaveBeenCalledWith(req.path);
      expect(req.session.errors[0].propertyName).toEqual('startDate');
    });
  });
});
