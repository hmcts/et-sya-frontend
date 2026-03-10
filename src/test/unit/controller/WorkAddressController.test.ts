import WorkAddressController from '../../../main/controllers/WorkAddressController';
import { AppRequest } from '../../../main/definitions/appRequest';
import { YesOrNo } from '../../../main/definitions/case';
import { PageUrls, TranslationKeys } from '../../../main/definitions/constants';
import { mockRequest, mockRequestWithSaveException } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';
import { userCaseWithRespondent } from '../mocks/mockUserCaseWithRespondent';

describe('Update Work Address Controller', () => {
  const t = {
    session: {
      params: {
        respondentNumber: '1',
      },
    },
    claimantWorkAddressQuestion: {},
    common: {},
  };

  it('should render the Work Address page', () => {
    const controller = new WorkAddressController();
    const response = mockResponse();
    const req = <AppRequest>mockRequest({ t });

    req.session.userCase = userCaseWithRespondent;

    controller.get(req, response);
    expect(response.render).toHaveBeenCalledWith(TranslationKeys.WORK_ADDRESS, expect.anything());
  });

  it('should redirect to acas cert num page when yes is selected', async () => {
    const body = { claimantWorkAddressQuestion: YesOrNo.YES };

    const controller = new WorkAddressController();

    const req = mockRequest({ body });
    const res = mockResponse();
    req.session.userCase = userCaseWithRespondent;

    await controller.post(req, res);

    expect(res.redirect).toHaveBeenCalledWith('/respondent/1/acas-cert-num');
    expect(req.session.userCase.claimantWorkAddressQuestion).toStrictEqual('Yes');
    const respondent = req.session.userCase.respondents[0];
    expect(req.session.userCase.workAddress1).toEqual(respondent.respondentAddress1);
    expect(req.session.userCase.workAddress2).toEqual(respondent.respondentAddress2);
    expect(req.session.userCase.workAddressTown).toEqual(respondent.respondentAddressTown);
    expect(req.session.userCase.workAddressCountry).toEqual(respondent.respondentAddressCountry);
    expect(req.session.userCase.workAddressPostcode).toEqual(respondent.respondentAddressPostcode);
  });

  it('should redirect to place of work page when no is selected', async () => {
    const body = { claimantWorkAddressQuestion: YesOrNo.NO };

    const controller = new WorkAddressController();

    const req = mockRequest({ body });
    const res = mockResponse();
    req.session.userCase = userCaseWithRespondent;

    await controller.post(req, res);

    expect(res.redirect).toHaveBeenCalledWith('/respondent/1/work-postcode-enter');
    expect(req.session.userCase.claimantWorkAddressQuestion).toStrictEqual('No');
  });

  it('should redirect WORK_POSTCODE_ENTER when returnUrl is cya and yes is selected', async () => {
    const body = { claimantWorkAddressQuestion: YesOrNo.YES };

    const controller = new WorkAddressController();

    const req = mockRequest({ body });
    const res = mockResponse();
    req.session.userCase = userCaseWithRespondent;
    req.session.returnUrl = PageUrls.CHECK_ANSWERS;

    await controller.post(req, res);

    expect(res.redirect).toHaveBeenCalledWith('/check-your-answers');
  });

  it('should redirect CHECK_ANSWERS when returnUrl is cya and no is selected', async () => {
    const body = { claimantWorkAddressQuestion: YesOrNo.NO };

    const controller = new WorkAddressController();

    const req = mockRequest({ body });
    const res = mockResponse();
    req.session.userCase = userCaseWithRespondent;
    req.session.returnUrl = PageUrls.CHECK_ANSWERS;

    await controller.post(req, res);

    expect(res.redirect).toHaveBeenCalledWith('/respondent/1/work-postcode-enter');
  });

  it('should redirect to your claim has been saved page and save respondent details when an answer is selected and save as draft clicked', async () => {
    const body = { claimantWorkAddressQuestion: YesOrNo.NO, saveForLater: true };

    const controller = new WorkAddressController();

    const req = mockRequest({ body });
    const res = mockResponse();
    req.session.userCase = userCaseWithRespondent;

    await controller.post(req, res);

    expect(res.redirect).toHaveBeenCalledWith(PageUrls.CLAIM_SAVED);
  });

  it('should redirect to your claim has been saved page when save as draft clicked and no answer selected', async () => {
    const body = { saveForLater: true };

    const controller = new WorkAddressController();

    const req = mockRequest({ body });
    const res = mockResponse();
    req.session.userCase = userCaseWithRespondent;

    await controller.post(req, res);

    expect(res.redirect).toHaveBeenCalledWith(PageUrls.CLAIM_SAVED);
  });

  it('should redirect to undefined when save as draft not clicked and no answer selected', async () => {
    const body = { saveForLater: false };

    const controller = new WorkAddressController();

    const req = mockRequest({ body });
    const res = mockResponse();
    req.session.userCase = userCaseWithRespondent;

    await controller.post(req, res);

    expect(res.redirect).toHaveBeenCalledWith(undefined);
    expect(req.session.userCase.claimantWorkAddressQuestion).toStrictEqual(YesOrNo.NO);
  });

  it('should redirect to undefined when save as draft not selected and no answer', async () => {
    const body = {};

    const controller = new WorkAddressController();

    const req = mockRequest({ body });
    const res = mockResponse();
    req.session.userCase = userCaseWithRespondent;

    await controller.post(req, res);

    expect(res.redirect).toHaveBeenCalledWith(undefined);
    expect(req.session.userCase.claimantWorkAddressQuestion).toStrictEqual(YesOrNo.NO);
  });

  it('should add work address question answer to the session userCase', async () => {
    const body = { claimantWorkAddressQuestion: YesOrNo.NO };
    const controller = new WorkAddressController();
    const req = mockRequest({ body });
    const res = mockResponse();

    await controller.post(req, res);
    expect(req.session.userCase.claimantWorkAddressQuestion).toStrictEqual(YesOrNo.NO);
  });

  it('should throw error, when session errors exists and unable to save session', async () => {
    const body = { saveForLater: false };

    const controller = new WorkAddressController();
    const err = new Error('Something went wrong');

    const req = mockRequestWithSaveException({
      body,
    });
    const res = mockResponse();
    req.session.userCase = userCaseWithRespondent;

    await expect(controller.post(req, res)).rejects.toThrow(err);
  });
});
