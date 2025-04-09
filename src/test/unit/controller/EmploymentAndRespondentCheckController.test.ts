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

  it('should render the claim steps page', async () => {
    const body = { employmentAndRespondentCheck: YesOrNo.YES };
    const userCase: Record<string, any> = {
      pastEmployer: 'Yes', // Required field
      startDate: { year: '2022', month: '01', day: '01' }, // Required if pastEmployer is 'Yes'
      isStillWorking: 'Notice', // Required field
      noticeEnds: { year: '2023', month: '12', day: '31' }, // Required if isStillWorking is 'Notice'
      claimantWorkAddressQuestion: '123 Work Street, London', // Required field
      respondentEnterPostcode: 'SW1A 1AA', // Required field
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
      .spyOn(require('../../../main/components/form/claimDetailsValidator'), 'validateEmploymentAndRespondentDetails')
      .mockReturnValue(false);

    await controller.post(req, res);

    expect(req.session.errors).toEqual(errors);
    expect(res.render).toHaveBeenCalledWith(TranslationKeys.TASK_LIST_CHECK, expect.anything());
  });
});
