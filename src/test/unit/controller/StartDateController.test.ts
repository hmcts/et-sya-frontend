import StartDateController from '../../../main/controllers/StartDateController';
import * as CaseHelper from '../../../main/controllers/helpers/CaseHelpers';
import { StillWorking } from '../../../main/definitions/case';
import { PageUrls } from '../../../main/definitions/constants';
import { mockRequest, mockRequestEmpty } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Start date Controller', () => {
  const t = {
    'start-date': {},
    common: {},
  };

  it('should render start date page', () => {
    const startDateController = new StartDateController();
    const response = mockResponse();
    const request = mockRequest({ t });

    startDateController.get(request, response);

    expect(response.render).toHaveBeenCalledWith('start-date', expect.anything());
    expect(request.session.userCase).toEqual({
      dobDate: {
        year: '2000',
        month: '12',
        day: '24',
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
    const errors = [{ propertyName: 'startDate', errorType: 'dayRequired', fieldName: 'day' }];
    const body = {
      'startDate-day': '',
      'startDate-month': '11',
      'startDate-year': '2000',
    };
    jest.spyOn(CaseHelper, 'handleUpdateDraftCase').mockImplementationOnce(() => Promise.resolve({}));

    const controller = new StartDateController();

    const req = mockRequestEmpty({ body });
    const res = mockResponse();
    controller.post(req, res);

    expect(res.redirect).toHaveBeenCalledWith(req.path);
    expect(req.session.errors).toEqual(errors);
  });

  it('should redirect to notice period when WORKING is selected', () => {
    const body = {
      'startDate-day': '11',
      'startDate-month': '11',
      'startDate-year': '2000',
    };
    jest.spyOn(CaseHelper, 'handleUpdateDraftCase').mockImplementationOnce(() => Promise.resolve({}));
    const userCase = {
      dobDate: { year: '1990', month: '12', day: '24' },
      isStillWorking: StillWorking.WORKING,
    };

    const controller = new StartDateController();

    const req = mockRequestEmpty({ body, userCase });
    const res = mockResponse();
    controller.post(req, res);

    expect(res.redirect).toHaveBeenCalledWith(PageUrls.NOTICE_PERIOD);
  });

  it('should redirect to notice end when NOTICE is selected', () => {
    const body = {
      'startDate-day': '11',
      'startDate-month': '11',
      'startDate-year': '2000',
    };
    const userCase = {
      dobDate: { year: '1990', month: '12', day: '24' },
      isStillWorking: StillWorking.NOTICE,
    };
    jest.spyOn(CaseHelper, 'handleUpdateDraftCase').mockImplementationOnce(() => Promise.resolve({}));

    const controller = new StartDateController();

    const req = mockRequest({ body, userCase });
    const res = mockResponse();
    controller.post(req, res);

    expect(res.redirect).toHaveBeenCalledWith(PageUrls.NOTICE_END);
  });

  it('should redirect to employment end date when NO_LONGER_WORKING is selected', () => {
    const body = {
      'startDate-day': '11',
      'startDate-month': '11',
      'startDate-year': '2000',
    };
    const userCase = {
      dobDate: { year: '1990', month: '12', day: '24' },
      isStillWorking: StillWorking.NO_LONGER_WORKING,
    };
    jest.spyOn(CaseHelper, 'handleUpdateDraftCase').mockImplementationOnce(() => Promise.resolve({}));

    const controller = new StartDateController();

    const req = mockRequest({ body, userCase });
    const res = mockResponse();
    controller.post(req, res);

    expect(res.redirect).toHaveBeenCalledWith(PageUrls.END_DATE);
  });
});
