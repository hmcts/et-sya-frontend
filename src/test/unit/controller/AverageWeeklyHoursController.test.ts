import AverageWeeklyHoursController from '../../../main/controllers/AverageWeeklyHoursController';
import * as CaseHelper from '../../../main/controllers/helpers/CaseHelpers';
import { PageUrls, TranslationKeys } from '../../../main/definitions/constants';
import { mockRequest, mockRequestEmpty } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

jest.spyOn(CaseHelper, 'handleUpdateDraftCase').mockImplementation(() => Promise.resolve());

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

  it('should render the pay page when correct value of hours added to input field and the page submitted', async () => {
    const body = { avgWeeklyHrs: '2' };
    const controller = new AverageWeeklyHoursController();

    const req = mockRequest({ body });
    const res = mockResponse();
    await controller.post(req, res);

    expect(res.redirect).toHaveBeenCalledWith(PageUrls.PAY);
  });

  it('should add average weekly hours to the session userCase', async () => {
    const body = { avgWeeklyHrs: '3' };

    const controller = new AverageWeeklyHoursController();

    const req = mockRequestEmpty({ body });
    const res = mockResponse();

    await controller.post(req, res);

    expect(req.session.userCase).toStrictEqual({
      avgWeeklyHrs: '3',
    });
  });
});
