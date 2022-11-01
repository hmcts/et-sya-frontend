import NoticeEndController from '../../../main/controllers/NoticeEndController';
import { PageUrls, TranslationKeys } from '../../../main/definitions/constants';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Notice end Controller', () => {
  const t = {
    'notice-end': {},
    common: {},
  };

  it('should render notice end page', () => {
    const noticeEndController = new NoticeEndController();
    const response = mockResponse();
    const request = mockRequest({ t });

    noticeEndController.get(request, response);
    expect(response.render).toHaveBeenCalledWith(TranslationKeys.NOTICE_END, expect.anything());

    const body = { noticeEnds: '' };
    const req = mockRequest({ body });
    const res = mockResponse();
    noticeEndController.post(req, res);
    expect(response.render).toHaveBeenCalledWith(TranslationKeys.NOTICE_END, expect.anything());
  });

  it('should redirect to notice type on successful post', () => {
    const body = {
      'noticeEnds-day': '21',

      'noticeEnds-month': '01',

      'noticeEnds-year': '2023',
    };

    const controller = new NoticeEndController();
    const req = mockRequest({ body });

    const res = mockResponse();

    controller.post(req, res);

    expect(res.redirect).toHaveBeenCalledWith(PageUrls.NOTICE_TYPE);
  });

  it('should redirect to the same screen when errors are present', () => {
    const errors = [{ propertyName: 'noticeEnds', errorType: 'dayRequired', fieldName: 'day' }];
    const body = { noticeEnds: '' };
    const controller = new NoticeEndController();
    const req = mockRequest({ body });
    const res = mockResponse();

    controller.post(req, res);
    expect(res.redirect).toHaveBeenCalledWith(req.path);
    expect(req.session.errors).toEqual(errors);
  });

  it('should redirect to the same screen when date is in the future', () => {
    const errors = [
      { propertyName: 'noticeEnds', errorType: 'invalidDateMoreThanTenYearsInFuture', fieldName: 'year' },
    ];
    const body = {
      'noticeEnds-day': '23',
      'noticeEnds-month': '11',
      'noticeEnds-year': '2039',
    };
    const controller = new NoticeEndController();
    const req = mockRequest({ body });
    const res = mockResponse();

    controller.post(req, res);
    expect(res.redirect).toHaveBeenCalledWith(req.path);
    expect(req.session.errors).toEqual(errors);
  });

  it('should redirect to the same screen when date is in the 10 years past', () => {
    const errors = [{ propertyName: 'noticeEnds', errorType: 'invalidDateInPast', fieldName: 'day' }];
    const body = {
      'noticeEnds-day': '23',
      'noticeEnds-month': '11',
      'noticeEnds-year': '2000',
    };
    const controller = new NoticeEndController();
    const req = mockRequest({ body });
    const res = mockResponse();

    controller.post(req, res);
    expect(res.redirect).toHaveBeenCalledWith(req.path);
    expect(req.session.errors).toEqual(errors);
  });

  it('should redirect to the same screen when date fields are empty', () => {
    const errors = [{ propertyName: 'noticeEnds', errorType: 'required', fieldName: 'day' }];
    const body = {
      'noticeEnds-day': '',
      'noticeEnds-month': '',
      'noticeEnds-year': '',
    };
    const controller = new NoticeEndController();
    const req = mockRequest({ body });
    const res = mockResponse();

    controller.post(req, res);
    expect(res.redirect).toHaveBeenCalledWith(req.path);
    expect(req.session.errors).toEqual(errors);
  });
});
