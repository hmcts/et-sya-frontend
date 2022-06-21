import NoticeTypeController from '../../../main/controllers/NoticeTypeController';
import { AppRequest } from '../../../main/definitions/appRequest';
import { WeeksOrMonths, YesOrNo } from '../../../main/definitions/case';
import { PageUrls, TranslationKeys } from '../../../main/definitions/constants';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Notice Type Controller', () => {
  const t = {
    'notice-type': {},
    common: {},
  };

  it('should render the notice type page', () => {
    const controller = new NoticeTypeController();
    const response = mockResponse();
    const request = <AppRequest>mockRequest({ t });

    controller.get(request, response);
    expect(response.render).toHaveBeenCalledWith(TranslationKeys.NOTICE_TYPE, expect.anything());
  });

  it('should render the notice length page when weeks or months radio button is selected', () => {
    const body = { noticePeriodUnit: YesOrNo.YES };
    const controller = new NoticeTypeController();

    const req = mockRequest({ body });
    const res = mockResponse();
    controller.post(req, res);

    expect(res.redirect).toBeCalledWith(PageUrls.NOTICE_LENGTH);
  });

  it('should add the notice period to the session userCase', () => {
    const body = { noticePeriodUnit: WeeksOrMonths.WEEKS };

    const controller = new NoticeTypeController();

    const req = mockRequest({ body });
    const res = mockResponse();
    req.session.userCase = undefined;

    controller.post(req, res);

    expect(req.session.userCase).toStrictEqual({
      noticePeriodUnit: WeeksOrMonths.WEEKS,
    });
  });
});
