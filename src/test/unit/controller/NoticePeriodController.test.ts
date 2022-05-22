import NoticePeriodController from '../../../main/controllers/NoticePeriodController';
import { AppRequest } from '../../../main/definitions/appRequest';
import { TranslationKeys } from '../../../main/definitions/constants';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Notice Period Controller', () => {
  const t = {
    'notice-period': {},
    common: {},
  };

  it('should render the notice period page', () => {
    const controller = new NoticePeriodController();
    const response = mockResponse();
    const request = <AppRequest>mockRequest({ t });

    controller.get(request, response);
    expect(response.render).toHaveBeenCalledWith(TranslationKeys.NOTICE_PERIOD, expect.anything());
  });
});
