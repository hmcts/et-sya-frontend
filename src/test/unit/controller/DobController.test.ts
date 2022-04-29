import DobController from '../../../main/controllers/DobController';
import { PageUrls } from '../../../main/definitions/constants';
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

  it('should update draft case when date is submitted', async () => {
    const body = {
      'dobDate-day': '05',
      'dobDate-month': '11',
      'dobDate-year': '2000',
    };
    const dobController = new DobController();
    const response = mockResponse();
    const request = mockRequest({ body });
    dobController.post(request, response);

    expect(request.session.userCase).toEqual({
      dobDate: {
        day: '05',
        month: '11',
        year: '2000',
      },
      id: '1234',
      startDate: { day: '21', month: '04', year: '2019' },
    });
  });

  it('should go to the Gender details page when correct date is entered', () => {
    const body = {
      'dobDate-year': '2000',
      'dobDate-month': '11',
      'dobDate-day': '24',
    };

    const controller = new DobController();

    const req = mockRequest({ body });
    const res = mockResponse();
    controller.post(req, res);

    expect(req.session.userCase).toEqual({
      id: '1234',
      dobDate: {
        day: '24',
        month: '11',
        year: '2000',
      },
      startDate: {
        day: '21',
        month: '04',
        year: '2019',
      },
    });

    expect(res.redirect).toBeCalledWith(PageUrls.GENDER_DETAILS);
  });
});
