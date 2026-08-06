import DateOfLastEventController from '../../../main/controllers/DateOfLastEventController';
import { PageUrls, TranslationKeys } from '../../../main/definitions/constants';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Date of last event Controller', () => {
  const t = {
    'date-of-last-event': {},
    common: {},
  };

  it('should render date of last event page', () => {
    const controller = new DateOfLastEventController();
    const response = mockResponse();
    const request = mockRequest({ t });

    controller.get(request, response);
    expect(response.render).toHaveBeenCalledWith(TranslationKeys.DATE_OF_LAST_EVENT, expect.anything());
  });

  it('should redirect to describe-what-happened on valid date post', async () => {
    const body = {
      'dateOfLastEvent-day': '15',
      'dateOfLastEvent-month': '05',
      'dateOfLastEvent-year': '2023',
    };

    const controller = new DateOfLastEventController();
    const req = mockRequest({ body });
    const res = mockResponse();
    await controller.post(req, res);

    expect(res.redirect).toHaveBeenCalledWith(PageUrls.DESCRIBE_WHAT_HAPPENED);
  });

  it("should redirect to describe-what-happened on today's date post", async () => {
    const now = new Date();
    const body = {
      'dateOfLastEvent-day': `${now.getDate()}`,
      'dateOfLastEvent-month': `${now.getMonth() + 1}`,
      'dateOfLastEvent-year': `${now.getFullYear()}`,
    };

    const controller = new DateOfLastEventController();
    const req = mockRequest({ body });
    const res = mockResponse();
    await controller.post(req, res);

    expect(res.redirect).toHaveBeenCalledWith(PageUrls.DESCRIBE_WHAT_HAPPENED);
  });

  it('should redirect to the same screen when date is in the future', async () => {
    const errors = [{ propertyName: 'dateOfLastEvent', errorType: 'invalidDateInFuture', fieldName: 'day' }];
    const body = {
      'dateOfLastEvent-day': '23',
      'dateOfLastEvent-month': '11',
      'dateOfLastEvent-year': '2039',
    };

    const controller = new DateOfLastEventController();
    const req = mockRequest({ body });
    const res = mockResponse();
    await controller.post(req, res);

    expect(res.redirect).toHaveBeenCalledWith(req.path);
    expect(req.session.errors).toEqual(errors);
  });

  it('should redirect to the same screen when date fields are empty', async () => {
    const errors = [{ propertyName: 'dateOfLastEvent', errorType: 'required', fieldName: 'day' }];
    const body = {
      'dateOfLastEvent-day': '',
      'dateOfLastEvent-month': '',
      'dateOfLastEvent-year': '',
    };

    const controller = new DateOfLastEventController();
    const req = mockRequest({ body });
    const res = mockResponse();
    await controller.post(req, res);

    expect(res.redirect).toHaveBeenCalledWith(req.path);
    expect(req.session.errors).toEqual(errors);
  });
});
