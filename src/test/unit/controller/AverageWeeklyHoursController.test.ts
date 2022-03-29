import AverageWeeklyHoursController from '../../../main/controllers/AverageWeeklyHoursController';
import { TranslationKeys } from '../../../main/definitions/constants';
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
});
