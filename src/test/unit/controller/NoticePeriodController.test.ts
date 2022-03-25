import NoticePeriodController from '../../../main/controllers/NoticePeriodController';
import { AppRequest } from '../../../main/definitions/appRequest';
import { PageUrls, TranslationKeys } from '../../../main/definitions/constants';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Update Notice Period Controller', () => {
  const t = {
    'notice-period': {},
    common: {},
  };

  it('should render the next page', () => {
    const controller = new NoticePeriodController();
    const response = mockResponse();
    const request = <AppRequest>mockRequest({ t });

    controller.get(request, response);
    expect(response.render).toHaveBeenCalledWith(TranslationKeys.NOTICE_PERIOD, expect.anything());
  });

  it('should redirect to the same screen when errors are present', () => {
    const errors = [
      {
        propertyName: 'noticePeriodUnit',
        errorType: 'required',
      },
      {
        propertyName: 'noticePeriodLength',
        errorType: 'invalid',
      },
    ];
    const body = { noticePeriod: 'Yes', noticePeriodUnit: '', noticePeriodLength: '' };
    const controller = new NoticePeriodController();

    const req = mockRequest({ body });
    const res = mockResponse();
    controller.post(req, res);

    expect(req.session.errors).toEqual(errors);
    expect(res.redirect).toBeCalledWith(req.path);
  });

  it('should assign userCase from notice period form data', () => {
    const body = { noticePeriod: 'Yes', noticePeriodLength: '2', noticePeriodUnit: 'Weeks' };
    const controller = new NoticePeriodController();

    const req = mockRequest({ body });
    const res = mockResponse();
    req.session.userCase = undefined;

    controller.post(req, res);

    expect(res.redirect).toBeCalledWith(PageUrls.AVERAGE_WEEKLY_HOURS);
    expect(req.session.userCase).toStrictEqual({
      noticePeriod: 'Yes',
      noticePeriodLength: '2',
      noticePeriodUnit: 'Weeks',
    });
  });
});
