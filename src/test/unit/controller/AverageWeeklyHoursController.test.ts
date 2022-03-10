import AverageWeeklyHoursController from '../../../main/controllers/average_weekly_hours/AverageWeeklyHoursController';
import { TranslationKeys } from '../../../main/definitions/constants';
import { FormContent } from '../../../main/definitions/form';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Average weekly hours Controller', () => {
  const t = {
    'average-weekly-hours': {},
    common: {},
  };

  const mockFormContent = {
    fields: {},
  } as unknown as FormContent;

  it('should render average weekly hours page', () => {
    const averageWeeklyHoursController = new AverageWeeklyHoursController(mockFormContent);
    const response = mockResponse();
    const request = mockRequest({ t });

    averageWeeklyHoursController.get(request, response);
    expect(response.render).toHaveBeenCalledWith(TranslationKeys.AVERAGE_WEEKLY_HOURS, expect.anything());
  });
});
