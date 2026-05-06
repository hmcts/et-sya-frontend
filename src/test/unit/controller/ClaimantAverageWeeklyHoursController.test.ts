import ClaimantAverageWeeklyHoursController from '../../../main/controllers/ClaimantAverageWeeklyHoursController';
import * as CaseHelper from '../../../main/controllers/helpers/CaseHelpers';
import { PageUrls, TranslationKeys } from '../../../main/definitions/constants';
import { mockRequest, mockRequestEmpty } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

jest.spyOn(CaseHelper, 'handleUpdateDraftCase').mockImplementation(() => Promise.resolve());

describe('ClaimantAverageWeeklyHoursController', () => {
  const t = {
    'claimant-average-weekly-hours': {},
    common: {},
  };

  describe('get()', () => {
    it('should render the claimant average weekly hours page', () => {
      const controller = new ClaimantAverageWeeklyHoursController();
      const response = mockResponse();
      const request = mockRequest({ t });

      controller.get(request, response);

      expect(response.render).toHaveBeenCalledWith(TranslationKeys.CLAIMANT_AVERAGE_WEEKLY_HOURS, expect.anything());
    });

    it('should pre-populate form with existing avgWeeklyHrs value from session', () => {
      const controller = new ClaimantAverageWeeklyHoursController();
      const response = mockResponse();
      const request = mockRequest({ t, userCase: { avgWeeklyHrs: 37.5 } });

      controller.get(request, response);

      expect(response.render).toHaveBeenCalledWith(TranslationKeys.CLAIMANT_AVERAGE_WEEKLY_HOURS, expect.anything());
      expect(request.session.userCase.avgWeeklyHrs).toEqual(37.5);
    });
  });

  describe('post()', () => {
    it('should redirect to PAY on a valid number of hours', async () => {
      const body = { avgWeeklyHrs: '37' };
      const controller = new ClaimantAverageWeeklyHoursController();
      const req = mockRequestEmpty({ body });
      const res = mockResponse();

      await controller.post(req, res);

      expect(res.redirect).toHaveBeenCalledWith(PageUrls.PAY);
    });

    it('should redirect to PAY when hours field is empty (optional)', async () => {
      const body = { avgWeeklyHrs: '' };
      const controller = new ClaimantAverageWeeklyHoursController();
      const req = mockRequestEmpty({ body });
      const res = mockResponse();

      await controller.post(req, res);

      expect(res.redirect).toHaveBeenCalledWith(PageUrls.PAY);
    });

    it('should stay on the page and return an error when hours exceed 168', async () => {
      const body = { avgWeeklyHrs: '169' };
      const controller = new ClaimantAverageWeeklyHoursController();
      const req = mockRequestEmpty({ body });
      const res = mockResponse();

      await controller.post(req, res);

      expect(res.redirect).toHaveBeenCalledWith(req.path);
      expect(req.session.errors).toEqual([{ propertyName: 'avgWeeklyHrs', errorType: 'exceeded' }]);
    });

    it('should stay on the page and return an error when value is not a number', async () => {
      const body = { avgWeeklyHrs: 'abc' };
      const controller = new ClaimantAverageWeeklyHoursController();
      const req = mockRequestEmpty({ body });
      const res = mockResponse();

      await controller.post(req, res);

      expect(res.redirect).toHaveBeenCalledWith(req.path);
      expect(req.session.errors).toEqual([{ propertyName: 'avgWeeklyHrs', errorType: 'notANumber' }]);
    });

    it('should stay on the page and return an error when value is negative', async () => {
      const body = { avgWeeklyHrs: '-5' };
      const controller = new ClaimantAverageWeeklyHoursController();
      const req = mockRequestEmpty({ body });
      const res = mockResponse();

      await controller.post(req, res);

      expect(res.redirect).toHaveBeenCalledWith(req.path);
      expect(req.session.errors).toEqual([{ propertyName: 'avgWeeklyHrs', errorType: 'negativeNumber' }]);
    });
  });
});
