import EmploymentAndRespondentCheckController from '../../../main/controllers/EmploymentAndRespondentCheckController';
import * as CaseHelper from '../../../main/controllers/helpers/CaseHelpers';
import { YesOrNo } from '../../../main/definitions/case';
import { PageUrls, TranslationKeys } from '../../../main/definitions/constants';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

jest.spyOn(CaseHelper, 'handleUpdateDraftCase').mockImplementation(() => Promise.resolve());

describe('Test task List check controller', () => {
  const t = {
    employmentAndRespondentCheck: {},
    common: {},
  };

  it('should render the task list check page', () => {
    const controller = new EmploymentAndRespondentCheckController();

    const response = mockResponse();
    const request = mockRequest({ t });

    controller.get(request, response);

    expect(response.render).toHaveBeenCalledWith(TranslationKeys.TASK_LIST_CHECK, expect.anything());
  });

  it('should render the claim steps page when employmentAndRespondentCheck is Yes and userCase is valid', async () => {
    const body = { employmentAndRespondentCheck: YesOrNo.YES };
    const userCase: Record<string, any> = {
      respondents: [
        {
          respondentAddress1: '123 Street',
          respondentAddressTown: 'Town',
          respondentAddressCountry: 'Country',
          respondentAddressPostcode: 'AB12 3CD',
          acasCert: 'Yes',
          acasCertNum: '123456',
        },
      ],
    };
    const controller = new EmploymentAndRespondentCheckController();

    const req = mockRequest({ body, userCase });
    const res = mockResponse();

    await controller.post(req, res);

    expect(res.redirect).toHaveBeenCalledWith(PageUrls.CLAIM_STEPS);
  });

  it('should render same page if nothing selected', async () => {
    const errors = [{ propertyName: 'employmentAndRespondentCheck', errorType: 'required' }];
    const body = { employmentAndRespondentCheck: '' };
    const controller = new EmploymentAndRespondentCheckController();

    const req = mockRequest({ body });
    const res = mockResponse();
    await controller.post(req, res);

    expect(res.redirect).toHaveBeenCalledWith(req.path);
    expect(req.session.errors).toEqual(errors);
  });

  it('should render the task list check page with errors when isValid is false', async () => {
    const body = { employmentAndRespondentCheck: YesOrNo.YES };
    const errors = [{ propertyName: 'employmentAndRespondentCheck', errorType: 'invalid' }];
    const controller = new EmploymentAndRespondentCheckController();

    const req = mockRequest({ body });
    const res = mockResponse();

    jest
      .spyOn(require('../../../main/components/form/claim-details-validator'), 'validateEmploymentAndRespondentDetails')
      .mockReturnValue(false);

    await controller.post(req, res);

    expect(req.session.errors).toEqual(errors);
    expect(res.render).toHaveBeenCalledWith(TranslationKeys.TASK_LIST_CHECK, expect.anything());
  });
});
