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

  it('should redirect to the same screen when errors are present', () => {
    const errors = [{ propertyName: 'endDate', errorType: 'dayRequired', fieldName: 'day' }];
    const body = {
      'endDate-day': '',
      'endDate-month': '11',
      'endDate-year': '2000',
    };

    const controller = new EndDateController();

    const req = mockRequest({ body });
    const res = mockResponse();
    controller.post(req, res);

    expect(req.session.userCase).toEqual({
      dobDate: {
        year: '2000',
        month: '12',
        day: '24',
      },
      endDate: {
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
