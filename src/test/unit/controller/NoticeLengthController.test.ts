import NoticeLengthController from '../../../main/controllers/NoticeLengthController';
import { PageUrls, TranslationKeys } from '../../../main/definitions/constants';
import { mockRequest, mockRequestEmpty } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Notice length Controller', () => {
  const t = {
    'notice-length': {},
    common: {},
  };

  it('should render notice length page', () => {
    const noticeLengthController = new NoticeLengthController();
    const response = mockResponse();
    const request = mockRequest({ t });

    noticeLengthController.get(request, response);
    expect(response.render).toHaveBeenCalledWith(TranslationKeys.NOTICE_LENGTH, expect.anything());
  });

  it('should render the average weekly hours page when valid value is submitted', () => {
    const body = { noticePeriodLength: '2' };
    const controller = new NoticeLengthController();

    const req = mockRequest({ body });
    const res = mockResponse();
    controller.post(req, res);

    expect(res.redirect).toHaveBeenCalledWith(PageUrls.AVERAGE_WEEKLY_HOURS);
  });

  it('should render same page if an invalid value is entered', () => {
    const errors = [{ propertyName: 'noticePeriodLength', errorType: 'notANumber' }];
    const body = { noticePeriodLength: 'a' };
    const controller = new NoticeLengthController();

    const req = mockRequest({ body });
    const res = mockResponse();
    controller.post(req, res);

    expect(res.redirect).toHaveBeenCalledWith(req.path);
    expect(req.session.errors).toEqual(errors);
  });

  it('should render the average weekly hours page when notice period length is left blank', () => {
    const body = { noticePeriodLength: '' };
    const controller = new NoticeLengthController();

    const req = mockRequest({ body });
    const res = mockResponse();
    controller.post(req, res);

    expect(res.redirect).toHaveBeenCalledWith(PageUrls.AVERAGE_WEEKLY_HOURS);
  });

  it('should add the notice period length to the session userCase', () => {
    const body = { noticePeriodLength: '2' };

    const controller = new NoticeLengthController();

    const req = mockRequestEmpty({ body });
    const res = mockResponse();

    controller.post(req, res);

    expect(req.session.userCase).toStrictEqual({
      noticePeriodLength: '2',
    });
  });
});
