import StartDateController from '../../../main/controllers/start_date/StartDateController';
import { StillWorking } from '../../../main/definitions/case';
import { PageUrls, TranslationKeys } from '../../../main/definitions/constants';
import { FormContent } from '../../../main/definitions/form';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Start date Controller', () => {
  const t = {
    'start-date': {},
    common: {},
  };

  const mockFormContent = {
    fields: {},
  } as unknown as FormContent;

  it('should render start date page', () => {
    const startDateController = new StartDateController(mockFormContent);
    const response = mockResponse();
    const request = mockRequest({ t });

    startDateController.get(request, response);
    expect(response.render).toHaveBeenCalledWith(TranslationKeys.START_DATE, expect.anything());
  });

  it('should redirect to notice period when WORKING is selected', () => {
    const body = {};
    const userCase = {
      dobDate: { year: '1990', month: '12', day: '24' },
      id: '1234',
      isStillWorking: StillWorking.WORKING,
    };

    const controller = new StartDateController(mockFormContent);

    const req = mockRequest({ body, userCase });
    const res = mockResponse();
    controller.post(req, res);

    expect(req.session.userCase).toEqual({
      dobDate: {
        year: '1990',
        month: '12',
        day: '24',
      },
      id: '1234',
      isStillWorking: StillWorking.WORKING,
    });

    expect(res.redirect).toBeCalledWith(PageUrls.NOTICE_PERIOD);
  });

  it('should redirect to notice end when NOTICE is selected', () => {
    const body = {};
    const userCase = {
      dobDate: { year: '1990', month: '12', day: '24' },
      id: '1234',
      isStillWorking: StillWorking.NOTICE,
    };

    const controller = new StartDateController(mockFormContent);

    const req = mockRequest({ body, userCase });
    const res = mockResponse();
    controller.post(req, res);

    expect(req.session.userCase).toEqual({
      dobDate: {
        year: '1990',
        month: '12',
        day: '24',
      },
      id: '1234',
      isStillWorking: StillWorking.NOTICE,
    });

    expect(res.redirect).toBeCalledWith(PageUrls.NOTICE_END);
  });

  it('should redirect to end date when NO LONGER WORKING is selected', () => {
    const body = {};
    const userCase = {
      dobDate: { year: '1990', month: '12', day: '24' },
      id: '1234',
      isStillWorking: StillWorking.NO_LONGER_WORKING,
    };

    const controller = new StartDateController(mockFormContent);

    const req = mockRequest({ body, userCase });
    const res = mockResponse();
    controller.post(req, res);

    expect(req.session.userCase).toEqual({
      dobDate: {
        year: '1990',
        month: '12',
        day: '24',
      },
      id: '1234',
      isStillWorking: StillWorking.NO_LONGER_WORKING,
    });

    expect(res.redirect).toBeCalledWith(PageUrls.END_DATE);
  });
});
