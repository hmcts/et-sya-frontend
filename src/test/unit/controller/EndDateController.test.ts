import EndDateController from '../../../main/controllers/EndDateController';
import { TranslationKeys } from '../../../main/definitions/constants';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('End date Controller', () => {
  const t = {
    'end-date': {},
    common: {},
  };

  it('should render end date page', () => {
    const endDateController = new EndDateController();
    const response = mockResponse();
    const request = mockRequest({ t });

    endDateController.get(request, response);
    expect(response.render).toHaveBeenCalledWith(TranslationKeys.END_DATE, expect.anything());
  });

  it('should redirect to the same screen when date is in the future', async () => {
    const errors = [{ propertyName: 'endDate', errorType: 'invalidDateInFuture', fieldName: 'day' }];
    const body = {
      'endDate-day': '23',
      'endDate-month': '11',
      'endDate-year': '2039',
    };

    const controller = new EndDateController();

    const req = mockRequest({ body });
    const res = mockResponse();
    await controller.post(req, res);

    expect(res.redirect).toHaveBeenCalledWith(req.path);
    expect(req.session.errors).toEqual(errors);
  });

  it('should redirect to the same screen when date is in the 10 years past', async () => {
    const errors = [{ propertyName: 'endDate', errorType: 'invalidDateMoreThanTenYearsInPast', fieldName: 'year' }];
    const body = {
      'endDate-day': '23',
      'endDate-month': '11',
      'endDate-year': '2000',
    };

    const controller = new EndDateController();

    const req = mockRequest({ body });
    const res = mockResponse();
    await controller.post(req, res);

    expect(res.redirect).toHaveBeenCalledWith(req.path);
    expect(req.session.errors).toEqual(errors);
  });

  it('should redirect to the same screen when day is empty', async () => {
    const errors = [{ propertyName: 'endDate', errorType: 'dayRequired', fieldName: 'day' }];
    const body = {
      'endDate-day': '',
      'endDate-month': '11',
      'endDate-year': '2000',
    };

    const controller = new EndDateController();

    const req = mockRequest({ body });
    const res = mockResponse();
    await controller.post(req, res);

    expect(res.redirect).toHaveBeenCalledWith(req.path);
    expect(req.session.errors).toEqual(errors);
  });

  it('should redirect to the same screen when date fields are empty', async () => {
    const errors = [{ propertyName: 'endDate', errorType: 'required', fieldName: 'day' }];
    const body = {
      'endDate-day': '',
      'endDate-month': '',
      'endDate-year': '',
    };

    const controller = new EndDateController();

    const req = mockRequest({ body });
    const res = mockResponse();
    await controller.post(req, res);

    expect(res.redirect).toHaveBeenCalledWith(req.path);
    expect(req.session.errors).toEqual(errors);
  });
});
