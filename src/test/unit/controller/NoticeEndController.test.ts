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

  it('should redirect to notice period pay on successful post', () => {
    const body = {
      'noticeEnds-day': '21',

      'noticeEnds-month': '01',

      'noticeEnds-year': '2022',
    };

    const controller = new NoticeEndController();
    const req = mockRequest({ body });

    const res = mockResponse();

    controller.post(req, res);

    expect(res.redirect).toBeCalledWith(PageUrls.NOTICE_PAY);
  });

  it('should redirect to the same screen when errors are present', () => {
    const errors = [{ propertyName: 'noticeEnds', errorType: 'dayRequired', fieldName: 'day' }];
    const body = { noticeEnd: '' };
    const controller = new NoticeEndController();
    const req = mockRequest({ body });
    const res = mockResponse();

    controller.post(req, res);
    expect(res.redirect).toBeCalledWith(req.path);
    expect(req.session.errors).toEqual(errors);
  });
});
