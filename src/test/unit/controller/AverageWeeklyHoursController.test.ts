import AverageWeeklyHoursController from '../../../main/controllers/AverageWeeklyHoursController';
import { PageUrls, TranslationKeys } from '../../../main/definitions/constants';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Average weekly hours Controller', () => {
  const t = {
    'average-weekly-hours': {},
    common: {},
  };

  it('should render average weekly hours page', () => {
    const averageWeeklyHoursController = new AverageWeeklyHoursController();
    const response = mockResponse();
    const request = mockRequest({ t });

    averageWeeklyHoursController.get(request, response);
    expect(response.render).toHaveBeenCalledWith(TranslationKeys.AVERAGE_WEEKLY_HOURS, expect.anything());
  });

  it('should render the pay page when correct value of hours added to input field and the page submitted', () => {
    const body = { avgWeeklyHrs: '2' };
    const controller = new AverageWeeklyHoursController();

    const req = mockRequest({ body });
    const res = mockResponse();
    controller.post(req, res);

    expect(res.redirect).toBeCalledWith(PageUrls.PAY);
  });

  it('should add average weekly hours to the session userCase', () => {
    const body = { avgWeeklyHrs: '3' };

    const controller = new AverageWeeklyHoursController();

    const req = mockRequest({ body });
    const res = mockResponse();
    req.session.userCase = undefined;

    controller.post(req, res);

    expect(req.session.userCase).toStrictEqual({
      avgWeeklyHrs: '3',
    });
  });
});
