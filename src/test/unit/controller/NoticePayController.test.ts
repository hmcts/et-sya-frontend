import NoticePayController from '../../../main/controllers/NoticePayController';
import { PageUrls, TranslationKeys } from '../../../main/definitions/constants';
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

  it('should redirect to Average weekly hours on successful post', () => {
    // User selects 'No'
    const body = {
      noticePeriodUnit: '',
      noticePeriodUnitPaid: '',
      noticePeriodLength: '',
    };

    const controller = new NoticePayController();
    const req = mockRequest({ body });
    const res = mockResponse();
    req.session.userCase = undefined;

    controller.post(req, res);

    expect(res.redirect).toBeCalledWith(PageUrls.AVERAGE_WEEKLY_HOURS);
    expect(req.session.userCase).toStrictEqual({
      noticePeriodLength: '',
      noticePeriodUnit: '',
      noticePeriodUnitPaid: '',
    });
  });
});
