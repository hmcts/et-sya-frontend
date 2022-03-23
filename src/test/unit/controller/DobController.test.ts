import DobController from '../../../main/controllers/DobController';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Dob Controller', () => {
  const t = {
    'date-of-birth': {},
    common: {},
  };

  it('should render the DobController page', () => {
    const dobController = new DobController();

    const response = mockResponse();
    const request = mockRequest({ t });

    dobController.get(request, response);

    expect(response.render).toHaveBeenCalledWith('date-of-birth', expect.anything());
    expect(request.session.userCase).toEqual({
      dobDate: {
        day: '24',
        month: '12',
        year: '2000',
      },
      startDate: {
        day: '21',
        month: '04',
        year: '2019',
      },
      id: '1234',
    });
  });

  it('should redirect to the same screen when errors are present', () => {
    const errors = [{ propertyName: 'dobDate', errorType: 'dayRequired', fieldName: 'day' }];
    const body = {
      'dobDate-day': '',
      'dobDate-month': '11',
      'dobDate-year': '2000',
    };

    const controller = new DobController();

    const req = mockRequest({ body });
    const res = mockResponse();
    controller.post(req, res);

    expect(req.session.userCase).toEqual({
      id: '1234',
      dobDate: {
        day: '',
        month: '11',
        year: '2000',
      },
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
