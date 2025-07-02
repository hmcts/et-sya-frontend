import BenefitsController from '../../../main/controllers/BenefitsController';
import * as CaseHelper from '../../../main/controllers/helpers/CaseHelpers';
import { StillWorking, YesOrNo } from '../../../main/definitions/case';
import { PageUrls, TranslationKeys } from '../../../main/definitions/constants';
import { mockRequest, mockRequestEmpty } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

jest.spyOn(CaseHelper, 'handleUpdateDraftCase').mockImplementation(() => Promise.resolve());

describe('Benefits Controller', () => {
  const t = {
    benefits: {},
    common: {},
  };

  it('should render benefits page', () => {
    const benefitsController = new BenefitsController();
    const response = mockResponse();
    const request = mockRequest({ t });

    benefitsController.get(request, response);
    expect(response.render).toHaveBeenCalledWith(TranslationKeys.BENEFITS, expect.anything());
  });

  it('should clear fields', () => {
    const benefitsController = new BenefitsController();
    const response = mockResponse();
    const request = mockRequest({ t });
    request.session.userCase.employeeBenefits = YesOrNo.YES;
    request.session.userCase.benefitsCharCount = 'blah';
    request.query = {
      redirect: 'clearSelection',
    };
    benefitsController.get(request, response);
    expect(request.session.userCase.employeeBenefits).toStrictEqual(undefined);
    expect(request.session.userCase.benefitsCharCount).toStrictEqual(undefined);
    expect(response.render).toHaveBeenCalledWith(TranslationKeys.BENEFITS, expect.anything());
  });

  it('should render the new job page when no longer working and yes radio button is selected', async () => {
    const body = { employeeBenefits: YesOrNo.YES, benefitsCharCount: 'Test benefits text' };
    const userCase = { isStillWorking: StillWorking.NO_LONGER_WORKING };
    const controller = new BenefitsController();

    const req = mockRequest({ body, userCase });
    const res = mockResponse();
    await controller.post(req, res);

    expect(res.redirect).toHaveBeenCalledWith(PageUrls.NEW_JOB);
  });

  it('should render the respondent name page when working or notice and no radio button is selected', async () => {
    const body = { employeeBenefits: YesOrNo.YES, benefitsCharCount: 'Test benefits text' };
    const userCase = { isStillWorking: StillWorking.WORKING || StillWorking.NOTICE };
    const controller = new BenefitsController();

    const req = mockRequest({ body, userCase });
    const res = mockResponse();
    await controller.post(req, res);

    expect(res.redirect).toHaveBeenCalledWith(PageUrls.FIRST_RESPONDENT_NAME);
  });

  it('should render the have you got a new job page when no longer working radio button is selected', async () => {
    const body = { employeeBenefits: YesOrNo.YES, benefitsCharCount: 'Test benefits text' };
    const userCase = { isStillWorking: StillWorking.NO_LONGER_WORKING };
    const controller = new BenefitsController();

    const req = mockRequest({ body, userCase });
    const res = mockResponse();
    await controller.post(req, res);

    expect(res.redirect).toHaveBeenCalledWith(PageUrls.NEW_JOB);
  });

  it('should add the benefits form value to the userCase', async () => {
    const body = { employeeBenefits: YesOrNo.YES, benefitsCharCount: 'Test benefits text' };

    const controller = new BenefitsController();

    const req = mockRequestEmpty({ body });
    const res = mockResponse();

    await controller.post(req, res);

    expect(req.session.userCase).toStrictEqual({
      ...body,
      state: 'AWAITING_SUBMISSION_TO_HMCTS',
    });
  });

  it('should reset benefits if No selected', async () => {
    const body = { employeeBenefits: YesOrNo.NO };

    const controller = new BenefitsController();

    const req = mockRequestEmpty({ body });
    const res = mockResponse();

    await controller.post(req, res);

    expect(req.session.userCase).toStrictEqual({ employeeBenefits: YesOrNo.NO, benefitsCharCount: undefined, state: 'AWAITING_SUBMISSION_TO_HMCTS' });
  });
});
