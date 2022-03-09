import NoticePayController from '../../../main/controllers/notice_pay/NoticePayController';
import { TranslationKeys } from '../../../main/definitions/constants';
import { FormContent } from '../../../main/definitions/form';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Notice pay Controller', () => {
  const t = {
    'notice-pay': {},
    common: {},
  };

  const mockFormContent = {
    fields: {},
  } as unknown as FormContent;

  it('should render notice pay page', () => {
    const noticePayController = new NoticePayController(mockFormContent);
    const response = mockResponse();
    const request = mockRequest({ t });

    noticePayController.get(request, response);
    expect(response.render).toHaveBeenCalledWith(TranslationKeys.NOTICE_PAY, expect.anything());
  });
});
