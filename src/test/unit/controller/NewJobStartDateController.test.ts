import NewJobStartDateController from '../../../main/controllers/NewJobStartDateController';
import * as CaseHelper from '../../../main/controllers/helpers/CaseHelpers';
import { PageUrls, TranslationKeys } from '../../../main/definitions/constants';
import { mockRequest, mockRequestEmpty } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

jest.spyOn(CaseHelper, 'handleUpdateDraftCase').mockImplementation(() => Promise.resolve());

describe('New Job Start Date Controller', () => {
  const t = {
    'new-job-start-date': {},
    common: {},
  };

  it('should render the New Job Start Date page', () => {
    const controller = new NewJobStartDateController();
    const response = mockResponse();
    const request = mockRequest({ t });
    controller.get(request, response);
    expect(response.render).toHaveBeenCalledWith(TranslationKeys.NEW_JOB_START_DATE, expect.anything());
  });

  it('should clear fields', () => {
    const controller = new NewJobStartDateController();
    const response = mockResponse();
    const request = mockRequest({ t });
    request.session.userCase.newJobStartDate = { year: '2023', month: '04', day: '20' };
    request.query = {
      redirect: 'clearSelection',
    };
    controller.get(request, response);
    expect(request.session.userCase.newJobStartDate).toStrictEqual(undefined);
  });

  it('should redirect to the same screen when errors are present', async () => {
    const errors = [{ propertyName: 'newJobStartDate', errorType: 'dayRequired', fieldName: 'day' }];
    const body = {
      'newJobStartDate-day': '',
      'newJobStartDate-month': '11',
      'newJobStartDate-year': '2000',
    };

    const controller = new NewJobStartDateController();

    const req = mockRequestEmpty({ body });
    const res = mockResponse();
    await controller.post(req, res);

    expect(res.redirect).toHaveBeenCalledWith(req.path);
    expect(req.session.errors).toEqual(errors);
  });

  it('should have error when date more than 10 years in future', async () => {
    const errors = [
      { propertyName: 'newJobStartDate', errorType: 'invalidDateMoreThanTenYearsInFuture', fieldName: 'year' },
    ];
    const body = {
      'newJobStartDate-day': '12',
      'newJobStartDate-month': '11',
      'newJobStartDate-year': '2100',
    };

    const controller = new NewJobStartDateController();

    const req = mockRequest({ body });
    const res = mockResponse();
    await controller.post(req, res);

    expect(res.redirect).toHaveBeenCalledWith(req.path);
    expect(req.session.errors).toEqual(errors);
  });

  it('should render the new job pay page when new job start date is left blank', async () => {
    const body = {
      'newJobStartDate-day': '',
      'newJobStartDate-month': '',
      'newJobStartDate-year': '',
    };
    const controller = new NewJobStartDateController();

    const req = mockRequest({ body });
    const res = mockResponse();
    await controller.post(req, res);

    expect(res.redirect).toHaveBeenCalledWith(PageUrls.NEW_JOB_PAY);
  });
});
