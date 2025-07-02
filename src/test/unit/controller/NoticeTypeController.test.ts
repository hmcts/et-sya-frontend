import NoticeTypeController from '../../../main/controllers/NoticeTypeController';
import * as CaseHelper from '../../../main/controllers/helpers/CaseHelpers';
import { AppRequest } from '../../../main/definitions/appRequest';
import { WeeksOrMonths } from '../../../main/definitions/case';
import { PageUrls, TranslationKeys } from '../../../main/definitions/constants';
import { mockRequest, mockRequestEmpty } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

jest.spyOn(CaseHelper, 'handleUpdateDraftCase').mockImplementation(() => Promise.resolve());

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

  it('should clear fields', () => {
    const controller = new NoticeTypeController();
    const response = mockResponse();
    const request = mockRequest({ t });
    request.session.userCase.noticePeriodUnit = WeeksOrMonths.MONTHS;
    request.query = {
      redirect: 'clearSelection',
    };
    controller.get(request, response);
    expect(request.session.userCase.noticePeriodUnit).toStrictEqual(undefined);
  });

  it('should render the notice length page when weeks or months radio button is selected', async () => {
    const body = { noticePeriodUnit: WeeksOrMonths.WEEKS };
    const controller = new NoticeTypeController();

    const req = mockRequest({ body });
    const res = mockResponse();
    await controller.post(req, res);

    expect(res.redirect).toHaveBeenCalledWith(PageUrls.NOTICE_LENGTH);
  });

  it('should render the average weekly hours page when neither radio button is selected', async () => {
    const body = { noticePeriodUnit: '' };
    const controller = new NoticeTypeController();

    const req = mockRequest({ body });
    const res = mockResponse();
    await controller.post(req, res);

    expect(res.redirect).toHaveBeenCalledWith(PageUrls.AVERAGE_WEEKLY_HOURS);
  });

  it('should add the notice period to the session userCase', async () => {
    const body = { noticePeriodUnit: WeeksOrMonths.WEEKS };

    const controller = new NoticeTypeController();

    const req = mockRequestEmpty({ body });
    const res = mockResponse();

    await controller.post(req, res);

    expect(req.session.userCase).toStrictEqual({
      noticePeriodUnit: WeeksOrMonths.WEEKS,
      state: 'AWAITING_SUBMISSION_TO_HMCTS',
    });
  });
});
