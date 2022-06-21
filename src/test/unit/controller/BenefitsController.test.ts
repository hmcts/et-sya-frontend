import BenefitsController from '../../../main/controllers/BenefitsController';
import { StillWorking, YesOrNo } from '../../../main/definitions/case';
import { PageUrls, TranslationKeys } from '../../../main/definitions/constants';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

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

  it('should render the new job page when no longer working and yes radio button is selected', () => {
    const body = { employeeBenefits: YesOrNo.YES, benefitsCharCount: 'Test benefits text' };
    const userCase = { isStillWorking: StillWorking.NO_LONGER_WORKING };
    const controller = new BenefitsController();

    const req = mockRequest({ body, userCase });
    const res = mockResponse();
    controller.post(req, res);

    expect(res.redirect).toBeCalledWith(PageUrls.NEW_JOB);
  });

  it('should render the respondent name page when working or notice and no radio button is selected', () => {
    const body = { employeeBenefits: YesOrNo.YES, benefitsCharCount: 'Test benefits text' };
    const userCase = { isStillWorking: StillWorking.WORKING || StillWorking.NOTICE };
    const controller = new BenefitsController();

    const req = mockRequest({ body, userCase });
    const res = mockResponse();
    controller.post(req, res);

    expect(res.redirect).toBeCalledWith(PageUrls.RESPONDENT_NAME);
  });

  it('should render the have you got a new job page when no longer working radio button is selected', () => {
    const body = { employeeBenefits: YesOrNo.YES, benefitsCharCount: 'Test benefits text' };
    const userCase = { isStillWorking: StillWorking.NO_LONGER_WORKING };
    const controller = new BenefitsController();

    const req = mockRequest({ body, userCase });
    const res = mockResponse();
    controller.post(req, res);

    expect(res.redirect).toBeCalledWith(PageUrls.NEW_JOB);
  });

  it('should add the benefits form value to the userCase', () => {
    const body = { employeeBenefits: YesOrNo.NO };

    const controller = new BenefitsController();

    const req = mockRequest({ body });
    const res = mockResponse();
    req.session.userCase = undefined;

    controller.post(req, res);

    expect(req.session.userCase).toStrictEqual({ employeeBenefits: YesOrNo.NO });
  });
});
