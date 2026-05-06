import ClaimantEmploymentStartDateController from '../../../main/controllers/ClaimantEmploymentStartDateController';
import * as CaseHelper from '../../../main/controllers/helpers/CaseHelpers';
import { PageUrls, TranslationKeys } from '../../../main/definitions/constants';
import { mockRequest, mockRequestEmpty } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

jest.spyOn(CaseHelper, 'handleUpdateDraftCase').mockImplementation(() => Promise.resolve());

describe('ClaimantEmploymentStartDateController', () => {
  const t = {
    'claimant-employment-start-date': {},
    common: {},
  };

  it('should render the claimant employment start date page', () => {
    const controller = new ClaimantEmploymentStartDateController();
    const response = mockResponse();
    const request = mockRequest({ t });

    controller.get(request, response);

    expect(response.render).toHaveBeenCalledWith(TranslationKeys.CLAIMANT_EMPLOYMENT_START_DATE, expect.anything());
  });

  it('should redirect to NOTICE_PERIOD on valid submission', async () => {
    const body = {
      'startDate-day': '15',
      'startDate-month': '06',
      'startDate-year': '2020',
    };
    const controller = new ClaimantEmploymentStartDateController();
    const req = mockRequestEmpty({ body });
    const res = mockResponse();

    await controller.post(req, res);

    expect(res.redirect).toHaveBeenCalledWith(PageUrls.NOTICE_PERIOD);
  });

  it('should redirect to the same page when date fields are invalid', async () => {
    const errors = [{ propertyName: 'startDate', errorType: 'dayRequired', fieldName: 'day' }];
    const body = {
      'startDate-day': '',
      'startDate-month': '06',
      'startDate-year': '2020',
    };
    const controller = new ClaimantEmploymentStartDateController();
    const req = mockRequestEmpty({ body });
    const res = mockResponse();

    await controller.post(req, res);

    expect(res.redirect).toHaveBeenCalledWith(req.path);
    expect(req.session.errors).toEqual(errors);
  });

  it('should save startDate to session userCase', async () => {
    const body = {
      'startDate-day': '15',
      'startDate-month': '06',
      'startDate-year': '2020',
    };
    const controller = new ClaimantEmploymentStartDateController();
    const req = mockRequestEmpty({ body });
    const res = mockResponse();

    await controller.post(req, res);

    expect(req.session.userCase.startDate).toStrictEqual({ day: '15', month: '06', year: '2020' });
  });
});
