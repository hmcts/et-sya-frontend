import noticePeriodNolongerworkingController from '../../../main/controllers/noticePeriodNolongerworkingController';
import { AppRequest } from '../../../main/definitions/appRequest';
import { TranslationKeys } from '../../../main/definitions/constants';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Update Notice Period No Longer Working Controller', () => {
  const t = {
    'notice-period-no-longer-working': {},
    common: {},
  };

  it('should render the next page', () => {
    const controller = new noticePeriodNolongerworkingController();
    const response = mockResponse();
    const request = <AppRequest>mockRequest({ t });

    controller.get(request, response);
    expect(response.render).toHaveBeenCalledWith(TranslationKeys.NOTICE_PERIOD_NO_LONGER_WORKING, expect.anything());
  });
});
