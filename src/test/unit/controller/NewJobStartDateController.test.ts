import NewJobStartDateController from '../../../main/controllers/NewJobStartDateController';
import { TranslationKeys } from '../../../main/definitions/constants';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

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

  it('should redirect to the same screen when errors are present', () => {
    const errors = [{ propertyName: 'newJobStartDate', errorType: 'dayRequired', fieldName: 'day' }];
    const body = {
      'newJobStartDate-day': '',
      'newJobStartDate-month': '11',
      'newJobStartDate-year': '2000',
    };

    const controller = new NewJobStartDateController();

    const req = mockRequest({ body });
    const res = mockResponse();
    controller.post(req, res);

    expect(req.session.userCase).toEqual({
      dobDate: {
        year: '2000',
        month: '12',
        day: '24',
      },
      newJobStartDate: {
        day: '',
        month: '11',
        year: '2000',
      },
      id: '1234',
      startDate: {
        day: '21',
        month: '04',
        year: '2019',
      },
    });

    expect(res.redirect).toBeCalledWith(req.path);
    expect(req.session.errors).toEqual(errors);
  });
});
