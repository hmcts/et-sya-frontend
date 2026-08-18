import DateOfLastEventController from '../../../main/controllers/DateOfLastEventController';
import { PageUrls, TranslationKeys } from '../../../main/definitions/constants';
import * as LaunchDarkly from '../../../main/modules/featureFlag/launchDarkly';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Date of last event Controller', () => {
  const t = {
    'date-of-last-event': {},
    common: {},
  };
  beforeEach(() => {
    jest.spyOn(LaunchDarkly, 'getFlagValue').mockResolvedValue(true);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should render date of last event page when the ERA feature is enabled', async () => {
    const controller = new DateOfLastEventController();
    const response = mockResponse();
    const request = mockRequest({ t });
    await controller.get(request, response);
    expect(response.render).toHaveBeenCalledWith(TranslationKeys.DATE_OF_LAST_EVENT, expect.anything());
  });

  it('should redirect to describe what happened when the ERA feature is disabled', async () => {
    jest.spyOn(LaunchDarkly, 'getFlagValue').mockResolvedValue(false);
    const response = mockResponse();

    await new DateOfLastEventController().get(mockRequest({ t }), response);

    expect(response.redirect).toHaveBeenCalledWith(PageUrls.DESCRIBE_WHAT_HAPPENED);
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

  it('should not save a date when the ERA feature is disabled', async () => {
    jest.spyOn(LaunchDarkly, 'getFlagValue').mockResolvedValue(false);
    const req = mockRequest({
      body: {
        'dateOfLastEvent-day': '15',
        'dateOfLastEvent-month': '05',
        'dateOfLastEvent-year': '2023',
      },
    });
    const res = mockResponse();

    await new DateOfLastEventController().post(req, res);

    expect(req.session.userCase.dateOfLastEvent).toBeUndefined();
    expect(res.redirect).toHaveBeenCalledWith(PageUrls.DESCRIBE_WHAT_HAPPENED);
  });
});
