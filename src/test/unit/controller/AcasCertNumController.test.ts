import AcasCertNumController from '../../../main/controllers/AcasCertNumController';
import * as CaseHelper from '../../../main/controllers/helpers/CaseHelpers';
import { YesOrNo } from '../../../main/definitions/case';
import { PageUrls, TranslationKeys } from '../../../main/definitions/constants';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';
import { userCaseWithRespondent } from '../mocks/mockUserCaseWithRespondent';

jest.spyOn(CaseHelper, 'handleUpdateDraftCase').mockImplementation(() => Promise.resolve());

describe('Acas Cert Num Controller', () => {
  const t = {
    acasCert: {},
    common: {},
  };

  it('should render the acas cert num controller page', () => {
    const controller = new AcasCertNumController();

    const response = mockResponse();
    const request = mockRequest({ t });

    request.session.userCase = userCaseWithRespondent;

    controller.get(request, response);

    expect(response.render).toHaveBeenCalledWith(TranslationKeys.ACAS_CERT_NUM, expect.anything());
  });

  it('should redirect to respondent details check when yes is selected', async () => {
    const body = { acasCert: YesOrNo.YES, acasCertNum: 'R123453/12/21' };

    const controller = new AcasCertNumController();

    const req = mockRequest({ body });
    const res = mockResponse();
    req.session.userCase = userCaseWithRespondent;

    await controller.post(req, res);

    expect(res.redirect).toHaveBeenCalledWith(PageUrls.RESPONDENT_DETAILS_CHECK);
  });

  it('should redirect to no acas number reason when no is selected and remove acas cert num value', async () => {
    const body = { acasCert: YesOrNo.NO, saveForLater: false };

    const controller = new AcasCertNumController();

    const req = mockRequest({ body });
    const res = mockResponse();

    await controller.post(req, res);

    expect(res.redirect).toHaveBeenCalledWith('/respondent/1' + PageUrls.NO_ACAS_NUMBER);
    expect(req.session.userCase.respondents[0].acasCertNum).toEqual(undefined);
    expect(req.session.userCase.respondents[0].acasCert).toEqual(YesOrNo.NO);
  });

  it('should redirect to same page and throw error when nothing is selected', async () => {
    const body = { saveForLater: false };

    const controller = new AcasCertNumController();

    const req = mockRequest({ body });
    const res = mockResponse();
    req.url = PageUrls.ACAS_CERT_NUM;

    await controller.post(req, res);

    expect(res.redirect).toHaveBeenCalledWith(PageUrls.ACAS_CERT_NUM);
    expect(req.session.errors).toHaveLength(1);
  });

  it('should redirect to your claim has been saved page when save as draft selected', async () => {
    const body = { acasCert: YesOrNo.NO, saveForLater: true };

    const controller = new AcasCertNumController();

    const req = mockRequest({ body });
    const res = mockResponse();

    await controller.post(req, res);

    expect(res.redirect).toHaveBeenCalledWith(PageUrls.CLAIM_SAVED);
  });

  it('should redirect to your-claim-has-been-saved page when save as draft selected, acasCert is Yes and No acas certificate number entered', async () => {
    const body = { acasCert: YesOrNo.YES, saveForLater: true };

    const controller = new AcasCertNumController();

    const req = mockRequest({ body });
    const res = mockResponse();

    await controller.post(req, res);

    expect(res.redirect).toHaveBeenCalledWith(PageUrls.CLAIM_SAVED);
  });

  // it('should throw error, when session errors exists and unable to save session', async () => {
  //   const body = { acasCert: YesOrNo.YES, saveForLater: false };

  //   const controller = new AcasCertNumController();
  //   const err = new Error('Something went wrong');

  //   const req = mockRequestWithSaveException({
  //     body,
  //   });
  //   const res = mockResponse();
  //   expect(async function () {
  //     await await controller.post(req, res);
  //   }).toThrow(err);
  // });

  it('should add acas number to the session userCase', async () => {
    const body = { acasCert: YesOrNo.YES, acasCertNum: 'R123456/12/34' };
    const controller = new AcasCertNumController();
    const req = mockRequest({ body });
    const res = mockResponse();

    await controller.post(req, res);
    expect(req.session.userCase.respondents[0].acasCertNum).toEqual('R123456/12/34');
    expect(req.session.userCase.respondents[0].acasCert).toEqual(YesOrNo.YES);
  });

  it('should add MU acas number to the session userCase', async () => {
    const body = { acasCert: YesOrNo.YES, acasCertNum: 'MU123456/12/34' };
    const controller = new AcasCertNumController();
    const req = mockRequest({ body });
    const res = mockResponse();

    await controller.post(req, res);
    expect(req.session.userCase.respondents[0].acasCertNum).toEqual('MU123456/12/34');
    expect(req.session.userCase.respondents[0].acasCert).toEqual(YesOrNo.YES);
  });
});
