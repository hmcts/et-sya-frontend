import NoticePayController from '../../../main/controllers/NoticePayController';
import { TranslationKeys } from '../../../main/definitions/constants';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Notice pay Controller', () => {
  const t = {
    'notice-pay': {},
    common: {},
  };

  it('should render notice pay page', () => {
    const noticePayController = new NoticePayController();
    const response = mockResponse();
    const request = mockRequest({ t });

    noticePayController.get(request, response);
    expect(response.render).toHaveBeenCalledWith(TranslationKeys.NOTICE_PAY, expect.anything());
  });
});
