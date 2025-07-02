import NoticePeriodController from '../../../main/controllers/NoticePeriodController';
import * as CaseHelper from '../../../main/controllers/helpers/CaseHelpers';
import { AppRequest } from '../../../main/definitions/appRequest';
import { YesOrNo } from '../../../main/definitions/case';
import { PageUrls, TranslationKeys } from '../../../main/definitions/constants';
import { mockRequest, mockRequestEmpty } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

jest.spyOn(CaseHelper, 'handleUpdateDraftCase').mockImplementation(() => Promise.resolve());

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

  it('should clear fields', () => {
    const controller = new NoticePeriodController();
    const response = mockResponse();
    const request = mockRequest({ t });
    request.session.userCase.noticePeriod = YesOrNo.NO;
    request.query = {
      redirect: 'clearSelection',
    };
    controller.get(request, response);
    expect(request.session.userCase.noticePeriod).toStrictEqual(undefined);
  });

  it('should render the notice type page when yes radio button is selected', async () => {
    const body = { noticePeriod: YesOrNo.YES };
    const controller = new NoticePeriodController();

    const req = mockRequest({ body });
    const res = mockResponse();
    await controller.post(req, res);

    expect(res.redirect).toHaveBeenCalledWith(PageUrls.NOTICE_TYPE);
  });

  it('should render the average weekly hours page when no radio button is selected', async () => {
    const body = { noticePeriod: YesOrNo.NO };
    const controller = new NoticePeriodController();

    const req = mockRequest({ body });
    const res = mockResponse();
    await controller.post(req, res);

    expect(res.redirect).toHaveBeenCalledWith(PageUrls.AVERAGE_WEEKLY_HOURS);
  });

  it('should add the notice period selected value to the session userCase', async () => {
    const body = { noticePeriod: YesOrNo.YES };

    const controller = new NoticePeriodController();

    const req = mockRequestEmpty({ body });
    const res = mockResponse();

    await controller.post(req, res);

    expect(req.session.userCase).toStrictEqual({
      noticePeriod: YesOrNo.YES,
      state: 'AWAITING_SUBMISSION_TO_HMCTS',
    });
  });

  it('should reset notice period values if No selected', async () => {
    const body = { noticePeriod: YesOrNo.NO };

    const controller = new NoticePeriodController();

    const req = mockRequestEmpty({ body });
    const res = mockResponse();

    await controller.post(req, res);

    expect(req.session.userCase).toStrictEqual({
      noticePeriod: YesOrNo.NO,
      noticePeriodUnit: undefined,
      noticePeriodLength: undefined,
      state: 'AWAITING_SUBMISSION_TO_HMCTS',
    });
  });
});
